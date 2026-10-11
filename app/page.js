import Link from 'next/link';
import { ArrowRight, Check, X as XIcon } from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import PromptDemo from '@/components/site/PromptDemo';
import FAQ from '@/components/site/FAQ';
import BrandWall from '@/components/site/BrandWall';
import ProofResults from '@/components/site/ProofResults';
import CaseStudyCarousel from '@/components/site/CaseStudyCarousel';
import { BookButton, CAL_LINK } from '@/components/site/BookingModal';

export const metadata = {
  title: 'Aarush · Get recommended when buyers ask AI',
  description: 'AI search visibility for funded startups, D2C and edtech. I help brands show up, get cited and get chosen inside ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews — tied to leads and revenue.',
  alternates: { canonical: '/' },
};

const offers = [
  { tag: 'Start here · 2–3 weeks', title: 'AI Visibility Audit', body: 'I map 100–300 buying prompts across four engines and show you where you are named, where competitors are named instead, and which sources the models lean on. You get a ranked fix list.', fit: 'teams that suspect they are invisible in AI answers but cannot prove it yet.', cta: 'See the audit deliverables' },
  { tag: 'Most chosen · 90 days', title: 'GEO Programme', body: 'Audit, then execution. Entity and schema fixes, answer-ready pages, comparison content, and placement on the third-party sources AI engines cite. Reported weekly as share of voice per engine.', fit: 'brands in a crowded category where the AI shortlist decides who gets the call.', cta: 'Explore the programme', highlight: true },
  { tag: 'Ongoing · retainer', title: 'Organic + AI Growth Advisory', body: 'One owner for SEO and AI search, accountable to pipeline. Strategy, prioritisation, attribution and automation for your in-house or agency team.', fit: 'teams that need senior direction without hiring a full-time Head of SEO.', cta: 'Talk about advisory' },
];

// Case study cards — real numbers from Aarush's Fueler portfolio.
const cases = [
  {
    tags: ['D2C · Beauty', 'Content velocity', 'Technical', 'Links'],
    title: '157% blog clicks growth in one quarter for India’s leading beauty brand',
    headline: '+157.94%', headlineLabel: 'blog clicks, Q/Q (78.7K → 203K)',
    beforeLabel: 'Traffic', beforeValue: '26K/mo', afterLabel: 'Traffic', afterValue: '66K/mo',
    chips: [{ k: '+121.94%', v: 'impressions' }, { k: '25–80%', v: 'leads lift' }, { k: '17.1 → 13.4', v: 'avg. position' }],
    slug: 'd2c-beauty-brand-157-percent-growth',
  },
  {
    tags: ['D2C · Luxury', 'Money pages', 'Hub & spoke', 'Technical'],
    title: 'Money pages from positions 30–40 into the top 5 — revenue +30% a month',
    headline: '+30%/mo', headlineLabel: 'direct attributable revenue',
    beforeLabel: 'Non-brand', beforeValue: '260K/mo', afterLabel: 'Non-brand', afterValue: '397K/mo',
    chips: [{ k: '+43%', v: 'sessions (350K → 500K)' }, { k: '~48K', v: 'extra money-page clicks in 28 days' }, { k: '−20%', v: 'index bloat' }],
    slug: 'luxury-d2c-48-percent-growth-6-months',
  },
  {
    tags: ['Publishing · News', 'Google News', 'Discover'],
    title: '250K to 1M+ monthly organic sessions for a US news media giant',
    headline: '4×', headlineLabel: 'organic sessions in a year',
    beforeLabel: 'Sessions', beforeValue: '250K', afterLabel: 'Sessions', afterValue: '1M+',
    chips: [{ k: '95%', v: 'Core Web Vitals' }, { k: '2M+', v: 'sessions in Q1 after relaunch' }, { k: '−40%', v: 'reporting toil' }],
    slug: 'news-media-108-percent-organic-growth',
  },
  {
    tags: ['Publishing · Lifestyle', 'AMP Web Stories', 'Discover'],
    title: '2.2M Google Discover impressions in 3 months — on a sub-DR-25 lifestyle site',
    headline: '164K', headlineLabel: 'Discover clicks, top 10 articles, in 3 months',
    beforeLabel: 'Impressions / qtr', beforeValue: '4.7M', afterLabel: 'Impressions / qtr', afterValue: '24.3M',
    chips: [{ k: '+414%', v: 'quarterly search impressions' }, { k: '5.2×', v: 'top-10 keywords' }, { k: '99.1%', v: 'good mobile URLs (from 0%)' }],
    slug: 'google-discover-1m-traffic-3-months',
  },
  {
    tags: ['Technical SEO', 'Core Web Vitals', 'Mobile-first'],
    title: '99.1% Good URLs on mobile — and a 5× keyword lift',
    headline: '99.1%', headlineLabel: 'Good URLs on mobile',
    beforeLabel: 'Good URLs', beforeValue: '~60%', afterLabel: 'Good URLs', afterValue: '99.1%',
    chips: [{ k: '+735K', v: 'impressions gained' }, { k: '5×', v: 'ranking keywords' }, { k: '+1M', v: 'Discover pageviews Q1' }],
    slug: 'core-web-vitals-99-good-urls',
  },
];

