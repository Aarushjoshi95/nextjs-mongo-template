import type { MetadataRoute } from 'next';
import { getPublishedCaseStudies } from '@/lib/content';
import { tools } from '@/config/tools';
import { site } from '@/config/site';

const SITE = site.url;

// Built from content and config. Coming-soon case studies and draft pages (noindex) stay out.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE}/case-studies`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/tools`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ];
  const caseStudyPages: MetadataRoute.Sitemap = getPublishedCaseStudies().map((c) => ({
    url: `${SITE}/case-studies/${c.slug}`,
    lastModified: c.publishedAt ? new Date(c.publishedAt) : now,
    changeFrequency: 'yearly',
    priority: 0.7,
  }));
  const toolPages: MetadataRoute.Sitemap = tools.map((t) => ({
    url: `${SITE}/tools/${t.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));
  return [...staticPages, ...caseStudyPages, ...toolPages];
}
