import Section from '@/components/sections/Section';
import SectionHeader from '@/components/sections/SectionHeader';
import BrandWall from '@/components/sections/BrandWall';
import CaseStudyCarousel from '@/components/sections/CaseStudyCarousel';
import { fill } from '@/components/sections/Inline';
import { pickBrands } from '@/config/brands';
import { getCaseStudy } from '@/lib/content';
import type { BlockOf } from '@/lib/schema';

/** Case-study cards by slug (numbers from each file's `card`), optionally under a brand strip. */
export default function CaseStudyCards({ block }: { block: BlockOf<'caseStudyCards'> }) {
  const cases = block.caseStudies.map((slug) => {
    const { card } = getCaseStudy(slug);
    return {
      slug,
      tags: card.tags,
      title: card.title,
      headline: card.headline.value,
      headlineLabel: card.headline.label,
      beforeLabel: card.before.label,
      beforeValue: card.before.value,
      afterLabel: card.after.label,
      afterValue: card.after.value,
      chips: card.chips,
    };
  });
  const strip = block.brandStrip;
  const brands = strip ? pickBrands(strip.brands) : [];
  return (
    <Section id={block.id} tone={block.tone} border={block.border}>
      <SectionHeader eyebrow={block.eyebrow} title={block.title} intro={block.intro} width="lg" gap="md" />
      {strip && <BrandWall brands={brands} label={strip.label} caption={fill(strip.caption, { count: brands.length })} />}
      <div className="flex items-center gap-4 mt-16 mb-8">
        <span className="text-[11px] uppercase tracking-[0.14em] font-mono text-muted shrink-0">{block.listLabel}</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <CaseStudyCarousel cases={cases} />
    </Section>
  );
}
