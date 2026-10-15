import { site } from '@/config/site';
import { brands } from '@/config/brands';
import { tools } from '@/config/tools';
import { getCaseStudy, getPage, getPublishedCaseStudies } from '@/lib/content';
import { fill } from '@/components/sections/Inline';
import type { BlockOf } from '@/lib/schema';

// /llms.txt, generated at build time from config and content (https://llmstxt.org).
export const dynamic = 'force-static';

// Strips the ==accent== and **emphasis** markers content copy may use.
const plain = (text: string) => fill(text).replace(/==|\*\*/g, '');

export function GET() {
  const home = getPage('home').blocks;
  const offers = home.find((b): b is BlockOf<'engagements'> => b.type === 'engagements');
  const proof = home.find((b): b is BlockOf<'proofResults'> => b.type === 'proofResults');

  const lines = [
    `# ${site.fullName} — ${site.role}`,
    '',
    `> ${site.description}`,
    '',
    `Site: ${site.url}`,
    `Book a 30-minute discovery call: ${site.calLink}`,
    '',
  ];

  if (offers) {
    lines.push(`## What ${site.name} does`);
    for (const o of offers.items) lines.push(`- ${o.title}: ${plain(o.body)}`);
    lines.push('');
  }

  // Every result shown on the homepage. Coming-soon case studies appear as figures without a link.
  if (proof) {
    lines.push('## Proof (figures reported in the case studies)');
    for (const slug of proof.caseStudies) {
      const s = getCaseStudy(slug);
      if (s.summary) lines.push(`- ${s.client || s.title}: ${s.summary}`);
    }
    lines.push('');
  }

  lines.push('## Case studies');
  for (const s of getPublishedCaseStudies()) lines.push(`- [${s.title}](${site.url}/case-studies/${s.slug})`);
  lines.push(`- [All case studies](${site.url}/case-studies)`, '');

  lines.push('## Free tools');
  for (const t of tools) lines.push(`- [${t.name}](${site.url}/tools/${t.slug}): ${t.short}`);
  lines.push('');

  lines.push('## Brands worked with', `${brands.map((b) => b.name).join(', ')}.`, '');
  lines.push('## Optional', `- [Sitemap](${site.url}/sitemap.xml)`, '');

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
