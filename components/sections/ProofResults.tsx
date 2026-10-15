import ProofResultsIsland from '@/components/sections/ProofResultsIsland';
import Inline from '@/components/sections/Inline';
import { getCaseStudy } from '@/lib/content';
import type { BlockOf } from '@/lib/schema';

/** Interactive results carousel: every proof tab of the listed case studies, numbers from their files. */
export default function ProofResults({ block }: { block: BlockOf<'proofResults'> }) {
  const tabs = block.caseStudies.flatMap((slug) => {
    const s = getCaseStudy(slug);
    return s.proof.map((t) => ({ ...t, slug, comingSoon: s.status === 'coming-soon' }));
  });
  return (
    <ProofResultsIsland
      id={block.id ?? 'results'}
      eyebrow={block.eyebrow}
      title={<Inline text={block.title} />}
      intro={block.intro && <Inline text={block.intro} />}
      tabs={tabs}
      cta={block.cta}
      footnote={block.footnote}
    />
  );
}
