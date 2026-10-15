import ToolShell from '@/components/tools/ToolShell';
import CtrOpportunityCalculator from '@/components/tools/CtrOpportunityCalculator';
import { getTool } from '@/lib/content/tools';

const tool = getTool('ctr-position-opportunity-calculator');

export const metadata = {
  title: `${tool.name} — position to clicks to revenue`,
  description: tool.description,
  alternates: { canonical: `/tools/${tool.slug}` },
};

const how = [
  { k: 'Incremental, not total.', v: 'Every figure is the gain from moving position, not the keyword’s whole value. That is what you can take credit for.' },
  { k: 'Per-row target.', v: 'Leave the target blank to use the default, or set a realistic one per keyword — position 15 → 5 is a different project from 4 → 3.' },
  { k: 'AI Overview haircut.', v: 'When an overview sits above the results, organic CTR falls across all positions. Toggle it on for those queries so the forecast is defensible.' },
  { k: 'Edit the curve.', v: 'If you have your own GSC CTR-by-position data, paste it in. A brand-heavy or image-heavy SERP behaves very differently from the industry average.' },
];

const faq = [
  { q: 'Where does the default CTR curve come from?', a: 'A blend of public 2024–25 studies (Advanced Web Ranking, First Page Sage, Backlinko). Position 1 ≈ 27.6%, falling to 2.4% at position 10 and ~1% by 15. Replace it with your own GSC data when you can.' },
  { q: 'Why does the AI Overview haircut apply to the target too?', a: 'Because the overview does not disappear when you rank higher. The gap between current and target narrows, which is exactly the effect you need to show.' },
  { q: 'Is my data stored?', a: 'No. Everything runs in your browser. The share link encodes your inputs in the URL; nothing is sent to a server.' },
];

export default function Page() {
  return (
    <ToolShell tool={tool} how={how} faq={faq}>
      <CtrOpportunityCalculator />
    </ToolShell>
  );
}
