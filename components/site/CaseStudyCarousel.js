'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Swipeable, scroll-snap carousel for the homepage case-study cards.
 * Native horizontal scrolling (touch + trackpad) with arrow buttons and dot indicators.
 * Shows 1 card on mobile, 2 on large screens, matching the previous 2-column grid.
 */
export default function CaseStudyCarousel({ cases = [] }) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children);
    if (!cards.length) return;
    const left = track.scrollLeft;
    let best = 0;
    let bestD = Infinity;
    cards.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft - left);
      if (d < bestD) { bestD = d; best = i; }
    });
    const atEnd = left + track.clientWidth >= track.scrollWidth - 4;
    setIndex(atEnd ? cards.length - 1 : best);
    setCanPrev(left > 4);
    setCanNext(!atEnd);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    measure();
    track.addEventListener('scroll', measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => {
      track.removeEventListener('scroll', measure);
      ro.disconnect();
    };
  }, [measure]);

  const scrollToCard = (i) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.children;
    const clamped = Math.max(0, Math.min(cards.length - 1, i));
    const card = cards[clamped];
    if (!card) return;
    const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    track.scrollTo({ left: card.offsetLeft, behavior: reduced ? 'auto' : 'smooth' });
  };

  const step = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[0];
    if (!card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '20') || 20;
    const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: reduced ? 'auto' : 'smooth' });
  };

  const iconBtn = 'w-10 h-10 inline-flex items-center justify-center rounded-full border border-[rgb(var(--line))] bg-[rgb(var(--surface))] text-[rgb(var(--ink))] transition-colors hover:border-[rgb(var(--ink))] disabled:opacity-35 disabled:hover:border-[rgb(var(--line))] disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))] focus-visible:ring-offset-2';

  return (
    <div data-testid="case-carousel">
      <div
        ref={trackRef}
        className="relative flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-6 px-6 lg:mx-0 lg:px-0 pb-2"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        aria-roledescription="carousel"
        aria-label="Case studies"
        data-testid="case-carousel-track"
      >
        {cases.map((c, i) => (
          <Link
            key={c.slug}
            href={`/case-studies/${c.slug}`}
            className="card-surface p-8 group flex flex-col snap-start shrink-0 w-[calc(100%-1.5rem)] sm:w-[calc(100%-4rem)] lg:w-[calc(50%-10px)]"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${cases.length}`}
            data-testid={`case-card-${c.slug}`}
          >
            <div className="flex flex-wrap gap-1.5 mb-5">
              {c.tags.map((t) => <span key={t} className="pill text-[11px]">{t}</span>)}
            </div>
            <h3 className="text-[22px] font-semibold leading-[1.2] tracking-tight mb-6">{c.title}</h3>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-mono text-[36px] font-medium text-[rgb(var(--accent))] leading-none">{c.headline}</span>
              <span className="text-[13px] text-[rgb(var(--muted))]">{c.headlineLabel}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-md border border-[rgb(var(--line))] p-4">
                <div className="text-[11px] uppercase tracking-wider text-[rgb(var(--muted))] mb-1">{c.beforeLabel} · Before</div>
                <div className="font-mono text-[20px]">{c.beforeValue}</div>
              </div>
              <div className="rounded-md border border-[rgb(var(--accent))]/30 bg-[rgb(var(--accent))]/[0.05] p-4">
                <div className="text-[11px] uppercase tracking-wider text-[rgb(var(--accent))] mb-1">{c.afterLabel} · After</div>
                <div className="font-mono text-[20px] text-[rgb(var(--accent))]">{c.afterValue}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[rgb(var(--muted))] mb-6">
              {c.chips.map((ch, j) => (
                <div key={j} className="flex items-baseline gap-2"><span className="font-mono text-[rgb(var(--ink))] font-medium">{ch.k}</span>{ch.v}</div>
              ))}
            </div>
            <span className="link-underline mt-auto text-[14px]">Read the breakdown <ArrowRight className="w-3.5 h-3.5" /></span>
          </Link>
        ))}
      </div>

      {/* controls */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[rgb(var(--muted))]" data-testid="case-carousel-counter">
            {String(index + 1).padStart(2, '0')} / {String(cases.length).padStart(2, '0')}
          </span>
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Go to case study">
            {cases.map((c, i) => (
              <button
                key={c.slug}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Case study ${i + 1}`}
                onClick={() => scrollToCard(i)}
                data-testid={`case-dot-${i}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-[rgb(var(--ink))]' : 'w-1.5 bg-[rgb(var(--line))] hover:bg-[rgb(var(--muted))]'}`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => step(-1)} disabled={!canPrev} aria-label="Previous case study" className={iconBtn} data-testid="case-prev">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => step(1)} disabled={!canNext} aria-label="Next case study" className={iconBtn} data-testid="case-next">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
