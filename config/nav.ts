// Header and footer links. The header and footer render these lists as-is.
import { tools } from '@/lib/content/tools';

export type NavLink = { label: string; href: string; hidden?: boolean };

// Services and FAQ point to homepage anchors until their pages exist.
export const headerNav: NavLink[] = [
  { label: 'Services', href: '/#offers' },
  { label: 'Consulting', href: '/consulting', hidden: true }, // Phase 4 ships the page
  { label: 'Case studies', href: '/case-studies' },
  { label: 'Free tools', href: '/tools' },
  { label: 'FAQ', href: '/#faq' },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: 'Work',
    links: [
      { label: 'AI Visibility Audit', href: '/#offers' },
      { label: 'GEO Programme', href: '/#offers' },
      { label: 'Growth Advisory', href: '/#offers' },
      { label: 'Case studies', href: '/case-studies' },
    ],
  },
  {
    title: 'Free tools',
    links: [
      ...tools.map((t) => ({ label: t.name, href: `/tools/${t.slug}` })),
      { label: 'All tools', href: '/tools' },
    ],
  },
];

export const legalNav: NavLink[] = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];

export const visible = (links: NavLink[]) => links.filter((l) => !l.hidden);
