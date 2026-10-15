// Site-wide facts. Every page, the metadata and the JSON-LD read from here;
// never restate these strings anywhere else.

export const site = {
  url: 'https://aarushjoshi.in',
  name: 'Aarush',
  fullName: 'Aarush Joshi',
  role: 'SEO & AI Search Visibility Consultant',
  // Short line under the logo in the header and footer.
  tagline: 'AI Search Visibility',
  // The one positioning line: page titles, OG, WebSite schema and the hero.
  positioning: 'Get recommended when buyers ask AI',
  description:
    'SEO and AI search visibility for funded startups, D2C and edtech brands, tied to leads and revenue. 8+ years in organic growth.',
  // Who the work is for (hero eyebrow) vs where the experience comes from (schema, stats).
  audience: 'funded startups, D2C and edtech brands',
  sectors: ['edtech', 'D2C', 'BFSI', 'media'],
  experience: '8+ years',
  footerBlurb: 'AEO, GEO and organic growth for brands that want to be the answer, measured against leads and revenue.',
  email: 'team@aarushjoshi.in',
  linkedin: 'https://www.linkedin.com/in/aarushjoshi/',
  location: 'Bengaluru, India',
  areaServed: ['IN', 'US', 'GB', 'AE'],
  calLink: 'https://calendly.com/aarushjoshi/seo-growth-strategy-30-mins-audit-call',
  // Site-wide strip above the header; null hides it.
  announcement: {
    text: 'Traya: $0 → $450K attributable revenue from organic. Full breakdown coming soon.',
    href: '/case-studies/traya-organic-zero-to-revenue',
  } as { text: string; href: string } | null,
} as const;

/** Fields content can insert as {token}, e.g. "For {audience}". */
export type SiteToken = keyof typeof site;

/** Joins a list as "a, b, c and d". */
export function listText(items: readonly string[]): string {
  return items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

export const headlineStats = [
  { value: '8+ yrs', label: `organic growth across ${site.sectors.join(', ')}` },
  { value: '0 → $1Mn+', label: 'ARR built through organic' },
  { value: '50Mn+', label: 'traffic added across clients' },
  { value: '4 engines', label: 'tracked prompt by prompt: ChatGPT, Claude, Gemini, Perplexity' },
] as const;
