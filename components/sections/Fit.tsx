import { Check, X as XIcon } from 'lucide-react';
import Section from '@/components/sections/Section';
import SectionHeader from '@/components/sections/SectionHeader';
import type { BlockOf } from '@/lib/schema';

/** "Good fit if" / "Not a fit if" lists. */
export default function Fit({ block }: { block: BlockOf<'fit'> }) {
  const { good, bad } = block;
  return (
    <Section id={block.id} tone={block.tone} border={block.border}>
      <SectionHeader eyebrow={block.eyebrow} title={block.title} />
      <div className="grid md:grid-cols-2 gap-5">
        <div className="card-surface p-8">
          <h3 className="text-[20px] font-semibold tracking-tight mb-6">{good.title}</h3>
          <ul className="space-y-4">
            {good.items.map((t) => (
              <li key={t} className="flex gap-3 text-[15px]"><Check className="w-5 h-5 text-positive shrink-0 mt-0.5" />{t}</li>
            ))}
          </ul>
        </div>
        <div className="card-surface p-8">
          <h3 className="text-[20px] font-semibold tracking-tight mb-6">{bad.title}</h3>
          <ul className="space-y-4">
            {bad.items.map((t) => (
              <li key={t} className="flex gap-3 text-[15px] text-muted"><XIcon className="w-5 h-5 shrink-0 mt-0.5" />{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
