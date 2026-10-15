import type { ReactNode } from 'react';

// Shared shell for the Privacy and Terms pages: title, draft notice and prose.
export default function LegalPage({ title, updated, draft = false, children }: { title: string; updated: string; draft?: boolean; children: ReactNode }) {
  return (
    <section className="section-y">
      <div className="container-reading">
        <span className="eyebrow mb-8">Legal</span>
        <h1 className="text-[clamp(36px,5vw,56px)] font-semibold leading-[1.05] tracking-tight mb-4">{title}</h1>
        <p className="text-[14px] text-muted mb-10">{updated}</p>
        {draft && (
          <div role="note" className="card-surface border-accent/30 bg-accent/[0.05] p-5 mb-12 text-[15px]" data-testid="legal-draft-notice">
            <strong>Draft, pending review.</strong> This page is a working draft and is not yet in force. Notes marked “Review” need a decision before it goes live.
          </div>
        )}
        <div className="space-y-5 text-[16px] leading-relaxed [&_h2]:text-[22px] [&_h2]:tracking-tight [&_h2]:pt-6 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_a]:text-accent [&_a]:underline">
          {children}
        </div>
      </div>
    </section>
  );
}

/** Inline reviewer note, shown only on draft pages. */
export function Review({ children }: { children: ReactNode }) {
  return <span className="block text-[14px] text-muted border-l-2 border-accent/40 pl-3">Review: {children}</span>;
}
