import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Header from '@/components/site/Header';
import AnnouncementBar from '@/components/site/AnnouncementBar';
import Footer from '@/components/site/Footer';
import CTABand from '@/components/site/CTABand';
import { CaseStudyCard } from '@/components/site/CaseStudyCard';
import { getFeaturedCaseStudy, getPublishedCaseStudies } from '@/lib/content/caseStudies';

export const metadata = {
  title: 'Aarush · SEO that reports to revenue, not rankings',
  description: 'Organic growth advisor with 8+ years across edtech, D2C and fintech. I treat organic as a P&L-accountable revenue channel — not a traffic channel.',
  alternates: { canonical: '/' },
};

const logos = ['Traya', 'Emeritus', 'Scaler', 'upGrad', 'BYJUS', 'Vedantu'];

const pillars = [
  { n: '01', title: 'Diagnose', body: 'Audit every page, every URL, every pound of crawl budget by revenue influence. Kill what distracts. Find what compounds.' },
  { n: '02', title: 'Build the system', body: 'Technical foundation, editorial engine and conversion scaffolding that keeps shipping output without burning the team.' },
  { n: '03', title: 'Tie it to revenue', body: 'D0 and D+ attribution plumbed into the warehouse. Every brief carries a revenue hypothesis. Every review ties back to pipeline.' },
];

const servicePreview = [
  { title: 'Organic Growth Strategy', body: 'A 90-day plan that treats organic as a P&L line, with named owners and weekly scorecards.', href: '/services/organic-growth-strategy' },
  { title: 'Technical SEO', body: 'Crawl, index, render and schema fixes that unblock the pages that actually move revenue.', href: '/services/technical-seo' },
  { title: 'GEO / AI Visibility', body: 'Measurement and intervention for share of voice inside ChatGPT, Perplexity and AI Overviews.', href: '/services/geo-ai-visibility' },
  { title: 'SEO Automation', body: 'n8n + Claude pipelines for reporting, briefs and decay alerts. Replace toil with leverage.', href: '/services/seo-automation' },
];

export default function HomePage() {
  const featured = getFeaturedCaseStudy();
  const published = getPublishedCaseStudies();

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main">
        {/* HERO */}
        <section className="section-y">
          <div className="container-max">
            <div className="max-w-4xl fade-in">
              <span className="eyebrow mb-8">Organic Growth Advisor</span>
              <h1 className="text-[clamp(40px,7vw,80px)] font-semibold leading-[1.03] tracking-[-0.025em] mb-8">
                SEO that reports to <span className="text-[rgb(var(--accent))]">revenue</span>, not rankings.
              </h1>
              <p className="text-[clamp(17px,2vw,22px)] text-[rgb(var(--muted))] max-w-2xl leading-[1.55] mb-10">
                8+ years making organic accountable to the P&L across edtech, D2C and fintech. I don&apos;t ship traffic. I ship a channel that your finance team can forecast.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/hire-me" className="btn-primary">Book a discovery call<ArrowRight className="w-4 h-4" /></Link>
                <Link href="/case-studies" className="btn-ghost">See the proof</Link>
                <span className="pill pill-published ml-2"><span className="pulse-dot" />Open to projects</span>
              </div>
            </div>
          </div>
        </section>

        {/* PROOF STRIP */}
        <section className="border-y border-[rgb(var(--line))] bg-[rgb(var(--surface))]">
          <div className="container-max py-14">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4 md:divide-x md:divide-[rgb(var(--line))]">
              {[
                { v: '7.4×', l: 'Largest organic lift' },
                { v: '8+', l: 'Years in the trade' },
                { v: '3', l: 'Industries, same playbook' },
                { v: '41%', l: 'Peak organic share of revenue' },
              ].map((s, i) => (
                <div key={i} className="md:px-8 first:md:pl-0">
                  <div className="font-mono text-[clamp(32px,5vw,52px)] font-medium text-[rgb(var(--accent))] leading-none tracking-tight">{s.v}</div>
                  <div className="text-[12px] uppercase tracking-[0.12em] text-[rgb(var(--muted))] mt-4">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LOGOS */}
        <section className="py-16">
          <div className="container-max">
            <p className="text-[13px] uppercase tracking-[0.12em] text-[rgb(var(--muted))] mb-8 text-center">Teams I&apos;ve worked with</p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
              {logos.map((l) => (
                <span key={l} className="text-[22px] font-semibold tracking-tight grayscale" style={{fontFamily:'Inter Tight'}}>{l}</span>
              ))}
            </div>
          </div>
        </section>

        {/* HOW I WORK */}
        <section className="section-y border-t border-[rgb(var(--line))]">
          <div className="container-max">
            <div className="max-w-2xl mb-16">
              <span className="eyebrow mb-6">How I work</span>
              <h2 className="text-[clamp(32px,5vw,52px)] font-semibold leading-[1.08] tracking-tight">Three moves. In this order. Every time.</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-10 md:gap-6">
              {pillars.map((p) => (
                <div key={p.n} className="relative">
                  <div className="font-mono text-[72px] font-medium text-[rgb(var(--accent))]/20 leading-none mb-6">{p.n}</div>
                  <h3 className="text-[24px] font-semibold mb-3 tracking-tight">{p.title}</h3>
                  <p className="text-[rgb(var(--muted))] text-[16px] leading-relaxed max-w-sm">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES PREVIEW */}
        <section className="section-y border-t border-[rgb(var(--line))] bg-[rgb(var(--surface))]">
          <div className="container-max">
            <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
              <div className="max-w-xl">
                <span className="eyebrow mb-6">Services</span>
                <h2 className="text-[clamp(32px,5vw,52px)] font-semibold leading-[1.08] tracking-tight">Four engagements. One operating belief.</h2>
              </div>
              <Link href="/services" className="link-underline">All services <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {servicePreview.map((s, i) => (
                <Link key={s.href} href={s.href} className="card-surface p-8 group">
                  <div className="flex items-start justify-between mb-6">
                    <span className="index-numeral">{String(i + 1).padStart(2, '0')}</span>
                    <ArrowUpRight className="w-5 h-5 text-[rgb(var(--muted))] group-hover:text-[rgb(var(--accent))] transition-colors" />
                  </div>
                  <h3 className="text-[22px] font-semibold mb-3 tracking-tight">{s.title}</h3>
                  <p className="text-[rgb(var(--muted))] text-[15px]">{s.body}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED CASE STUDY */}
        <section className="section-y border-t border-[rgb(var(--line))]">
          <div className="container-max">
            <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
              <div>
                <span className="eyebrow mb-6">Proof</span>
                <h2 className="text-[clamp(32px,5vw,52px)] font-semibold leading-[1.08] tracking-tight">The latest work.</h2>
              </div>
              <Link href="/case-studies" className="link-underline">All case studies <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <CaseStudyCard study={featured} featured index={1} />
            <div className="grid md:grid-cols-2 gap-5 mt-5">
              {published.filter((p) => p.slug !== featured.slug).slice(0, 2).map((s, i) => (
                <CaseStudyCard key={s.slug} study={s} index={i + 2} />
              ))}
            </div>
          </div>
        </section>

        <CTABand />
      </main>
      <Footer />
    </>
  );
}
