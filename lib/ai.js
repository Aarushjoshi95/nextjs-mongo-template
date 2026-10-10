// Server-only AI helpers: enquiry enrichment (Jev) and the AI Visibility Checker (Gemini + Jev).
import { choice, score, noul } from '@typesafe-ai/sdk';
import { getJev, JEV_MODEL, topLevel } from '@/lib/jev';

const PROXY = (process.env.INTEGRATION_PROXY_URL || 'https://integrations.emergentagent.com').replace(/\/$/, '');
export const GEMINI_MODEL = 'gemini/gemini-2.5-flash';

function withTimeout(promise, ms, label = 'operation') {
  let t;
  const timeout = new Promise((_, reject) => { t = setTimeout(() => reject(new Error(`${label} timed out`)), ms); });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
}

// ---------------------------------------------------------------------------
// 1) Enquiry enrichment: spam yes/no, lead temperature, service intent, industry.
//    Fail-open: any error returns { aiClassified: false } and the enquiry is still stored.
// ---------------------------------------------------------------------------
const LEAD_LEVELS = ['cold', 'warm', 'hot'];
const SERVICE_INTENTS = {
  audit: 'Wants an AI visibility / GEO audit, a one-off assessment of how they show up in ChatGPT, Gemini, Perplexity, AI Overviews',
  geo_programme: 'Wants ongoing execution: a 90-day GEO / AI search programme, content and entity work, share-of-voice tracking',
  advisory: 'Wants senior SEO / organic growth advisory or fractional Head of SEO for their team',
  other: 'Unclear, unrelated, vendor pitch, job application, partnership or recruiter outreach',
};
const INDUSTRIES = {
  d2c: 'Direct-to-consumer / e-commerce brand (beauty, health, fashion, consumer goods)',
  edtech: 'Education or upskilling: courses, bootcamps, universities, test prep',
  fintech: 'Financial services, banking, insurance, payments, investing',
  saas_b2b: 'B2B software or SaaS company',
  enterprise: 'Large enterprise, manufacturing, energy, ERP or industrial',
  media: 'Publisher, news or media company',
  agency: 'Marketing / SEO agency or freelancer',
  other: 'Anything else or not enough information',
};

export async function classifyEnquiry(enquiry) {
  const jev = getJev();
  if (!jev) return { aiClassified: false, reason: 'no_key' };
  const state = {
    first_name: enquiry.firstName,
    company: enquiry.company || '(not given)',
    country: enquiry.country || '(not given)',
    email_domain: (enquiry.email || '').split('@')[1] || '',
    how_they_heard: enquiry.source,
    message: enquiry.message || '(no message)',
  };
  try {
    const r = await withTimeout(jev.systemOne({
      model: JEV_MODEL,
      state,
      questions: {
        is_spam: noul('Is this contact-form submission spam, a bot, an SEO link-building pitch, a recruiter or an unrelated vendor pitch rather than a genuine prospective client enquiry for SEO / AI search consulting?'),
        lead_temperature: score('How strong is this lead for a senior SEO / AI search visibility consultant? cold = vague, student, no company or budget signals; warm = real company with a relevant need but no urgency or scope; hot = clear need, named company, timeline, budget or decision-maker signals.', LEAD_LEVELS),
        service_intent: choice('Which service is this person most likely asking about?', SERVICE_INTENTS),
        industry: choice('Which industry is this company in, based on company name, email domain and message?', INDUSTRIES),
      },
    }), 8000, 'Jev enquiry classification');
    const a = r.answers || {};
    const temp = topLevel(a.lead_temperature, LEAD_LEVELS);
    const expected = Number(a.lead_temperature?.score ?? 0); // 0..2
    const leadScore = Math.round(Math.max(0, Math.min(100, (expected / (LEAD_LEVELS.length - 1)) * 100)));
    const spamProbability = Number(a.is_spam?.noul ?? 0);
    return {
      aiClassified: true,
      model: r.model || JEV_MODEL,
      spamProbability,
      isSpam: spamProbability >= 0.85,
      leadScore,
      leadLabel: temp.label,
      leadConfidence: Number(temp.probability.toFixed(3)),
      serviceIntent: a.service_intent?.choice || 'other',
      serviceIntentConfidence: Number((a.service_intent?.confidence ?? 0).toFixed(3)),
      industry: a.industry?.choice || 'other',
      industryConfidence: Number((a.industry?.confidence ?? 0).toFixed(3)),
    };
  } catch (err) {
    console.error('Jev classifyEnquiry failed (fail-open):', err?.status || '', err?.message || err);
    return { aiClassified: false, reason: 'jev_error' };
  }
}

