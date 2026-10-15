'use client';

import { useState, Fragment } from 'react';
import { Plus, Minus } from 'lucide-react';
import type { BlockOf } from '@/lib/schema';

type FaqItem = BlockOf<'faq'>['items'][number];

/** Accordion for the faq block: one item open at a time, the first open by default. */
export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f, i) => (
        <div key={i}>
          <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between py-6 text-left group" aria-expanded={open === i}>
            <span className="text-[18px] lg:text-[22px] font-semibold tracking-tight pr-4">{f.q}</span>
            {open === i ? <Minus className="w-5 h-5 shrink-0 text-muted" /> : <Plus className="w-5 h-5 shrink-0 text-muted group-hover:text-ink" />}
          </button>
          {open === i && (
            <div className="pb-7 text-[16px] text-muted leading-relaxed max-w-3xl">
              {f.a && <p>{f.a}</p>}
              {f.rows && (
                <div className="grid sm:grid-cols-[160px_1fr] gap-x-6 gap-y-3">
                  {f.rows.map((r, j) => (
                    <Fragment key={j}>
                      <div className="font-mono text-[13px] uppercase tracking-wider text-ink">{r.k}</div>
                      <div>{r.v}</div>
                    </Fragment>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
