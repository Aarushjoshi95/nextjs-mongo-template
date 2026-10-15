import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight, Check, TrendingUp } from 'lucide-react';
import CTABand from '@/components/site/CTABand';
import { StatStrip } from '@/components/site/StatBlock';
import CaseStudyChart from '@/components/site/CaseStudyChart';
import EvidenceGallery from '@/components/site/EvidenceGallery';
import StickyTOC from '@/components/site/StickyTOC';
import { getCaseStudy, getNextCaseStudy, getCaseStudies } from '@/lib/content';
import type { CaseStudy } from '@/lib/schema';
import JsonLd from '@/components/site/JsonLd';
import Breadcrumb from '@/components/site/Breadcrumb';
import { jsonLd, caseStudySchema } from '@/lib/seo';

export function generateStaticParams() {
  return getCaseStudies().map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const s = getCaseStudy(slug);
  if (!s) return {};
  if (s.status === 'coming-soon') {
    return {
      title: s.title,
      description: s.summary,
      alternates: { canonical: `/case-studies/${s.slug}` },
      robots: { index: false, follow: true },
    };
  }
  return {
    title: `${s.client} Case Study: ${s.title}`,
    description: s.summary,
    alternates: { canonical: `/case-studies/${s.slug}` },
    openGraph: { title: `${s.client} · ${s.title}`, description: s.summary, type: 'article' },
  };
}

