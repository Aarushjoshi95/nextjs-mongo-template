import ToolShell from '@/components/tools/ToolShell';
import RevenueImpactCalculator from '@/components/tools/RevenueImpactCalculator';
import { getTool } from '@/lib/content/tools';

const tool = getTool('revenue-impact-calculator');

export const metadata = {
  title: `${tool.name} — cluster-level SEO revenue model`,
  description: tool.description,
  alternates: { canonical: `/tools/${tool.slug}` },
};

const how = [
  { k: 'Revenue share vs traffic share.', v: 'When a cluster’s revenue bar is taller than its traffic bar, it is under-invested. That is where the next content sprint goes.' },
  { k: 'Per 1,000 visits.', v: 'The cleanest way to compare clusters. It turns “we grew blog traffic 20%” into “we grew Roadmap traffic 20%, which is worth N”.' },
  { k: 'The what-if sliders.', v: 'Model a core update hitting one cluster, or a programme lifting another. The delta is the number for the budget conversation.' },
  { k: 'Everything else.', v: 'Unallocated traffic defaults to a low conversion rate on purpose. If it is converting well, you have an unmapped cluster — go find it.' },
];

const faq = [
  { q: 'Where do cluster conversion rates come from?', a: 'GA4: segment sessions by landing-page folder or a page-group dimension and read the key-event rate for each. If you have nothing, start with the ratios here (commercial intent converts 5–10× informational) and refine monthly.' },
  { q: 'What should “value per conversion” be?', a: 'For lead-gen: lead value = average deal size × lead-to-close rate. For e-commerce: average order value, or first-year LTV if finance accepts it. Keep one definition across all clusters.' },
  { q: 'Does this account for AI search?', a: 'Not directly — it values whatever traffic arrives. The clusters most exposed to AI Overviews are usually the informational ones, which this model already shows as low value per visit. The commercial clusters are where AI visibility work pays back.' },
  { q: 'Is my data stored?', a: 'No. Everything runs in your browser. The share link encodes your inputs in the URL itself; nothing is sent to a server.' },
];

export default function Page() {
  return (
    <ToolShell tool={tool} how={how} faq={faq}>
      <RevenueImpactCalculator />
    </ToolShell>
  );
}
