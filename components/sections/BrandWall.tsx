'use client';

import { useState } from 'react';
import type { Brand } from '@/config/brands';

// Brand grid for the brandStrip block. If a logo file is missing or fails to load,
// it falls back to a brand-coloured monogram.
function BrandMark({ brand }: { brand: Brand }) {
  const [failed, setFailed] = useState(false);
  const showImg = brand.logo && !failed;
  const initial = brand.name.charAt(0).toUpperCase();

  if (!showImg) {
    return (
      <span
        className="h-11 w-11 shrink-0 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${brand.color}14`, color: brand.color }}
        aria-hidden
      >
        <span className="font-semibold text-[17px] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{initial}</span>
      </span>
    );
  }

  return (
    <span className="h-11 flex items-center" aria-hidden>
      <img
        src={brand.logo}
        alt={`${brand.name} logo`}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="block object-contain object-left max-w-[150px] grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition duration-300"
        style={{ height: `${Math.round(28 * (brand.scale || 1))}px`, width: 'auto' }}
      />
    </span>
  );
}

export default function BrandWall({ brands, label, caption }: { brands: Brand[]; label: string; caption: string }) {
  return (
    <div data-testid="brand-wall">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <span className="text-[11px] uppercase tracking-[0.14em] font-mono text-muted">{label}</span>
        <span className="text-[12px] text-muted">{caption}</span>
      </div>
      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {brands.map((b) => (
          <li
            key={b.name}
            className="group card-surface p-4 sm:p-5 flex flex-col justify-between gap-4 min-h-[112px] hover:border-ink/30 hover:-translate-y-0.5"
            data-testid={`brand-${b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
          >
            <BrandMark brand={b} />
            <span className="min-w-0 leading-tight flex items-end justify-between gap-3">
              <span className="min-w-0">
                <span className="block text-[14px] font-semibold tracking-tight leading-tight" style={{ fontFamily: 'var(--font-display)' }}>{b.name}</span>
                <span className="block text-[11.5px] text-muted mt-1 truncate">{b.sector}</span>
              </span>
              <span aria-hidden className="shrink-0 mb-1 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition" style={{ backgroundColor: b.color }} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
