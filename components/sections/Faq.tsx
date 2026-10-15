import Section from '@/components/sections/Section';
import SectionHeader from '@/components/sections/SectionHeader';
import FaqAccordion from '@/components/sections/FaqAccordion';
import JsonLd from '@/components/site/JsonLd';
import { jsonLd, faqSchema } from '@/lib/seo';
import type { BlockOf } from '@/lib/schema';

/** FAQ accordion plus its FAQPage JSON-LD, built from the same items. */
export default function Faq({ block }: { block: BlockOf<'faq'> }) {
  return (
    <>
      <JsonLd data={jsonLd(faqSchema(block.items))} />
      <Section id={block.id} tone={block.tone} border={block.border}>
        <SectionHeader eyebrow={block.eyebrow} title={block.title} gap="sm" />
        <FaqAccordion items={block.items} />
      </Section>
    </>
  );
}
