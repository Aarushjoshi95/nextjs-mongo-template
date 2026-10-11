import { getPublishedCaseStudies } from '@/lib/content/caseStudies';
import { tools } from '@/lib/content/tools';

const SITE = 'https://aarushjoshi.in';

export default function sitemap() {
  const now = new Date();
  const staticPages = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE}/case-studies`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/tools`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ];
  const caseStudyPages = getPublishedCaseStudies().map((c) => ({
    url: `${SITE}/case-studies/${c.slug}`,
    lastModified: c.publishedAt ? new Date(c.publishedAt) : now,
    changeFrequency: 'yearly',
    priority: 0.7,
  }));
  const toolPages = tools.map((t) => ({
    url: `${SITE}/tools/${t.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));
  return [...staticPages, ...caseStudyPages, ...toolPages];
}
