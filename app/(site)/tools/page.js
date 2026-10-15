import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BookButton } from '@/components/site/BookingModal';
import { tools } from '@/lib/content/tools';

export const metadata = {
  title: 'Free SEO revenue tools & calculators',
  description:
    'Free calculators for SEO and AI search teams: cluster-level revenue impact, traffic drop loss, and CTR/position opportunity. No signup, no paywalls — built from real client work.',
  alternates: { canonical: '/tools' },
};

export default function ToolsPage() {
  return (
    <>
        <section className="pt-14 lg:pt-20 pb-12">
          <div className="container-max">
            <div className="max-w-3xl">
              <span className="eyebrow mb-8">Free tools · No signup, no paywalls</span>
              <h1 className="text-[clamp(36px,6vw,68px)] font-semibold leading-[1.03] tracking-[-0.025em] mb-6">
                Calculators that turn traffic into a <span className="text-accent">revenue</span> conversation.
              </h1>
              <p className="text-[clamp(16px,1.4vw,19px)] text-muted max-w-2xl leading-relaxed">
                SEO gets budget when it reports in the same units as the business. These started as internal spreadsheets for client decks — now they are free for anyone who has to defend organic in a room full of CFOs.
              </p>
            </div>
          </div>
        </section>

        <section className="pb-16 lg:pb-24">
          <div className="container-max">
            <ol className="grid md:grid-cols-2 xl:grid-cols-4 gap-5" data-testid="tools-grid">
              {tools.map((t, i) => (
                <li key={t.slug}>
                  <Link href={`/tools/${t.slug}`} className="card-surface p-7 flex flex-col h-full group" data-testid={`tool-card-${t.slug}`}>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-[13px] text-muted">0{i + 1}</span>
                      {t.eyebrow ? <span className="pill pill-published text-[11px]"><span className="pulse-dot" />{t.eyebrow}</span> : null}
                    </div>
                    <h2 className="text-[22px] font-semibold tracking-tight leading-[1.2] mb-3" style={{ fontFamily: 'var(--font-display)' }}>{t.name}</h2>
                    <p className="text-[14.5px] text-muted leading-relaxed mb-6 flex-1">{t.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {t.tags.map((tag) => <span key={tag} className="pill text-[11px]">{tag}</span>)}
                    </div>
                    <span className="link-underline mt-auto text-[14px]">Launch <ArrowRight className="w-3.5 h-3.5" /></span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section-y border-t border-line bg-surface">
          <div className="container-max">
            <div className="max-w-3xl">
              <span className="eyebrow mb-6">Need one built for your specific problem?</span>
              <h2 className="text-[clamp(28px,4vw,44px)] font-semibold leading-[1.07] tracking-tight mb-5">If your team has a recurring manual report, it can probably be a tool.</h2>
              <p className="text-muted text-[17px] leading-relaxed mb-8">Cluster-level revenue models, AI share-of-voice trackers, GSC-to-board-slide automations. Tell me the spreadsheet you rebuild every month.</p>
              <BookButton className="btn-primary" data-testid="tools-book-button">Discuss your project<ArrowRight className="w-4 h-4" /></BookButton>
            </div>
          </div>
        </section>
    </>
  );
}
