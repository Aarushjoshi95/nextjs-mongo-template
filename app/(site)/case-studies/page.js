import Link from 'next/link';
import CTABand from '@/components/site/CTABand';
import { CaseStudyCard, PipelineCard } from '@/components/site/CaseStudyCard';
import { getPublishedCaseStudies, getPipelineCaseStudies, getFeaturedCaseStudy } from '@/lib/content/caseStudies';

export const metadata = {
  title: 'Case Studies',
  description: 'Proof shown with operating detail — not vanity screenshots. Edtech, D2C and SaaS organic growth programs with before/after numbers and the decisions behind them.',
  alternates: { canonical: '/case-studies' },
};

export default function CaseStudiesPage() {
  const featured = getFeaturedCaseStudy();
  const others = getPublishedCaseStudies().filter((c) => c.slug !== featured.slug);
  const pipeline = getPipelineCaseStudies();

  return (
    <>
        <section className="section-y">
          <div className="container-max">
            <div className="max-w-3xl fade-in">
              <span className="eyebrow mb-8">Case Studies</span>
              <h1 className="text-[clamp(40px,6vw,72px)] font-semibold leading-[1.05] tracking-tight mb-6">
                Proof, with operating detail.
              </h1>
              <p className="text-[clamp(17px,1.5vw,20px)] text-muted max-w-2xl leading-relaxed">
                No vanity screenshots. Each study shows the decisions, the trade-offs and the numbers that moved — so you can judge whether the thinking fits your situation.
              </p>
            </div>

            {/* Filter chips */}
            <div className="mt-12 flex flex-wrap gap-2">
              {['All', 'Edtech', 'D2C', 'SaaS', 'Technical SEO', 'GEO'].map((f, i) => (
                <button key={f} className={`pill ${i === 0 ? 'bg-ink text-paper border-ink' : ''}`}>{f}</button>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="container-max">
            <CaseStudyCard study={featured} featured index={1} />
            <div className="grid md:grid-cols-2 gap-5 mt-5">
              {others.map((s, i) => (
                <CaseStudyCard key={s.slug} study={s} index={i + 2} />
              ))}
            </div>
          </div>
        </section>

        {pipeline.length > 0 && (
          <section className="section-y border-t border-line bg-surface">
            <div className="container-max">
              <div className="max-w-2xl mb-12">
                <span className="eyebrow mb-6">In the pipeline</span>
                <h2 className="text-[clamp(28px,4vw,42px)] font-semibold leading-[1.1] tracking-tight">Work I&apos;m writing up next.</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                {pipeline.map((s, i) => (
                  <PipelineCard key={s.slug} study={s} index={i + 1} />
                ))}
              </div>
            </div>
          </section>
        )}

        <CTABand />
    </>
  );
}
