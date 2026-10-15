import { ArrowRight } from 'lucide-react';
import { BookButton, CAL_LINK } from '@/components/site/BookingModal';
import Section from '@/components/sections/Section';
import Inline from '@/components/sections/Inline';
import type { BlockOf } from '@/lib/schema';

/** Closing booking band: headline, booking modal button, optional direct Calendly link and numbered notes. */
export default function CtaBand({ block }: { block: BlockOf<'ctaBand'> }) {
  return (
    <Section id={block.id} tone={block.tone} border={block.border}>
      <div className="max-w-3xl">
        <span className="eyebrow mb-6">{block.eyebrow}</span>
        <h2 className="text-[clamp(32px,5vw,56px)] font-semibold leading-[1.05] tracking-tight mb-6"><Inline text={block.title} /></h2>
        {block.body && <p className="text-muted text-[18px] mb-8 max-w-2xl"><Inline text={block.body} /></p>}
        <div className="flex flex-wrap items-center gap-3">
          <BookButton className="btn-primary" data-testid="book-section-button">{block.primaryCta.label}<ArrowRight className="w-4 h-4" /></BookButton>
          {block.calendlyCta && <a href={CAL_LINK} target="_blank" rel="noreferrer noopener" className="btn-ghost">{block.calendlyCta.label}</a>}
        </div>
        {block.notes?.length > 0 && (
          <ol className="mt-14 grid md:grid-cols-3 gap-8">
            {block.notes.map((s, i) => (
              <li key={i}>
                <div className="font-mono text-[13px] text-accent mb-3">0{i + 1}</div>
                <p className="text-[15px]"><strong>{s.k}</strong> <span className="text-muted">{s.v}</span></p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </Section>
  );
}