const reportMetrics = [
  { code: 'mention_rate', title: 'Mentions', body: 'Share of tracked prompts where each engine names you.' },
  { code: 'citation_rate', title: 'Citations', body: 'How often your own pages are the linked source.' },
  { code: 'share_of_voice', title: 'Share of voice', body: 'Your mentions against the competitors named beside you.' },
  { code: 'ai_leads', title: 'AI-referred leads', body: 'Sessions and leads from AI engines, including the “direct” ones.' },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main">
        {/* HERO */}
        <section id="top" className="pt-14 lg:pt-20 pb-16 lg:pb-24">
          <div className="container-max">
            <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
              <div className="fade-in">
                <span className="eyebrow mb-8">For funded startups, D2C and edtech brands</span>
                <h1 className="text-[clamp(40px,6.5vw,76px)] font-semibold leading-[1.03] tracking-[-0.025em] mb-7">
                  Get recommended when buyers ask <span className="text-[rgb(var(--accent))]">AI</span>.
                </h1>
                <p className="text-[clamp(17px,1.5vw,20px)] text-[rgb(var(--muted))] max-w-xl leading-[1.6] mb-6">
                  I help brands show up, get cited and get chosen inside ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews — and I tie that visibility back to leads and revenue.
                </p>
                <div className="flex flex-wrap gap-2 mb-9">
                  {['Founders', 'CMOs', 'Heads of Growth', 'SEO leads'].map((r) => <span key={r} className="pill">{r}</span>)}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <BookButton className="btn-primary" data-testid="hero-book-button">Book a discovery call<ArrowRight className="w-4 h-4" /></BookButton>
                  <Link href="#proof" className="btn-ghost">See the proof</Link>
                </div>
                <p className="text-[14px] text-[rgb(var(--muted))] mt-8 max-w-md">8+ years in organic growth. Now focused on one question: <span className="text-[rgb(var(--ink))] font-medium">when your buyer asks an AI, does it name you?</span></p>
              </div>
              <PromptDemo />
            </div>
          </div>
        </section>

        {/* PROOF STRIP */}
        <section className="border-y border-[rgb(var(--line))] bg-[rgb(var(--surface))]">
          <div className="container-max py-14">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4 md:divide-x md:divide-[rgb(var(--line))]">
              {[
                { v: '8+ yrs', l: 'organic growth across edtech, D2C, fintech' },
                { v: '0 → $1Mn+', l: 'ARR built through organic' },
                { v: '50Mn+', l: 'traffic added across clients' },
                { v: '4 engines', l: 'tracked prompt by prompt: ChatGPT, Claude, Gemini, Perplexity' },
              ].map((s, i) => (
                <div key={i} className="md:px-8 first:md:pl-0">
                  <div className="font-mono text-[clamp(28px,4vw,42px)] font-medium text-[rgb(var(--accent))] leading-none tracking-tight">{s.v}</div>
                  <div className="text-[12px] uppercase tracking-[0.08em] text-[rgb(var(--muted))] mt-4 leading-snug max-w-[220px]">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* THE SEARCH BOX MOVED */}
        <section className="section-y">
          <div className="container-max">
            <div className="max-w-3xl mb-14">
              <span className="eyebrow mb-6">The search box moved</span>
              <h2 className="text-[clamp(32px,5vw,56px)] font-semibold leading-[1.07] tracking-tight">Your buyers still search. They just ask a model first.</h2>
              <p className="text-[rgb(var(--muted))] text-[18px] mt-6 max-w-2xl leading-relaxed">A shortlist used to come from ten blue links. Now it comes from one generated answer that names three or four brands. If you are not in that answer, you are not in the deal — and your analytics will not tell you.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="card-surface p-8">
                <span className="eyebrow mb-5">How you are measured today</span>
                <h3 className="text-[24px] font-semibold tracking-tight mb-5">Rankings, sessions, CTR</h3>
                <ul className="space-y-3 text-[15px] text-[rgb(var(--muted))]">
                  <li className="flex gap-3"><span className="text-[rgb(var(--muted))] mt-2 w-1 h-1 rounded-full bg-current shrink-0" />Position 1 can sit under an AI answer that never mentions you</li>
                  <li className="flex gap-3"><span className="text-[rgb(var(--muted))] mt-2 w-1 h-1 rounded-full bg-current shrink-0" />AI-referred visits land as &ldquo;direct&rdquo;, with no UTM</li>
                  <li className="flex gap-3"><span className="text-[rgb(var(--muted))] mt-2 w-1 h-1 rounded-full bg-current shrink-0" />Competitors get cited from Reddit, reviews and listicles you never touched</li>
                </ul>
              </div>
              <div className="card-surface p-8 border-[rgb(var(--accent))]/30">
                <span className="eyebrow mb-5">What actually decides the shortlist</span>
                <h3 className="text-[24px] font-semibold tracking-tight mb-5">Mentions, citations, recommendation share</h3>
                <ul className="space-y-3 text-[15px] text-[rgb(var(--ink))]">
                  <li className="flex gap-3"><span className="text-[rgb(var(--accent))] mt-2 w-1.5 h-1.5 rounded-full bg-current shrink-0" />Which prompts your buyers ask, and who gets named in each</li>
                  <li className="flex gap-3"><span className="text-[rgb(var(--accent))] mt-2 w-1.5 h-1.5 rounded-full bg-current shrink-0" />Which sources the engines trust when they describe your category</li>
                  <li className="flex gap-3"><span className="text-[rgb(var(--accent))] mt-2 w-1.5 h-1.5 rounded-full bg-current shrink-0" />How AI-referred visitors convert once they reach you</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* OFFERS */}
        <section id="offers" className="section-y border-t border-[rgb(var(--line))] bg-[rgb(var(--surface))]">
          <div className="container-max">
            <div className="max-w-2xl mb-14">
              <span className="eyebrow mb-6">Ways to work together</span>
              <h2 className="text-[clamp(32px,5vw,56px)] font-semibold leading-[1.07] tracking-tight">Three ways to win the AI answer.</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {offers.map((o) => (
                <div key={o.title} className={`card-surface p-8 flex flex-col ${o.highlight ? 'border-[rgb(var(--accent))]/40 bg-[rgb(var(--accent))]/[0.03]' : ''}`}>
                  <span className="text-[11px] uppercase tracking-[0.12em] font-mono text-[rgb(var(--muted))] mb-5">{o.tag}</span>
                  <h3 className="text-[24px] font-semibold tracking-tight mb-4">{o.title}</h3>
                  <p className="text-[rgb(var(--muted))] text-[15px] leading-relaxed mb-5 flex-1">{o.body}</p>
                  <p className="text-[14px] text-[rgb(var(--ink))] mb-6"><strong>Best for:</strong> {o.fit}</p>
                  <BookButton className="link-underline mt-auto self-start">{o.cta} <ArrowRight className="w-3.5 h-3.5" /></BookButton>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FIT CHECK */}
        <section className="section-y border-t border-[rgb(var(--line))]">
          <div className="container-max">
            <div className="max-w-2xl mb-14">
              <span className="eyebrow mb-6">Fit check</span>
              <h2 className="text-[clamp(32px,5vw,56px)] font-semibold leading-[1.07] tracking-tight">Is AI visibility work right for you?</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="card-surface p-8">
                <h3 className="text-[20px] font-semibold tracking-tight mb-6">A good fit if</h3>
                <ul className="space-y-4">
                  {['Your buyers research before they buy (courses, health, finance, SaaS)','You already have organic traffic and a site that ranks for something','You can ship page and schema changes within a few weeks','You trust your GA4 and CRM data enough to attribute leads'].map((t) => (
                    <li key={t} className="flex gap-3 text-[15px]"><Check className="w-5 h-5 text-[rgb(var(--positive))] shrink-0 mt-0.5" />{t}</li>
                  ))}
                </ul>
              </div>
              <div className="card-surface p-8">
                <h3 className="text-[20px] font-semibold tracking-tight mb-6">Not a fit if</h3>
                <ul className="space-y-4">
                  {['You want a guaranteed mention by a date. Nobody can promise that honestly.','You need local footfall SEO for physical stores','You are looking for a content calendar vendor','The site is under a month old with no brand presence anywhere'].map((t) => (
                    <li key={t} className="flex gap-3 text-[15px] text-[rgb(var(--muted))]"><XIcon className="w-5 h-5 shrink-0 mt-0.5" />{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* RESULTS BAND — Proof, not just theory */}
        <ProofResults />

        {/* CASE STUDIES */}
        <section id="proof" className="section-y border-t border-[rgb(var(--line))] bg-[rgb(var(--surface))]">
          <div className="container-max">
            <div className="max-w-3xl mb-12">
              <span className="eyebrow mb-6">Brands &amp; breakdowns</span>
              <h2 className="text-[clamp(32px,5vw,56px)] font-semibold leading-[1.07] tracking-tight">Growth teams I&rsquo;ve worked with, building <span className="text-[rgb(var(--accent))]">greater outcomes</span>.</h2>
              <p className="text-[rgb(var(--muted))] text-[17px] mt-5 max-w-2xl">From D2C beauty to enterprise and edtech. Below the brands: the case studies, each showing the constraint, what changed, and the business number it moved.</p>
            </div>
            <BrandWall />
            <div className="flex items-center gap-4 mt-16 mb-8">
              <span className="text-[11px] uppercase tracking-[0.14em] font-mono text-[rgb(var(--muted))] shrink-0">Case studies</span>
              <span className="h-px flex-1 bg-[rgb(var(--line))]" />
            </div>
            <CaseStudyCarousel cases={cases} />
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="section-y border-t border-[rgb(var(--line))]">
          <div className="container-max">
            <div className="max-w-2xl mb-14">
              <span className="eyebrow mb-6">How it works</span>
              <h2 className="text-[clamp(32px,5vw,56px)] font-semibold leading-[1.07] tracking-tight">Your first 90 days.</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-10 md:gap-6">
              {[
                { phase: 'Weeks 1–2 · Map', h: 'Find the prompts that decide your deals', b: 'Build the buyer prompt set, run it across four engines, and record who gets named, cited and recommended.' },
                { phase: 'Weeks 3–6 · Fix', h: 'Make your brand easy to cite', b: 'Entity and schema clean-up, answer-ready pages, comparison content, and the third-party sources the models already trust.' },
                { phase: 'Months 2–3 · Prove', h: 'Track share of voice and leads', b: 'Weekly share of voice per engine, plus AI-referred sessions and leads joined to your CRM. Visibility you can take to the board.' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="font-mono text-[72px] font-medium text-[rgb(var(--accent))]/20 leading-none mb-5">0{i+1}</div>
                  <div className="text-[11px] uppercase tracking-[0.12em] text-[rgb(var(--muted))] font-mono mb-3">{s.phase}</div>
                  <h3 className="text-[22px] font-semibold tracking-tight mb-3">{s.h}</h3>
                  <p className="text-[rgb(var(--muted))] text-[15px] leading-relaxed max-w-sm">{s.b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT I REPORT */}
        <section className="section-y border-t border-[rgb(var(--line))] bg-[rgb(var(--surface))]">
          <div className="container-max">
            <div className="max-w-2xl mb-14">
              <span className="eyebrow mb-6">What I report</span>
              <h2 className="text-[clamp(32px,5vw,56px)] font-semibold leading-[1.07] tracking-tight">Four numbers, every week.</h2>
              <p className="text-[rgb(var(--muted))] text-[17px] mt-5">Most AI visibility reports stop at &ldquo;you were mentioned&rdquo;. I report the chain from answer to revenue.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {reportMetrics.map((m) => (
                <div key={m.code} className="card-surface p-6">
                  <code className="text-[12px] text-[rgb(var(--accent))] font-mono">{m.code}</code>
                  <h3 className="text-[20px] font-semibold tracking-tight mt-3 mb-3">{m.title}</h3>
                  <p className="text-[14px] text-[rgb(var(--muted))] leading-relaxed">{m.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section-y border-t border-[rgb(var(--line))]">
          <div className="container-max">
            <div className="max-w-2xl mb-10">
              <span className="eyebrow mb-6">Common questions</span>
              <h2 className="text-[clamp(32px,5vw,56px)] font-semibold leading-[1.07] tracking-tight">Before you book.</h2>
            </div>
            <FAQ />
          </div>
        </section>

        {/* BOOK */}
        <section id="book" className="section-y border-t border-[rgb(var(--line))] bg-[rgb(var(--surface))]">
          <div className="container-max">
            <div className="max-w-3xl">
              <span className="eyebrow mb-6">Book a discovery call</span>
              <h2 className="text-[clamp(32px,5vw,56px)] font-semibold leading-[1.05] tracking-tight mb-6">Find out what ChatGPT says about you before your buyers do.</h2>
              <p className="text-[rgb(var(--muted))] text-[18px] mb-8 max-w-2xl">30 minutes. You leave with a read on where you stand across four engines, whether or not we work together.</p>
              <div className="flex flex-wrap items-center gap-3">
                <BookButton className="btn-primary" data-testid="book-section-button">Book a discovery call<ArrowRight className="w-4 h-4" /></BookButton>
                <a href={CAL_LINK} target="_blank" rel="noreferrer noopener" className="btn-ghost">Or pick a slot directly</a>
              </div>
              <ol className="mt-14 grid md:grid-cols-3 gap-8">
                {[
                  { k: 'Before the call.', v: 'I run your top buying prompts across ChatGPT, Claude, Gemini and Perplexity.' },
                  { k: 'On the call.', v: 'We look at who gets named instead of you, and why.' },
                  { k: 'After.', v: 'If it fits, I scope a written audit. No obligation.' },
                ].map((s, i) => (
                  <li key={i} className="">
                    <div className="font-mono text-[13px] text-[rgb(var(--accent))] mb-3">0{i+1}</div>
                    <p className="text-[15px]"><strong>{s.k}</strong> <span className="text-[rgb(var(--muted))]">{s.v}</span></p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
