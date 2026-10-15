'use client';

import { useEffect, useState } from 'react';

export default function StickyTOC({ sections }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observers = sections.map((s) => {
      const el = document.getElementById(s.id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(s.id); },
        { rootMargin: '-20% 0px -70% 0px' }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [sections]);

  return (
    <aside className="hidden lg:block">
      <nav className="sticky top-28" aria-label="On this page">
        <div className="text-[11px] uppercase tracking-[0.12em] text-muted mb-4">On this page</div>
        <ul className="space-y-2.5">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`block text-[13px] transition-colors ${active === s.id ? 'text-accent font-medium' : 'text-muted hover:text-ink'}`}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
