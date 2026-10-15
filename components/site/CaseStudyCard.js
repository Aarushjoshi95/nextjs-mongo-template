import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function CaseStudyCard({ study, featured = false, index }) {
  const idx = String(index).padStart(2, '0');
  const statusPill = study.status === 'coming-next' ? 'pill-coming' : 'pill-published';
  const statusLabel = study.status === 'coming-next' ? 'Coming next' : 'Published';

  if (featured) {
    return (
      <Link href={`/case-studies/${study.slug}`} className="card-surface block p-8 lg:p-12 group">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <span className="index-numeral text-[14px]">{idx} / Featured</span>
            <span className={`pill ${statusPill}`}>{statusLabel}</span>
            <span className="pill">{study.industry}</span>
          </div>
          <ArrowUpRight className="w-6 h-6 text-muted group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
        </div>
        <h2 className="text-[clamp(28px,4vw,42px)] font-semibold leading-[1.1] tracking-tight mb-4 max-w-3xl">{study.title}</h2>
        <p className="text-muted text-[17px] mb-10 max-w-2xl">{study.summary}</p>
        {study.stats?.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 md:divide-x md:divide-line mb-6">
            {study.stats.slice(0, 4).map((s, i) => (
              <div key={i} className="md:px-6 first:md:pl-0">
                <div className="font-mono text-[clamp(28px,4vw,40px)] font-medium text-accent leading-none">{s.value}</div>
                <div className="text-[12px] uppercase tracking-[0.1em] text-muted mt-3">{s.label}</div>
              </div>
            ))}
          </div>
        )}
        <span className="link-underline mt-4">Read the full breakdown →</span>
      </Link>
    );
  }

  return (
    <Link href={`/case-studies/${study.slug}`} className="card-surface block p-6 lg:p-8 group h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="index-numeral">{idx}</span>
          <span className={`pill ${statusPill}`}>{statusLabel}</span>
        </div>
        <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
      </div>
      <div className="text-[12px] uppercase tracking-[0.1em] text-muted mb-3">{study.industry}</div>
      <h3 className="text-[22px] font-semibold leading-[1.2] tracking-tight mb-3">{study.title}</h3>
      <p className="text-muted text-[15px] mb-6 line-clamp-3">{study.summary}</p>
      {study.stats?.length > 0 && (
        <div className="flex gap-6 pt-6 border-t border-line">
          {study.stats.slice(0, 2).map((s, i) => (
            <div key={i}>
              <div className="font-mono text-[22px] font-medium text-accent leading-none">{s.value}</div>
              <div className="text-[11px] uppercase tracking-[0.1em] text-muted mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </Link>
  );
}

export function PipelineCard({ study, index }) {
  const idx = String(index).padStart(2, '0');
  return (
    <div className="card-surface p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-5">
        <span className="index-numeral">{idx}</span>
        <span className="pill pill-coming">Coming next</span>
      </div>
      <div className="text-[12px] uppercase tracking-[0.1em] text-muted mb-3">{study.scope}</div>
      <h3 className="text-[20px] font-semibold leading-[1.25] mb-3">{study.title}</h3>
      <p className="text-muted text-[14px]">{study.summary}</p>
    </div>
  );
}
