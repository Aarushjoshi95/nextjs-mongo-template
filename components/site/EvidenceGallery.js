'use client';

import { useEffect, useState } from 'react';
import { X, ZoomIn, ShieldCheck } from 'lucide-react';

/**
 * Evidence gallery for case-study pages: Search Console screenshots (blurred at source,
 * client identifiers removed) plus supporting figures. Click any shot to open a lightbox.
 */
export default function EvidenceGallery({ items = [] }) {
  const [open, setOpen] = useState(null);

  useEffect(() => {
    if (open == null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((i) => (i + 1) % items.length);
      if (e.key === 'ArrowLeft') setOpen((i) => (i - 1 + items.length) % items.length);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, items.length]);

  if (!items.length) return null;
  const gsc = items.filter((i) => i.kind === 'gsc');
  const figures = items.filter((i) => i.kind !== 'gsc');

  const Tile = ({ item, index, large }) => (
    <button
      type="button"
      onClick={() => setOpen(index)}
      className="card-surface group relative overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      data-testid={`evidence-tile-${index}`}
    >
      <div className={`relative overflow-hidden ${item.kind === 'gsc' ? 'bg-paper' : 'bg-white'} ${large ? 'aspect-[16/8]' : 'aspect-[16/9]'}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.src}
          alt={item.alt}
          loading="lazy"
          className={`absolute inset-0 w-full h-full ${item.kind === 'gsc' ? 'object-cover object-top' : 'object-contain p-3'} transition-transform duration-500 group-hover:scale-[1.02]`}
        />
        {item.kind === 'gsc' && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-ink text-paper px-2.5 py-1 text-[10.5px] font-mono uppercase tracking-[0.1em]">
            <ShieldCheck className="w-3 h-3" /> Search Console
          </span>
        )}
        <span className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-surface/90 border border-line inline-flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-3.5 h-3.5" />
        </span>
      </div>
      <div className="px-5 py-4 border-t border-line">
        <div className="text-[14px] font-medium leading-snug">{item.caption}</div>
        {item.note && <div className="text-[12px] text-muted mt-1">{item.note}</div>}
      </div>
    </button>
  );

  return (
    <div data-testid="evidence-gallery">
      {gsc.length > 0 && (
        <div className="mb-10">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
            <h3 className="text-[18px] font-semibold">Search Console proof shots</h3>
            <span className="text-[12px] text-muted">Client identifiers blurred at source. Click to enlarge.</span>
          </div>
          <div className={`grid gap-5 ${gsc.length === 1 ? 'grid-cols-1' : gsc.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
            {gsc.map((item) => <Tile key={item.src} item={item} index={items.indexOf(item)} large={gsc.length === 1} />)}
          </div>
        </div>
      )}
      {figures.length > 0 && (
        <div className="mb-10">
          <h3 className="text-[18px] font-semibold mb-4">Supporting figures</h3>
          <div className={`grid gap-5 ${figures.length === 1 ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
            {figures.map((item) => <Tile key={item.src} item={item} index={items.indexOf(item)} />)}
          </div>
        </div>
      )}

      {open != null && (
        <div
          className="fixed inset-0 z-[100] bg-ink/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
          aria-label={items[open].caption}
          data-testid="evidence-lightbox"
        >
          <button
            type="button"
            onClick={() => setOpen(null)}
            aria-label="Close"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface text-ink inline-flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
          <figure className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={items[open].src} alt={items[open].alt} className="w-full h-auto max-h-[78vh] object-contain rounded-lg bg-surface" />
            <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 text-paper">
              <span className="text-[14px]">{items[open].caption}{items[open].note ? ` — ${items[open].note}` : ''}</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] opacity-70">{open + 1} / {items.length} · ← → to browse · Esc to close</span>
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
