import { headlineStats } from '@/config/site';
import type { BlockOf } from '@/lib/schema';

/** Band of the site's headline stats (config/site). */
export default function StatStrip({ block }: { block: BlockOf<'statStrip'> }) {
  return (
    <section id={block.id} className="border-y border-line bg-surface">
      <div className="container-max py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4 md:divide-x md:divide-line">
          {headlineStats.map((s, i) => (
            <div key={i} className="md:px-8 first:md:pl-0">
              <div className="font-mono text-[clamp(28px,4vw,42px)] font-medium text-accent leading-none tracking-tight">{s.value}</div>
              <div className="text-[12px] uppercase tracking-[0.08em] text-muted mt-4 leading-snug max-w-[220px]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
