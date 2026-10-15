import Section from '@/components/sections/Section';
import SectionHeader from '@/components/sections/SectionHeader';
import Inline from '@/components/sections/Inline';
import type { BlockOf } from '@/lib/schema';

/** Problem framing: cards with a title, optional body and bullet list; `highlight` marks the one that matters. */
export default function ProblemCards({ block }: { block: BlockOf<'problemCards'> }) {
  return (
    <Section id={block.id} tone={block.tone} border={block.border}>
      <SectionHeader eyebrow={block.eyebrow} title={block.title} intro={block.intro} width="lg" introSize="lead" />
      <div className="grid md:grid-cols-2 gap-5">
        {block.cards.map((c) => (
          <div key={c.title} className={c.highlight ? 'card-surface p-8 border-accent/30' : 'card-surface p-8'}>
            {c.eyebrow && <span className="eyebrow mb-5">{c.eyebrow}</span>}
            <h3 className="text-[24px] font-semibold tracking-tight mb-5">{c.title}</h3>
            {c.body && <p className="text-muted text-[15px] leading-relaxed mb-5"><Inline text={c.body} /></p>}
            {c.items?.length > 0 && (
              <ul className={`space-y-3 text-[15px] ${c.highlight ? 'text-ink' : 'text-muted'}`}>
                {c.items.map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className={c.highlight ? 'text-accent mt-2 w-1.5 h-1.5 rounded-full bg-current shrink-0' : 'text-muted mt-2 w-1 h-1 rounded-full bg-current shrink-0'} />
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