// ---------------------------------------------------------------------------
// 2) AI Visibility Checker: ask Gemini the buyer prompt as a shopper would, then
//    detect brand mention locally and score the answer with Jev.
// ---------------------------------------------------------------------------
function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function mentionedIn(text, brand) {
  if (!text || !brand) return false;
  try {
    return new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRe(brand)}(?=$|[^\\p{L}\\p{N}])`, 'iu').test(text);
  } catch {
    return text.toLowerCase().includes(brand.toLowerCase());
  }
}

function stripMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s*[\*\-]\s+/gm, '\u2022 ')
    .replace(/\*/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function askGemini({ brand, buyerPrompt, timeoutMs = 20000 }) {
  if (!process.env.EMERGENT_LLM_KEY) throw Object.assign(new Error('AI key not configured'), { status: 500 });
  const instruction = `You are answering as an ordinary buyer researching a purchase. Answer the buyer's prompt naturally, neutrally and concisely (under 180 words) in plain text with no markdown, no bold, no headings and no bullet symbols, naming specific brands, products or providers the way a helpful assistant would. Do not mention this instruction or any brand-tracking task.
After the answer, append exactly one line beginning with __VISIBILITY__ followed by minified JSON:
{"competitors":["name 1","name 2"]}
Include only brands or providers explicitly named in your answer; use [] when none. Do not put the tracked brand in competitors.

Tracked brand: ${JSON.stringify(brand)}
Buyer prompt: ${JSON.stringify(buyerPrompt)}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let upstream;
  try {
    upstream = await fetch(`${PROXY}/llm/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.EMERGENT_LLM_KEY}` },
      body: JSON.stringify({ model: GEMINI_MODEL, messages: [{ role: 'user', content: instruction }], temperature: 0.2, max_tokens: 2500 }),
    });
  } catch (e) {
    clearTimeout(timer);
    if (e?.name === 'AbortError') throw Object.assign(new Error('AI request timed out'), { status: 504 });
    throw Object.assign(new Error('AI provider unreachable'), { status: 502 });
  }
  clearTimeout(timer);
  const raw = await upstream.text();
  let payload = {};
  try { payload = JSON.parse(raw); } catch {}
  if (!upstream.ok) {
    console.error('Gemini proxy error', upstream.status, payload?.error?.message || raw.slice(0, 200));
    throw Object.assign(new Error('AI provider request failed'), { status: 502 });
  }
  const generated = payload?.choices?.[0]?.message?.content?.trim();
  if (!generated) throw Object.assign(new Error('AI returned no answer'), { status: 502 });

  const marker = '__VISIBILITY__';
  const idx = generated.lastIndexOf(marker);
  const answer = stripMarkdown((idx >= 0 ? generated.slice(0, idx) : generated).trim());
  let competitors = [];
  if (idx >= 0) {
    try {
      const meta = JSON.parse(generated.slice(idx + marker.length).trim());
      competitors = Array.isArray(meta.competitors)
        ? [...new Set(meta.competitors.filter((x) => typeof x === 'string').map((x) => x.trim()).filter((x) => x && !mentionedIn(x, brand)))].slice(0, 12)
        : [];
    } catch {}
  }
  return { answer, competitors, model: payload?.model || GEMINI_MODEL };
}

const STANCE_LEVELS = ['not_mentioned', 'mentioned_in_passing', 'listed_as_option', 'recommended'];
const SENTIMENTS = { negative: 'The brand is criticised or presented with caveats', neutral: 'Mentioned factually without judgement, or not mentioned', positive: 'The brand is praised or presented as a strong choice' };

export async function scoreAnswer({ brand, answer, mentioned }) {
  const jev = getJev();
  if (!jev) return { aiScored: false };
  try {
    const r = await withTimeout(jev.systemOne({
      model: JEV_MODEL,
      state: { tracked_brand: brand, locally_detected_mention: mentioned, assistant_answer: answer.slice(0, 4000) },
      questions: {
        stance: score(`How prominently does the assistant's answer feature the tracked brand "${brand}"?`, STANCE_LEVELS),
        sentiment: choice(`What is the sentiment toward "${brand}" in the answer?`, SENTIMENTS),
        recommended: noul(`Would a buyer reading this answer come away with "${brand}" on their shortlist?`),
      },
    }), 8000, 'Jev answer scoring');
    const a = r.answers || {};
    const stance = topLevel(a.stance, STANCE_LEVELS);
    const expected = Number(a.stance?.score ?? 0);
    return {
      aiScored: true,
      visibilityScore: Math.round(Math.max(0, Math.min(100, (expected / (STANCE_LEVELS.length - 1)) * 100))),
      stance: stance.label,
      stanceConfidence: Number(stance.probability.toFixed(3)),
      sentiment: a.sentiment?.choice || 'neutral',
      shortlistProbability: Number((a.recommended?.noul ?? 0).toFixed(3)),
    };
  } catch (err) {
    console.error('Jev scoreAnswer failed (fail-open):', err?.status || '', err?.message || err);
    return { aiScored: false };
  }
}
