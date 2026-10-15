import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { CaseStudy } from '@/lib/schema';

/** Hero aside: one case study's headline result, read from its `card` frontmatter. */
export default function ProofCard({ study }: { study: CaseStudy }) {
  const { card } = study;
  return (
    <Link href={`/case-studies/${study.slug}`} className="card-surface p-8 group flex flex-col" data-testid={`proof-card-${study.slug}`}>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {card.tags.map((t) => <span key={t} className="pill text-[11px]">{t}</span>)}
      </div>
      <h2 className="text-[22px] font-semibold leading-[1.2] tracking-tight mb-6">{card.title}</h2>
      <div className="flex items-baseline gap-3 mb-6">
        <span className="font-mono text-[36px] font-medium text-accent leading-none">{card.headline.value}</span>
        <span className="text-[13px] text-muted">{card.headline.label}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-md border border-line p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted mb-1">{card.before.label} · Before</div>
          <div className="font-mono text-[20px]">{card.before.value}</div>
        </div>
        <div className="rounded-md border border-accent/30 bg-accent/[0.05] p-4">
          <div className="text-[11px] uppercase tracking-wider text-accent mb-1">{card.after.label} · After</div>
          <div className="font-mono text-[20px] text-accent">{card.after.value}</div>
        </div>
      </div>
      <span className="link-underline mt-auto text-[14px]">Read the breakdown <ArrowRight className="w-3.5 h-3.5" /></span>
    </Link>
  );
}
