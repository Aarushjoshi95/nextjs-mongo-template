import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import { BookButton } from '@/components/site/BookingModal';
import { tools } from '@/lib/content/tools';
import JsonLd from '@/components/site/JsonLd';
import { jsonLd, toolSchema, breadcrumbSchema } from '@/lib/seo';

// Server-rendered chrome for every tool page: header, breadcrumb, intro, the
// client calculator (children), a "how to read this" block and a soft CTA.
export default function ToolShell({ tool, children, how = [], faq = [] }) {
  const others = tools.filter((t) => t.slug !== tool.slug);
  const faqSchema = faq.length > 0 ? {
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  } : null;
  return (
    <>
      <JsonLd data={jsonLd(toolSchema(tool), faqSchema, breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Free tools', url: '/tools' }, { name: tool.name, url: `/tools/${tool.slug}` }]))} />
      <Header />
      <main id="main">
        <section className="pt-8 lg:pt-12 pb-10">
          <div className="container-max">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12.5px] text-muted mb-8">
              <Link href="/" className="hover:text-ink">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/tools" className="hover:text-ink">Free tools</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-ink">{tool.name}</span>
            </nav>
            <div className="max-w-3xl">
              <span className="eyebrow mb-6">Free tool · No signup</span>
              <h1 className="text-[clamp(32px,5vw,56px)] font-semibold leading-[1.05] tracking-tight mb-5">{tool.name}</h1>
              <p className="text-muted text-[17px] leading-relaxed">{tool.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-5">
                {tool.tags.map((t) => <span key={t} className="pill text-[11px]">{t}</span>)}
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16 lg:pb-24">
          <div className="container-max">{children}</div>
        </section>

        {(how.length > 0 || faq.length > 0) && (
          <section className="section-y border-t border-line bg-surface">
            <div className="container-max grid lg:grid-cols-2 gap-12">
              {how.length > 0 && (
                <div>
                  <span className="eyebrow mb-6">How to read the result</span>
                  <ol className="space-y-5">
                    {how.map((h, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="font-mono text-[13px] text-accent mt-1 shrink-0">0{i + 1}</span>
                        <p className="text-[15px] leading-relaxed"><strong>{h.k}</strong> <span className="text-muted">{h.v}</span></p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {faq.length > 0 && (
                <div>
                  <span className="eyebrow mb-6">Assumptions &amp; FAQ</span>
                  <dl className="space-y-5">
                    {faq.map((f, i) => (
                      <div key={i}>
                        <dt className="text-[15px] font-semibold tracking-tight mb-1.5">{f.q}</dt>
                        <dd className="text-[14.5px] text-muted leading-relaxed">{f.a}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="section-y border-t border-line">
          <div className="container-max grid lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
            <div>
              <span className="eyebrow mb-6">Want this done on your real numbers?</span>
              <h2 className="text-[clamp(28px,4vw,44px)] font-semibold leading-[1.07] tracking-tight mb-5">Most of these calculators started as the first slide of a client deck.</h2>
              <p className="text-muted text-[17px] leading-relaxed mb-7 max-w-xl">If you want the cluster model built from your GSC and GA4 data — and tied to AI search visibility, not just rankings — book a 30-minute discovery call.</p>
              <div className="flex flex-wrap gap-3">
                <BookButton className="btn-primary" data-testid="tool-book-button">Book a discovery call<ArrowRight className="w-4 h-4" /></BookButton>
                <Link href="/tools" className="btn-ghost">All free tools</Link>
              </div>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-[0.14em] font-mono text-muted block mb-4">Other tools</span>
              <ul className="space-y-3">
                {others.map((t) => (
                  <li key={t.slug}>
                    <Link href={`/tools/${t.slug}`} className="card-surface p-5 flex items-center justify-between gap-4 group">
                      <span>
                        <span className="block text-[15px] font-semibold tracking-tight">{t.name}</span>
                        <span className="block text-[12.5px] text-muted mt-1">{t.short}</span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-0.5 transition" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
