// Loads and validates everything under content/. Pages, the sitemap and llms.txt read
// content only through these getters. Any error (schema, broken reference, [PLACEHOLDER]
// text) throws, so `next build` fails; `npm run content:check` prints the same list.
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import type { ZodError, ZodTypeAny } from 'zod';
import { caseStudy, page, type Block, type CaseStudy, type Page, type PublishedCaseStudy } from '@/lib/schema';
import { site, type SiteToken } from '@/config/site';
import { brands } from '@/config/brands';
import { headerNav, footerNav, legalNav } from '@/config/nav';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'content');
const PLACEHOLDER = '[PLACEHOLDER]';
// Folders scanned for placeholder text besides content/.
const PLACEHOLDER_DIRS = ['config'];

type Loaded = { caseStudies: CaseStudy[]; pages: Page[]; errors: string[] };

const rel = (file: string) => path.relative(ROOT, file).replace(/\\/g, '/');

function zodErrors(file: string, err: ZodError): string[] {
  return err.issues.map((i) => `${rel(file)}: ${i.path.join('.') || '(root)'}: ${i.message}`);
}

/** Splits an .mdx file into YAML frontmatter and body. */
function readMdx(file: string): { data: unknown; body: string } {
  const raw = fs.readFileSync(file, 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error(`${rel(file)}: missing --- frontmatter block`);
  return { data: parse(m[1]), body: m[2] };
}

/** Reads and validates every .mdx file in content/<dir>. Coming-soon items skip the placeholder check. */
function loadDir<T>(dir: string, schema: ZodTypeAny, errors: string[]): { file: string; data: T }[] {
  const abs = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(abs)) return [];
  const out: { file: string; data: T }[] = [];
  for (const name of fs.readdirSync(abs).filter((f) => f.endsWith('.mdx')).sort()) {
    const file = path.join(abs, name);
    let parsed: { data: unknown; body: string };
    try {
      parsed = readMdx(file);
    } catch (e) {
      errors.push(e instanceof Error ? e.message : String(e));
      continue;
    }
    // v1 content is frontmatter only; a body would be silently dropped.
    if (parsed.body.trim()) errors.push(`${rel(file)}: body must be empty (all copy goes in frontmatter)`);
    const status = (parsed.data as { status?: string } | null)?.status;
    if (status !== 'coming-soon' && fs.readFileSync(file, 'utf8').includes(PLACEHOLDER)) {
      errors.push(`${rel(file)}: contains ${PLACEHOLDER}`);
    }
    const result = schema.safeParse(parsed.data);
    if (!result.success) {
      errors.push(...zodErrors(file, result.error));
      continue;
    }
    const slug = (result.data as { slug?: string }).slug;
    if (slug !== undefined && slug !== name.replace(/\.mdx$/, '')) {
      errors.push(`${rel(file)}: slug "${slug}" must match the file name`);
    }
    out.push({ file, data: result.data as T });
  }
  return out;
}

function scanPlaceholders(errors: string[]) {
  for (const dir of PLACEHOLDER_DIRS) {
    const abs = path.join(ROOT, dir);
    if (!fs.existsSync(abs)) continue;
    for (const name of fs.readdirSync(abs)) {
      const file = path.join(abs, name);
      if (fs.statSync(file).isFile() && fs.readFileSync(file, 'utf8').includes(PLACEHOLDER)) {
        errors.push(`${rel(file)}: contains ${PLACEHOLDER}`);
      }
    }
  }
}

const publicFileExists = (src: string) => fs.existsSync(path.join(ROOT, 'public', src));

/** Static routes under app/(site), e.g. /tools/revenue-impact-calculator (dynamic segments skipped). */
function staticRoutes(): Set<string> {
  const routes = new Set<string>();
  const walk = (dir: string, route: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory() && !e.name.startsWith('[')) walk(path.join(dir, e.name), `${route}/${e.name}`);
      else if (/^page\.(js|jsx|ts|tsx)$/.test(e.name)) routes.add(route || '/');
    }
  };
  const app = path.join(ROOT, 'app', '(site)');
  if (fs.existsSync(app)) walk(app, '');
  return routes;
}

