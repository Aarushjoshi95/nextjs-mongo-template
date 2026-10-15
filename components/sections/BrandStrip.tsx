import Section from '@/components/sections/Section';
import BrandWall from '@/components/sections/BrandWall';
import { fill } from '@/components/sections/Inline';
import { pickBrands } from '@/config/brands';
import type { BlockOf } from '@/lib/schema';

/** Standalone brand grid (config/brands). The homepage shows it inside caseStudyCards instead. */
export default function BrandStrip({ block }: { block: BlockOf<'brandStrip'> }) {
  const brands = pickBrands(block.brands);
  return (
    <Section id={block.id} tone={block.tone} border={block.border}>
      <BrandWall brands={brands} label={block.label} caption={fill(block.caption, { count: brands.length })} />
    </Section>
  );
}
