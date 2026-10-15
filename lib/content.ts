// Loads and validates everything under content/. Pages, the sitemap and llms.txt read
// content only through these getters. Any error (schema, broken reference, [PLACEHOLDER]
// text) throws, so `next build` fails; `npm run content:check` prints the same list.
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import type { ZodError, ZodTypeAny } from 'zod';
import { caseStudy, type CaseStudy, type PublishedCaseStudy } from '@/lib/schema';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'content');
const PLACEHOLDER = '[PLACEHOLDER]';
// Folders scanned for placeholder text besides content/.
const PLACEHOLDER_DIRS = ['config'];

type Loaded = { caseStudies: CaseStudy[]; errors: string[] };

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

  scanPlaceholders(errors);

  cache = { caseStudies: caseStudyEntries.map((e) => e.data), errors };
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
