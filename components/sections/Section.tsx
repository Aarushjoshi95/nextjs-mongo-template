import type { ReactNode } from 'react';

export type SectionProps = { id?: string; tone?: 'paper' | 'surface'; border?: boolean };

/** Standard page section: vertical rhythm, optional top rule, paper or surface background. */
export default function Section({ id, tone = 'paper', border = true, children }: SectionProps & { children: ReactNode }) {
  const className = ['section-y', border && 'border-t border-line', tone === 'surface' && 'bg-surface'].filter(Boolean).join(' ');
  return (
    <section id={id} className={className}>
      <div className="container-max">{children}</div>
    </section>
  );
}
