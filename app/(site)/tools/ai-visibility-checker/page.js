import ToolShell from '@/components/tools/ToolShell';
import VisibilityChecker from '@/components/tools/VisibilityChecker';
import { getTool } from '@/lib/content/tools';

const tool = getTool('ai-visibility-checker');

export const metadata = {
  title: `${tool.name} — does Gemini name your brand?`,
  description: tool.description,
  alternates: { canonical: `/tools/${tool.slug}` },
};

const how = [
  { k: 'Named in the answer.', v: 'A plain text match for your brand in what Gemini said. If this is red for your core buying prompts, you are not in the shortlist.' },
  { k: 'Stance.', v: 'Scored by a decision model: not mentioned → in passing → listed as an option → recommended. “Listed” is table stakes; “recommended” is where leads come from.' },
  { k: 'Shortlist odds.', v: 'The probability a buyer reading this answer walks away with you on their list. Track it per prompt over time.' },
  { k: 'Named instead / alongside.', v: 'The competitors the model reached for. These are the brands whose sources, reviews and comparison pages the engine trusts for this question.' },
];

const faq = [
  { q: 'Why only Gemini?', a: 'Gemini is live here as a free preview. The full audit runs the same prompts across ChatGPT, Claude, Gemini and Perplexity and reports share of voice per engine.' },
  { q: 'Why do I get a different answer when I run it again?', a: 'Generative answers vary. One run is an observation; the audit runs each prompt multiple times and reports mention rate, not a single result.' },
  { q: 'Is my brand or prompt stored?', a: 'The prompt, answer and scores are stored so repeated checks can be compared over time. No personal data is collected. Checks are limited to 10 per 10 minutes.' },
];

export default function Page() {
  return (
    <ToolShell tool={tool} how={how} faq={faq}>
      <div className="card-surface p-6 sm:p-8 max-w-4xl">
        <VisibilityChecker />
      </div>
    </ToolShell>
  );
}
