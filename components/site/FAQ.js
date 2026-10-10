'use client';

import { useState, Fragment } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'How is GEO different from SEO?',
    a: 'SEO earns a position in a list of links. GEO earns a mention inside a generated answer. The foundations overlap (crawlable pages, clear entities, authority), but the target changes: you need to be the brand a model can describe confidently and the source it chooses to cite.',
  },
  {
    q: 'How long until we see results?',
    rows: [
      { k: '2–4 weeks', v: 'Technical, schema and entity fixes on pages you already have.' },
      { k: '~90 days', v: 'New answer-ready and comparison pages start getting cited.' },
      { k: '6 months+', v: 'Share of voice compounds as third-party mentions build up.' },
    ],
  },
  {
    q: 'Can you guarantee ChatGPT will mention us?',
    a: 'No. Anyone who guarantees it is guessing. What I can commit to is a measured baseline, a prioritised plan, and weekly reporting on whether share of voice is moving.',
  },
  {
    q: 'What is included?',
    rows: [
      { k: 'Prompt research', v: 'Buyer prompt sets per category, tracked across four engines.' },
      { k: 'On-site', v: 'Entity, schema, answer-ready pages, llms.txt and crawler access.' },
      { k: 'Off-site', v: 'The reviews, forums, listicles and publications engines cite.' },
      { k: 'Measurement', v: 'Share of voice dashboard and AI-referred lead attribution.' },
    ],
  },
  {
    q: 'What is not included?',
    rows: [
      { k: 'Paid ads', v: 'A different game. I share audiences with your ads team.' },
      { k: 'Local SEO', v: 'Store footfall needs a local-first specialist.' },
      { k: 'Daily content', v: 'Your writers run on my briefs and QA rubric.' },
    ],
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <div className="divide-y divide-[rgb(var(--line))] border-y border-[rgb(var(--line))]">
      {faqs.map((f, i) => (
        <div key={i}>
          <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between py-6 text-left group" aria-expanded={open === i}>
            <span className="text-[18px] lg:text-[22px] font-semibold tracking-tight pr-4">{f.q}</span>
            {open === i ? <Minus className="w-5 h-5 shrink-0 text-[rgb(var(--muted))]" /> : <Plus className="w-5 h-5 shrink-0 text-[rgb(var(--muted))] group-hover:text-[rgb(var(--ink))]" />}
          </button>
          {open === i && (
            <div className="pb-7 text-[16px] text-[rgb(var(--muted))] leading-relaxed max-w-3xl">
              {f.a && <p>{f.a}</p>}
              {f.rows && (
                <div className="grid sm:grid-cols-[160px_1fr] gap-x-6 gap-y-3">
                  {f.rows.map((r, j) => (
                    <Fragment key={j}>
                      <div className="font-mono text-[13px] uppercase tracking-wider text-[rgb(var(--ink))]">{r.k}</div>
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
