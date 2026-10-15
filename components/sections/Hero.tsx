import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BookButton } from '@/components/site/BookingModal';
import PromptDemo from '@/components/site/PromptDemo';
import Inline from '@/components/sections/Inline';
import ProofCard from '@/components/sections/ProofCard';
import { site } from '@/config/site';
import { getCaseStudy } from '@/lib/content';
import type { BlockOf } from '@/lib/schema';

/** Page hero: the page's one h1, CTAs, and an aside (the live prompt demo or a case-study proof card). */
export default function Hero({ block }: { block: BlockOf<'hero'> }) {
  const { eyebrow, headline, subhead, pills, primaryCta, secondaryCta, footnote, aside } = block;
  // Without a headline the positioning line is the H1; its last word takes the accent colour.
  const words = site.positioning.split(' ');
  const lastWord = words.pop();
  return (
    <section id={block.id ?? 'top'} className="pt-14 lg:pt-20 pb-16 lg:pb-24">
      <div className="container-max">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
          <div className="fade-in">
            <span className="eyebrow mb-8"><Inline text={eyebrow} /></span>
            <h1 className="text-[clamp(40px,6.5vw,76px)] font-semibold leading-[1.03] tracking-[-0.025em] mb-7">
              {headline ? <Inline text={headline} /> : <>{words.join(' ')} <span className="text-accent">{lastWord}</span>.</>}
            </h1>
            <p className="text-[clamp(17px,1.5vw,20px)] text-muted max-w-xl leading-[1.6] mb-6">
              <Inline text={subhead} />
            </p>
            {pills?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-9">
                {pills.map((r) => <span key={r} className="pill">{r}</span>)}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <BookButton className="btn-primary" data-testid="hero-book-button">{primaryCta.label}<ArrowRight className="w-4 h-4" /></BookButton>
              {secondaryCta && <Link href={secondaryCta.href} className="btn-ghost">{secondaryCta.label}</Link>}
            </div>
            {footnote && <p className="text-[14px] text-muted mt-8 max-w-md"><Inline text={footnote} /></p>}
          </div>
          {aside === 'promptDemo' ? <PromptDemo /> : <ProofCard study={getCaseStudy(aside.proofCard)} />}
        </div>
      </div>
    </section>
  );
}
