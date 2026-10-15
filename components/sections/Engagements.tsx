import { ArrowRight } from 'lucide-react';
import { BookButton } from '@/components/site/BookingModal';
import Section from '@/components/sections/Section';
import SectionHeader from '@/components/sections/SectionHeader';
import type { BlockOf } from '@/lib/schema';

/** Ways to work together: tag (format and duration), what it is, who it is for, and a booking CTA. */
export default function Engagements({ block }: { block: BlockOf<'engagements'> }) {
  return (
    <Section id={block.id} tone={block.tone} border={block.border}>
      <SectionHeader eyebrow={block.eyebrow} title={block.title} />
      <div className="grid md:grid-cols-3 gap-5">
        {block.items.map((o) => (
          <div key={o.title} className={`card-surface p-8 flex flex-col ${o.highlight ? 'border-accent/40 bg-accent/[0.03]' : ''}`}>
            <span className="text-[11px] uppercase tracking-[0.12em] font-mono text-muted mb-5">{o.tag}</span>
            <h3 className="text-[24px] font-semibold tracking-tight mb-4">{o.title}</h3>
            <p className="text-muted text-[15px] leading-relaxed mb-5 flex-1">{o.body}</p>
            <p className="text-[14px] text-ink mb-6"><strong>{block.fitLabel}</strong> {o.fit}</p>
            <BookButton className="link-underline mt-auto self-start">{o.cta} <ArrowRight className="w-3.5 h-3.5" /></BookButton>
          </div>
        ))}
      </div>
    </Section>
  );
}
