// Shared structured-data (JSON-LD) builders. Keep every URL absolute.
// Facts come from config/site; don't restate them here.
import { site, listText } from '@/config/site';

export const SITE_URL = site.url;
export const PERSON_ID = `${SITE_URL}/#person`;
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** "Aarush · <positioning>": the default title, OG title and WebSite name. */
export const SITE_TITLE = `${site.name} · ${site.positioning}`;

export function personSchema() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: site.fullName,
    url: SITE_URL,
    jobTitle: site.role,
    description: `Organic growth advisor with ${site.experience} across ${listText(site.sectors)}. Treats organic search and AI answer engines as a P&L-accountable revenue channel.`,
    knowsAbout: ['SEO', 'AI search visibility', 'Answer engine optimisation', 'Google Discover', 'Technical SEO', 'Content strategy', 'Revenue attribution'],
    worksFor: { '@id': ORG_ID },
    sameAs: [site.linkedin],
  };
}

export function organizationSchema() {
  return {
    '@type': 'ProfessionalService',
    '@id': ORG_ID,
    name: `${site.name} · ${site.tagline}`,
    url: SITE_URL,
    founder: { '@id': PERSON_ID },
    description: site.description,
    email: site.email,
    areaServed: site.areaServed,
    serviceType: ['SEO consulting', 'AI search visibility audit', 'Answer engine optimisation', 'Google Discover strategy'],
    potentialAction: {
      '@type': 'ReserveAction',
      name: 'Book a 30-minute SEO growth strategy call',
      target: site.calLink,
    },
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: SITE_TITLE,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
  };
}

export function breadcrumbSchema(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url.startsWith('http') ? it.url : `${SITE_URL}${it.url}`,
    })),
  };
}

export function caseStudySchema(s) {
  const url = `${SITE_URL}/case-studies/${s.slug}`;
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: s.title,
    name: `${s.client} case study: ${s.title}`,
    description: s.summary,
    url,
    mainEntityOfPage: url,
    datePublished: s.publishedAt || undefined,
    author: { '@id': PERSON_ID },
    publisher: { '@id': ORG_ID },
    about: { '@type': 'Thing', name: s.industry },
    keywords: [s.industry, 'SEO case study', s.scope].filter(Boolean).join(', '),
    image: (s.evidence || []).map((e) => `${SITE_URL}${e.src}`),
    isPartOf: { '@id': WEBSITE_ID },
  };
}

export function toolSchema(t) {
  const url = `${SITE_URL}/tools/${t.slug}`;
  return {
    '@type': 'WebApplication',
    name: t.name || t.title,
    url,
    description: t.description || t.summary,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@id': ORG_ID },
  };
}

/** FAQPage from faq block items; table-style answers become "key: value" sentences. */
export function faqSchema(items) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a || f.rows.map((r) => `${r.k}: ${r.v}`).join(' ') },
    })),
  };
}

/** Wraps one or more schema objects in a single @graph document. */
export function jsonLd(...nodes) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes.flat().filter(Boolean) });
}
