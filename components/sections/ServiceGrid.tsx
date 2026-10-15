import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Section from '@/components/sections/Section';
import SectionHeader from '@/components/sections/SectionHeader';
import type { BlockOf } from '@/lib/schema';

/** Grid of small cards: optional code label, title, body and optional internal link. */
export default function ServiceGrid({ block }: { block: BlockOf<'serviceGrid'> }) {
  return (
    <Section id={block.id} tone={block.tone} border={block.border}>
      <SectionHeader eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {block.items.map((m) => (
          <div key={m.title} className="card-surface p-6">
            {m.code && <code className="text-[12px] text-accent font-mono">{m.code}</code>}
            <h3 className="text-[20px] font-semibold tracking-tight mt-3 mb-3">{m.title}</h3>
            <p className="text-[14px] text-muted leading-relaxed">{m.body}</p>
            {m.link && (
              <Link href={m.link.href} className="link-underline mt-4 text-[14px]">{m.link.label} <ArrowRight className="w-3.5 h-3.5" /></Link>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