const sections = [
  { id: 'context', label: 'Context' },
  { id: 'approach', label: 'Approach' },
  { id: 'execution', label: 'Execution' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'outcome', label: 'Outcome' },
  { id: 'lessons', label: 'Lessons' },
];

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const s = getCaseStudy(slug);
  if (!s) notFound();
  if (s.status === 'coming-soon') return <ComingSoon s={s} />;
  const next = getNextCaseStudy(slug);

  return (
    <>
      <JsonLd data={jsonLd(caseStudySchema(s))} />
        {/* Breadcrumb */}
        <div className="container-max pt-8">
          <Breadcrumb items={[{ name: 'Home', url: '/' }, { name: 'Case studies', url: '/case-studies' }, { name: s.client, url: `/case-studies/${s.slug}` }]} />
        </div>

        {/* Hero */}
        <section className="pt-10 pb-16 lg:pt-14 lg:pb-20">
          <div className="container-max">
            <div className="max-w-4xl">
              <span className="eyebrow mb-8">Case Study · {s.industry}</span>
              <h1 className="text-[clamp(36px,6vw,68px)] font-semibold leading-[1.05] tracking-[-0.025em] mb-6">{s.title}</h1>
              <p className="text-[clamp(17px,1.6vw,20px)] text-muted leading-relaxed max-w-3xl mb-10">{s.summary}</p>
              <div className="flex flex-wrap gap-x-8 gap-y-3 text-[13px] font-mono text-muted pt-6 border-t border-line">
                <div><span className="uppercase tracking-wider mr-2">Role</span><span className="text-ink">{s.role}</span></div>
                <div><span className="uppercase tracking-wider mr-2">Duration</span><span className="text-ink">{s.duration}</span></div>
                <div><span className="uppercase tracking-wider mr-2">Scope</span><span className="text-ink">{s.scope}</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* Stat strip */}
        {s.stats?.length > 0 && (
          <section className="border-y border-line bg-surface">
            <div className="container-max py-14">
              <StatStrip stats={s.stats.slice(0, 4)} />
            </div>
          </section>
        )}

        {/* Body with sticky TOC */}
        <div className="container-max py-20">
          <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-16">
            <StickyTOC sections={sections} />

            <article className="max-w-3xl">
              {/* Context */}
              {s.context?.length > 0 && (
                <section id="context" className="scroll-mt-24 mb-20">
                  <span className="eyebrow mb-5">01 · Context</span>
                  <h2 className="text-[clamp(28px,3.5vw,40px)] font-semibold mb-6 tracking-tight">The situation.</h2>
                  <div className="space-y-5 text-[17px] leading-[1.7]">
                    {s.context.map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                </section>
              )}

              {/* Approach */}
              {s.pillars?.length > 0 && (
                <section id="approach" className="scroll-mt-24 mb-20">
                  <span className="eyebrow mb-5">02 · Approach</span>
                  <h2 className="text-[clamp(28px,3.5vw,40px)] font-semibold mb-10 tracking-tight">Three pillars.</h2>
                  <div className="space-y-5">
                    {s.pillars.map((p, i) => (
                      <div key={i} className="card-surface p-6 lg:p-8">
                        <div className="flex items-start gap-5">
                          <span className="font-mono text-[18px] text-accent mt-1">{String(i + 1).padStart(2, '0')}</span>
                          <div>
                            <h3 className="text-[20px] font-semibold mb-2 tracking-tight">{p.title}</h3>
                            <p className="text-muted leading-relaxed">{p.body}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Execution */}
              {s.actions?.length > 0 && (
                <section id="execution" className="scroll-mt-24 mb-20">
                  <span className="eyebrow mb-5">03 · Execution</span>
                  <h2 className="text-[clamp(28px,3.5vw,40px)] font-semibold mb-8 tracking-tight">What we actually shipped.</h2>
                  <ol className="space-y-4">
                    {s.actions.map((a, i) => (
                      <li key={i} className="flex gap-4 pb-4 border-b border-line">
                        <span className="font-mono text-[13px] text-accent shrink-0 w-8 pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                        <span className="text-[16px] leading-relaxed">{a}</span>
                      </li>
                    ))}
                  </ol>
                </section>
              )}
            </article>
          </div>

          {/* Evidence (full width inside container) */}
          {(s.chart || s.beforeAfter?.length > 0 || s.evidence?.length > 0) && (
            <section id="evidence" className="scroll-mt-24 mb-20 pt-12 border-t border-line">
              <div className="max-w-3xl mb-10">
                <span className="eyebrow mb-5">04 · Evidence</span>
                <h2 className="text-[clamp(28px,3.5vw,40px)] font-semibold tracking-tight">The receipts.</h2>
              </div>
              {s.evidence?.length > 0 && <EvidenceGallery items={s.evidence} />}
              {s.chart && <div className="mb-10"><CaseStudyChart title={s.chart.title} series={s.chart.series} note={s.chart.note} /></div>}
              {s.beforeAfter?.length > 0 && (
                <div className="card-surface overflow-hidden">
                  <div className="px-6 lg:px-8 py-5 border-b border-line">
                    <h3 className="text-[18px] font-semibold">Before / After</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[14px]">
                      <thead>
                        <tr className="text-left text-[12px] uppercase tracking-[0.1em] text-muted">
                          <th className="px-6 lg:px-8 py-4 font-medium">Metric</th>
                          <th className="px-4 py-4 font-medium">Before</th>
                          <th className="px-4 py-4 font-medium">After</th>
                          <th className="px-6 lg:px-8 py-4 font-medium text-right">Delta</th>
                        </tr>
                      </thead>
                      <tbody>
                        {s.beforeAfter.map((row, i) => (
                          <tr key={i} className="border-t border-line">
                            <td className="px-6 lg:px-8 py-5 font-medium">{row.metric}</td>
                            <td className="px-4 py-5 font-mono text-muted">{row.before}</td>
                            <td className="px-4 py-5 font-mono">{row.after}</td>
                            <td className="px-6 lg:px-8 py-5 font-mono text-right text-positive font-medium">
                              <span className="inline-flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" />{row.delta}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Timeline */}
          {s.timeline?.length > 0 && (
            <section id="timeline" className="scroll-mt-24 mb-20 pt-12 border-t border-line">
              <div className="max-w-3xl mb-12">
                <span className="eyebrow mb-5">05 · Timeline</span>
                <h2 className="text-[clamp(28px,3.5vw,40px)] font-semibold tracking-tight">How it unfolded.</h2>
              </div>
              <div className="grid md:grid-cols-4 gap-5">
                {s.timeline.map((t, i) => (
                  <div key={i} className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-2 h-2 rounded-full bg-accent" />
                      <span className="font-mono text-[12px] uppercase tracking-wider text-muted">{t.phase}</span>
                    </div>
                    <h4 className="font-semibold mb-2 text-[17px]">{t.period}</h4>
                    <p className="text-[14px] text-muted leading-relaxed">{t.detail}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Outcome / Lessons */}
          <div className="max-w-3xl">
            <section id="outcome" className="scroll-mt-24 mb-20 pt-12 border-t border-line">
              <span className="eyebrow mb-5">06 · Outcome</span>
              <h2 className="text-[clamp(28px,3.5vw,40px)] font-semibold mb-6 tracking-tight">What it meant for the business.</h2>
              <p className="text-[17px] leading-[1.7] text-ink">
                Organic moved from a traffic line in a monthly deck to a revenue line the CFO forecasted against. The team stopped debating “more content” and started debating which revenue hypothesis to brief next. That shift — more than any single ranking — is what the program was really for.
              </p>
            </section>

            {s.lessons?.length > 0 && (
              <section id="lessons" className="scroll-mt-24 mb-20">
                <span className="eyebrow mb-5">07 · Lessons</span>
                <h2 className="text-[clamp(28px,3.5vw,40px)] font-semibold mb-10 tracking-tight">Three principles I kept.</h2>
                <div className="space-y-6">
                  {s.lessons.map((l, i) => (
                    <blockquote key={i} className="border-l-2 border-accent pl-6 py-2">
                      <p className="text-[22px] leading-[1.4] font-medium tracking-tight">&ldquo;{l}&rdquo;</p>
                    </blockquote>
                  ))}
                </div>
              </section>
            )}

            {s.testimonial?.quote && (
              <section className="mb-20">
                <div className="card-surface p-8 lg:p-10">
                  <p className="text-[20px] leading-[1.5] font-medium mb-6 tracking-tight">&ldquo;{s.testimonial.quote}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-5 border-t border-line">
                    <div className="w-10 h-10 rounded-full bg-line" />
                    <div>
                      <div className="font-semibold text-[14px]">{s.testimonial.name}</div>
                      <div className="text-[13px] text-muted">{s.testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Next case study */}
          {next && next.slug !== s.slug && (
            <section className="pt-12 border-t border-line">
              <span className="eyebrow mb-5">Next case study</span>
              <Link href={`/case-studies/${next.slug}`} className="card-surface block p-8 lg:p-10 group mt-5">
                <div className="flex items-start justify-between gap-6">
                  <div className="max-w-2xl">
                    <div className="text-[12px] uppercase tracking-[0.1em] text-muted mb-3">{next.industry}</div>
                    <h3 className="text-[clamp(22px,3vw,32px)] font-semibold mb-3 tracking-tight group-hover:text-accent transition-colors">{next.title}</h3>
                    <p className="text-muted">{next.summary}</p>
                  </div>
                  <ArrowUpRight className="w-6 h-6 text-muted group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              </Link>
            </section>
          )}
        </div>

        <CTABand question="Want a program that reports to revenue like this?" />
    </>
  );
}

/** Coming-soon case study: the known headline figures and a booking CTA. Noindex and out of the sitemap. */
function ComingSoon({ s }: { s: CaseStudy }) {
  const figures = s.stats?.length
    ? s.stats
    : (s.proof || []).map((t) => ({ value: `${t.metric.prefix}${t.metric.value}${t.metric.suffix}`, label: t.pill }));
  return (
    <>
      <div className="container-max pt-8">
        <Breadcrumb items={[{ name: 'Home', url: '/' }, { name: 'Case studies', url: '/case-studies' }, { name: s.client || s.title, url: `/case-studies/${s.slug}` }]} />
      </div>

      <section className="pt-10 pb-16 lg:pt-14 lg:pb-20">
        <div className="container-max">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="eyebrow">Case Study{s.industry ? ` · ${s.industry}` : ''}</span>
              <span className="pill pill-coming">Coming soon</span>
            </div>
            <h1 className="text-[clamp(36px,6vw,68px)] font-semibold leading-[1.05] tracking-[-0.025em] mb-6">{s.title}</h1>
            {s.summary && <p className="text-[clamp(17px,1.6vw,20px)] text-muted leading-relaxed max-w-3xl mb-10">{s.summary}</p>}
            <p className="text-[15px] text-muted leading-relaxed max-w-2xl pt-6 border-t border-line" data-testid="coming-soon-note">
              <span className="text-ink font-medium">Full breakdown being prepared.</span> The context, approach and evidence behind these numbers are being written up. Book a call to hear the details first-hand.
            </p>
          </div>
        </div>
      </section>

      {figures.length > 0 && (
        <section className="border-y border-line bg-surface">
          <div className="container-max py-14">
            <StatStrip stats={figures.slice(0, 4)} columns={figures.length === 3 ? 3 : 4} />
          </div>
        </section>
      )}

      <CTABand question="Want a program that reports to revenue like this?" />
    </>
  );
}