/** Every string inside a value, with its dotted path. */
function strings(value: unknown, at = ''): [string, string][] {
  if (typeof value === 'string') return [[at, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, `${at}.${i}`));
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([k, v]) => strings(v, at ? `${at}.${k}` : k));
  return [];
}

/** Checks a page's blocks against case studies, brands, logos, {tokens} and anchor ids. */
function checkBlocks(file: string, blocks: Block[], studies: CaseStudy[], errors: string[]) {
  const where = (i: number, field: string) => `${rel(file)}: blocks.${i}.${field}`;
  const study = (slug: string) => studies.find((c) => c.slug === slug);
  const brandNames = (names: string[] | undefined, i: number, field: string) => {
    for (const n of names || []) if (!brands.some((b) => b.name === n)) errors.push(`${where(i, field)}: unknown brand "${n}" (see config/brands.ts)`);
  };
  blocks.forEach((b, i) => {
    for (const [at, str] of strings(b)) {
      for (const [, token] of str.matchAll(/\{(\w+)\}/g)) {
        const ok = token === 'count' ? at.endsWith('caption') : typeof site[token as SiteToken] === 'string';
        if (!ok) errors.push(`${where(i, at)}: unknown token {${token}}`);
      }
    }
    if (b.type === 'hero' && typeof b.aside === 'object') {
      const s = study(b.aside.proofCard);
      if (!s) errors.push(`${where(i, 'aside.proofCard')}: unknown case study "${b.aside.proofCard}"`);
      else if (!s.card) errors.push(`${where(i, 'aside.proofCard')}: case study "${s.slug}" has no card`);
    }
    if (b.type === 'caseStudyCards') {
      b.caseStudies.forEach((slug, j) => {
        const s = study(slug);
        if (!s) errors.push(`${where(i, `caseStudies.${j}`)}: unknown case study "${slug}"`);
        else if (s.status !== 'published') errors.push(`${where(i, `caseStudies.${j}`)}: "${slug}" is not published`);
        else if (!s.card) errors.push(`${where(i, `caseStudies.${j}`)}: case study "${slug}" has no card`);
      });
      brandNames(b.brandStrip?.brands, i, 'brandStrip.brands');
    }
    if (b.type === 'proofResults') {
      b.caseStudies.forEach((slug, j) => {
        const s = study(slug);
        if (!s) errors.push(`${where(i, `caseStudies.${j}`)}: unknown case study "${slug}"`);
        else if (!s.proof?.length) errors.push(`${where(i, `caseStudies.${j}`)}: case study "${slug}" has no proof tabs`);
      });
    }
    if (b.type === 'brandStrip') brandNames(b.brands, i, 'brands');
  });
}

/** Ids a page exposes as #anchors: block ids, plus the hero's #top. */
function anchorIds(blocks: Block[]): Set<string> {
  return new Set(blocks.flatMap((b) => [b.id, b.type === 'hero' ? 'top' : undefined]).filter(Boolean));
}

/** Internal links in content and config must resolve to a route, a content slug or a homepage anchor. */
function checkLinks(pages: Page[], studies: CaseStudy[], errors: string[]) {
  const routes = staticRoutes();
  for (const c of studies) routes.add(`/case-studies/${c.slug}`);
  const home = pages.find((p) => p.slug === 'home');
  const homeIds = anchorIds(home?.blocks || []);
  const resolves = (href: string, pageIds: Set<string>) => {
    if (/^(https?:|mailto:|tel:)/.test(href)) return true;
    if (href.startsWith('#')) return pageIds.has(href.slice(1));
    const [route, hash] = href.split('#');
    if (!routes.has(route)) return false;
    // If home.mdx itself failed to load, its own error is the one to fix.
    return !hash || (route === '/' && (!home || homeIds.has(hash)));
  };
  for (const p of pages) {
    const ids = anchorIds(p.blocks);
    for (const [at, str] of strings(p.blocks)) {
      if (/\.href$/.test(at) && !resolves(str, ids)) errors.push(`content/pages/${p.slug}.mdx: blocks${at}: link "${str}" does not resolve`);
    }
  }
  const navLinks = [...headerNav, ...footerNav.flatMap((g) => g.links), ...legalNav].filter((l) => !l.hidden);
  if (site.announcement) navLinks.push({ label: 'announcement', href: site.announcement.href });
  for (const l of navLinks) if (!resolves(l.href, homeIds)) errors.push(`config: link "${l.label}" → "${l.href}" does not resolve`);
}

