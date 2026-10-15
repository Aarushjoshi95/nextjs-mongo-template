// Brands Aarush has worked with: the brand strip, the case-study section and llms.txt.
// Logos live in public/logos (sourced from each brand's own site / brand assets). A null
// logo, or one that fails to load, falls back to a brand-coloured monogram.

export type Brand = {
  name: string;
  logo: string | null;
  sector: string;
  color: string;
  // Optical size correction for the logo height.
  scale: number;
};

export const brands: Brand[] = [
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

/** Brands by name, in the order given; no names means all brands. */
export function pickBrands(names?: string[]): Brand[] {
  return names?.length ? names.map((n) => brands.find((b) => b.name === n)).filter(Boolean) : brands;
}
