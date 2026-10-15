import Hero from '@/components/sections/Hero';
import StatStrip from '@/components/sections/StatStrip';
import ProblemCards from '@/components/sections/ProblemCards';
import Engagements from '@/components/sections/Engagements';
import Fit from '@/components/sections/Fit';
import ProofResults from '@/components/sections/ProofResults';
import BrandStrip from '@/components/sections/BrandStrip';
import CaseStudyCards from '@/components/sections/CaseStudyCards';
import Steps from '@/components/sections/Steps';
import ServiceGrid from '@/components/sections/ServiceGrid';
import Faq from '@/components/sections/Faq';
import CtaBand from '@/components/sections/CtaBand';
import type { Block, BlockOf } from '@/lib/schema';

// One component per block type (lib/schema.ts). Adding a type means adding it in both places.
const COMPONENTS: { [T in Block['type']]: (props: { block: BlockOf<T> }) => JSX.Element } = {
  hero: Hero,
  statStrip: StatStrip,
  problemCards: ProblemCards,
  engagements: Engagements,
  fit: Fit,
  proofResults: ProofResults,
  brandStrip: BrandStrip,
  caseStudyCards: CaseStudyCards,
  steps: Steps,
  serviceGrid: ServiceGrid,
  faq: Faq,
  ctaBand: CtaBand,
};

/** Renders a page's block list top to bottom. */
export default function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        const Component = COMPONENTS[block.type] as (props: { block: Block }) => JSX.Element;
        return <Component key={i} block={block} />;
      })}
    </>
  );
}