let cache: Loaded | null = null;

/** Loads all content and collects every error instead of stopping at the first one. */
export function loadContent(): Loaded {
  // Re-read on every call in dev so content edits show up without a restart.
  if (cache && process.env.NODE_ENV !== 'development') return cache;
  const errors: string[] = [];

  const caseStudyEntries = loadDir<CaseStudy>('case-studies', caseStudy, errors);
  const proofIds = new Set<string>();
  for (const { file, data } of caseStudyEntries) {
    for (const e of data.evidence || []) {
      if (!publicFileExists(e.src)) errors.push(`${rel(file)}: evidence image not found: public${e.src}`);
    }
    for (const t of data.proof || []) {
      if (proofIds.has(t.id)) errors.push(`${rel(file)}: proof tab id "${t.id}" is used twice`);
      proofIds.add(t.id);
    }
  }

  const studies = caseStudyEntries.map((e) => e.data);
  const pageEntries = loadDir<Page>('pages', page, errors);
  for (const { file, data } of pageEntries) checkBlocks(file, data.blocks, studies, errors);
  for (const b of brands) {
    if (b.logo && !publicFileExists(b.logo)) errors.push(`config/brands.ts: logo not found for "${b.name}": public${b.logo}`);
  }
  const pages = pageEntries.map((e) => e.data);
  checkLinks(pages, studies, errors);

  scanPlaceholders(errors);

  cache = { caseStudies: studies, pages, errors };
  return cache;
}

function content(): Loaded {
  const loaded = loadContent();
  if (loaded.errors.length) throw new Error(`Content check failed:\n  ${loaded.errors.join('\n  ')}`);
  return loaded;
}

// ---------------------------------------------------------------------------
// Case studies
// ---------------------------------------------------------------------------

const byOrder = (a: CaseStudy, b: CaseStudy) => (a.order ?? 999) - (b.order ?? 999);

export function getCaseStudies(): CaseStudy[] {
  return [...content().caseStudies].sort(byOrder);
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return content().caseStudies.find((c) => c.slug === slug);
}

export function getPublishedCaseStudies(): PublishedCaseStudy[] {
  return getCaseStudies().filter((c): c is PublishedCaseStudy => c.status === 'published');
}

/** Coming-soon case studies: listed with a badge, noindex, out of the sitemap. */
export function getPipelineCaseStudies(): CaseStudy[] {
  return getCaseStudies().filter((c) => c.status === 'coming-soon');
}

export function getFeaturedCaseStudy(): PublishedCaseStudy {
  const published = getPublishedCaseStudies();
  return published.find((c) => c.featured) || published[0];
}

export function getNextCaseStudy(slug: string): PublishedCaseStudy | null {
  const published = getPublishedCaseStudies();
  const idx = published.findIndex((c) => c.slug === slug);
  if (idx === -1) return null;
  return published[(idx + 1) % published.length];
}

// ---------------------------------------------------------------------------
// Pages (block lists)
// ---------------------------------------------------------------------------

export function getPage(slug: string): Page {
  const p = content().pages.find((x) => x.slug === slug);
  if (!p) throw new Error(`content/pages/${slug}.mdx not found`);
  return p;
}
