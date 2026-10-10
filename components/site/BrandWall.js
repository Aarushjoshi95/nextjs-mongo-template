'use client';

import { useState } from 'react';

// Growth teams Aarush has worked with. Logos are pulled from each brand's public favicon
// and fall back to a brand-coloured monogram if the icon is unavailable.
const brands = [
  { name: 'Traya', domain: 'traya.health', sector: 'D2C · Hair health', color: '#111827' },
  { name: 'Kama Ayurveda', domain: 'kamaayurveda.com', sector: 'D2C · Luxury beauty', color: '#9b1c31' },
  { name: 'Forest Essentials', domain: 'forestessentialsindia.com', sector: 'D2C · Luxury Ayurveda', color: '#2f5d3a' },
  { name: 'Spin', domain: null, sector: 'Consumer', color: '#f26522' },
  { name: 'Zee Zest', domain: null, sector: 'Media · Lifestyle', color: '#6d28d9' },
  { name: 'QS Top Universities', domain: 'topuniversities.com', sector: 'Edtech · Rankings', color: '#f5a500' },
  { name: 'Emeritus', domain: 'emeritus.org', sector: 'Edtech · Executive education', color: '#17a05b' },
  { name: 'Ramco', domain: 'ramco.com', sector: 'Enterprise · ERP', color: '#1d4ed8' },
  { name: 'Nestlé', domain: 'nestle.com', sector: 'FMCG', color: '#5b4636' },
  { name: 'Scaler', domain: 'scaler.com', sector: 'Edtech · Tech upskilling', color: '#2563eb' },
  { name: 'Eureka Forbes', domain: 'eurekaforbes.com', sector: 'Consumer durables', color: '#1e3a8a' },
  { name: 'Schneider Electric', domain: 'se.com', sector: 'Enterprise · Energy', color: '#3dcd58' },
];

function BrandMark({ brand }) {
  const [failed, setFailed] = useState(false);
  const initial = brand.name.charAt(0).toUpperCase();
  const showImg = brand.domain && !failed;
  return (
    <span
      className="relative w-12 h-12 shrink-0 rounded-xl flex items-center justify-center overflow-hidden ring-1 ring-[rgb(var(--line))] bg-[rgb(var(--surface))]"
      style={!showImg ? { backgroundColor: `${brand.color}14`, color: brand.color } : undefined}
      aria-hidden
    >
      {showImg ? (
        <img
          src={`https://www.google.com/s2/favicons?domain=${brand.domain}&sz=64`}
          alt=""
          width={28}
          height={28}
          loading="lazy"
          onError={() => setFailed(true)}
          className="w-8 h-8 object-contain grayscale group-hover:grayscale-0 transition duration-300"
        />
      ) : (
        <span className="font-semibold text-[18px] tracking-tight" style={{ fontFamily: 'Inter Tight' }}>{initial}</span>
      )}
    </span>
  );
}

export default function BrandWall() {
  return (
    <div data-testid="brand-wall">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <span className="text-[11px] uppercase tracking-[0.14em] font-mono text-[rgb(var(--muted))]">Trusted by growth teams at</span>
        <span className="text-[12px] text-[rgb(var(--muted))]">{brands.length} brands · D2C, edtech, enterprise, media · India, US, UK, UAE</span>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {brands.map((b) => (
          <li
            key={b.name}
            className="group card-surface p-4 sm:p-5 flex items-center gap-4 hover:border-[rgb(var(--ink))]/30 hover:-translate-y-0.5"
            data-testid={`brand-${b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
          >
            <BrandMark brand={b} />
            <span className="min-w-0 leading-tight">
              <span className="block text-[16px] font-semibold tracking-tight leading-tight" style={{ fontFamily: 'Inter Tight' }}>{b.name}</span>
              <span className="block text-[12px] text-[rgb(var(--muted))] mt-1">{b.sector}</span>
            </span>
            <span aria-hidden className="ml-auto w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition" style={{ backgroundColor: b.color }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
