import ToolShell from '@/components/tools/ToolShell';
import TrafficDropCalculator from '@/components/tools/TrafficDropCalculator';
import { getTool } from '@/config/tools';

const tool = getTool('traffic-drop-loss-calculator');

export const metadata = {
  title: `${tool.name} — what a ranking drop costs`,
  description: tool.description,
  alternates: { canonical: `/tools/${tool.slug}` },
};

const how = [
  { k: 'Revenue lost per month.', v: 'The run-rate gap. This is the number that makes a traffic drop a business problem rather than an SEO problem.' },
  { k: 'Cumulative loss.', v: 'Loss stays flat until the fix ships, then shrinks along the recovery ramp. Change “months until the fix ships” to see what each month of delay costs.' },
  { k: 'If nothing is fixed.', v: 'The flat-loss comparison. The difference between the two totals is the budget case for the fix.' },
  { k: 'Recover to below 100%.', v: 'Use this when part of the loss is structural — an AI Overview now answers the query, or a SERP feature pushed you down. Be honest here; it builds credibility.' },
];

const faq = [
  { q: 'Which traffic figure should I use?', a: 'Only the affected traffic. If a product-page cluster dropped 60% while the blog was flat, model the cluster with its own conversion rate. Site-wide averages hide the real cost.' },
  { q: 'How long do recoveries actually take?', a: 'For core-update losses, improvements typically show at the next core update — so 2–6 months is realistic. Technical regressions (noindex, canonical errors) recover in weeks once fixed.' },
  { q: 'Is my data stored?', a: 'No. Everything runs in your browser. The share link encodes your inputs in the URL; nothing is sent to a server.' },
];

export default function Page() {
  return (
    <ToolShell tool={tool} how={how} faq={faq}>
      <TrafficDropCalculator />
    </ToolShell>
  );
}
