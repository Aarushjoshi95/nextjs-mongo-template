import Section from '@/components/sections/Section';
import SectionHeader from '@/components/sections/SectionHeader';
import type { BlockOf } from '@/lib/schema';

/** Numbered steps: label (timing), title and body. */
export default function Steps({ block }: { block: BlockOf<'steps'> }) {
  return (
    <Section id={block.id} tone={block.tone} border={block.border}>
      <SectionHeader eyebrow={block.eyebrow} title={block.title} />
      <div className="grid md:grid-cols-3 gap-10 md:gap-6">
        {block.items.map((s, i) => (
          <div key={i}>
            <div className="font-mono text-[72px] font-medium text-accent/20 leading-none mb-5">0{i + 1}</div>
            <div className="text-[11px] uppercase tracking-[0.12em] text-muted font-mono mb-3">{s.label}</div>
            <h3 className="text-[22px] font-semibold tracking-tight mb-3">{s.title}</h3>
            <p className="text-muted text-[15px] leading-relaxed max-w-sm">{s.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
