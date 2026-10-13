'use client';

import { useState } from 'react';

// Growth teams Aarush has worked with. Official brand logos are served locally from
// /public/logos (sourced from each brand's own site / brand assets). If a logo file is
// missing or fails to load we fall back to a brand-coloured monogram.
const brands = [
  { name: 'Traya', logo: '/logos/traya.png', sector: 'D2C · Hair health', color: '#111827', scale: 1 },
  { name: 'Kama Ayurveda', logo: '/logos/kama-ayurveda.png', sector: 'D2C · Luxury beauty', color: '#9b1c31', scale: 1.4 },
  { name: 'Forest Essentials', logo: '/logos/forest-essentials.png', sector: 'D2C · Luxury Ayurveda', color: '#2f5d3a', scale: 1.55 },
  { name: 'Spin', logo: null, sector: 'Consumer', color: '#f26522', scale: 1 },
  { name: 'Zee Zest', logo: '/logos/zee-zest.svg', sector: 'Media · Lifestyle', color: '#6d28d9', scale: 1.15 },
  { name: 'QS Top Universities', logo: '/logos/qs-top-universities.png', sector: 'Edtech · Rankings', color: '#f5a500', scale: 1.1 },
  { name: 'Emeritus', logo: '/logos/emeritus.png', sector: 'Edtech · Executive education', color: '#17a05b', scale: 0.9 },
  { name: 'Ramco', logo: '/logos/ramco.png', sector: 'Enterprise · ERP', color: '#1d4ed8', scale: 0.85 },
  { name: 'Nestlé', logo: '/logos/nestle.svg', sector: 'FMCG', color: '#5b4636', scale: 0.95 },
  { name: 'Scaler', logo: '/logos/scaler.svg', sector: 'Edtech · Tech upskilling', color: '#2563eb', scale: 0.9 },
  { name: 'Eureka Forbes', logo: '/logos/eureka-forbes.svg', sector: 'Consumer durables', color: '#003594', scale: 0.9 },
  { name: 'Schneider Electric', logo: '/logos/schneider-electric.svg', sector: 'Enterprise · Energy', color: '#3dcd58', scale: 1 },
  { name: 'Luminous', logo: null, sector: 'Consumer durables · Power & solar', color: '#1a4f9c', scale: 1 },
  { name: 'Max Life Insurance', logo: '/logos/max-life-insurance.svg', sector: 'BFSI · Life insurance', color: '#b5121b', scale: 1.1 },
  { name: 'Care Health Insurance', logo: '/logos/care-health-insurance.png', sector: 'BFSI · Health insurance', color: '#00a651', scale: 1.5 },
];

function BrandMark({ brand }) {
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

export default function BrandWall() {
  return (
    <div data-testid="brand-wall">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <span className="text-[11px] uppercase tracking-[0.14em] font-mono text-[rgb(var(--muted))]">Trusted by growth teams at</span>
        <span className="text-[12px] text-[rgb(var(--muted))]">{brands.length} brands · D2C, edtech, BFSI, enterprise, media · India, US, UK, UAE</span>
      </div>
      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {brands.map((b) => (
          <li
            key={b.name}
            className="group card-surface p-4 sm:p-5 flex flex-col justify-between gap-4 min-h-[112px] hover:border-[rgb(var(--ink))]/30 hover:-translate-y-0.5"
            data-testid={`brand-${b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
          >
            <BrandMark brand={b} />
            <span className="min-w-0 leading-tight flex items-end justify-between gap-3">
              <span className="min-w-0">
                <span className="block text-[14px] font-semibold tracking-tight leading-tight" style={{ fontFamily: 'var(--font-display)' }}>{b.name}</span>
                <span className="block text-[11.5px] text-[rgb(var(--muted))] mt-1 truncate">{b.sector}</span>
              </span>
              <span aria-hidden className="shrink-0 mb-1 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition" style={{ backgroundColor: b.color }} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
