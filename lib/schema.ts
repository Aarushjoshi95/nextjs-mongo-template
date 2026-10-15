// Zod schemas for everything under content/. lib/content.ts validates each file against
// these; the types below are what pages and blocks receive.
import { z } from 'zod';

const text = z.string().trim().min(1);
export const status = z.enum(['published', 'coming-soon']);

// ---------------------------------------------------------------------------
// Proof tabs (ProofResults): the numbers live in the case-study file they belong to.
// ---------------------------------------------------------------------------

const anchor = z.object({ t: z.number(), v: z.number(), label: text }).strict();

export const proofTab = z.object({
  id: text,
  chapter: z.enum(['In-house', 'Client']),
  client: text,
  pill: text,
  sector: text,
  metric: z.object({ value: z.number(), prefix: z.string(), suffix: z.string() }).strict(),
  body: text,
  before: z.object({ label: text, value: text }).strict(),
  after: z.object({ label: text, value: text }).strict(),
  chart: z.object({
    caption: text,
    window: text,
    yTicks: z.array(z.number()).min(2),
    xEvery: z.number().positive(),
    // Formatter pair, picked by key because functions can't cross into the client island.
    format: z.enum(['revenue', 'clicksDay', 'k', 'm']),
    dots: z.boolean(),
    // Shape of the interpolated curve between the reported anchors.
    curve: z.object({
      before: z.number().int().nonnegative(),
      step: z.number().positive().optional(),
      curve: z.number().positive().optional(),
      noise: z.number().nonnegative().optional(),
      beforeNoise: z.number().nonnegative().optional(),
      seed: z.number().int(),
    }).strict(),
    anchors: z.array(anchor).min(2),
  }).strict(),
  // Real month-by-month figures; when present they replace the interpolated curve.
  series: z.object({
    before: z.array(z.number()).optional(),
    after: z.array(z.number()).min(1),
    labels: z.array(z.string()).optional(),
    endLabel: z.string().optional(),
  }).strict().optional(),
}).strict();

// ---------------------------------------------------------------------------
// Case studies
// ---------------------------------------------------------------------------

const stat = z.object({ value: text, label: text }).strict();

// Homepage card (CaseStudyCarousel) and hero proof card.
const card = z.object({
  title: text,
  tags: z.array(text).min(1),
  headline: stat,
  before: z.object({ label: text, value: text }).strict(),
  after: z.object({ label: text, value: text }).strict(),
  chips: z.array(z.object({ k: text, v: text }).strict()),
}).strict();

const caseStudyFields = {
  slug: text,
  title: text,
  client: text,
  industry: text,
  featured: z.boolean(),
  order: z.number().int(),
  summary: text,
  role: text,
  duration: text,
  scope: text,
  stats: z.array(stat).min(1),
  context: z.array(text).min(1),
  pillars: z.array(z.object({ title: text, body: text }).strict()).min(1),
  actions: z.array(text).min(1),
  chart: z.object({
    title: text,
    note: text,
    series: z.array(z.object({ x: text, y: z.number() }).strict()).min(2),
  }).strict(),
  beforeAfter: z.array(z.object({ metric: text, before: text, after: text, delta: text }).strict()).min(1),
  timeline: z.array(z.object({ phase: text, period: text, detail: text }).strict()).min(1),
  lessons: z.array(text).min(1),
  evidence: z.array(z.object({
    kind: z.enum(['gsc', 'chart']),
    src: z.string().startsWith('/'),
    alt: text,
    caption: text,
    note: text,
  }).strict()).optional(),
  testimonial: z.object({ quote: text, name: text, role: text }).strict().nullable().optional(),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'expected YYYY-MM-DD'),
  card: card.optional(),
  proof: z.array(proofTab).optional(),
};

const publishedCaseStudy = z.object({ ...caseStudyFields, status: z.literal('published') }).strict();

// Coming-soon items need only slug, title and status; anything else they carry is still checked.
const comingSoonCaseStudy = z.object(caseStudyFields).partial()
  .extend({ slug: text, title: text, status: z.literal('coming-soon') })
  .strict();

export const caseStudy = z.discriminatedUnion('status', [publishedCaseStudy, comingSoonCaseStudy]);

export type ProofTab = z.infer<typeof proofTab>;
export type CaseStudyCard = z.infer<typeof card>;
export type CaseStudy = z.infer<typeof caseStudy>;
export type PublishedCaseStudy = z.infer<typeof publishedCaseStudy>;

// ---------------------------------------------------------------------------
// Blocks: the ordered sections of the homepage (and, from Phase 4, consulting pages).
// Copy may use {token} for a config/site field, ==text== for accent and **text** for emphasis.
// ---------------------------------------------------------------------------

// Shared section options. `border` is the top rule; `tone` the background.
const sectionFields = {
  id: z.string().regex(/^[a-z][a-z0-9-]*$/, 'lowercase id').optional(),
  tone: z.enum(['paper', 'surface']).optional(),
  border: z.boolean().optional(),
};

const cta = z.object({ label: text }).strict();
const link = z.object({ label: text, href: text }).strict();

const heroBlock = z.object({
  type: z.literal('hero'),
  ...sectionFields,
  eyebrow: text,
  // Omit to use the site positioning line, with its last word in the accent colour.
  headline: text.optional(),
  subhead: text,
  pills: z.array(text).optional(),
  primaryCta: cta,
  secondaryCta: link.optional(),
  footnote: text.optional(),
  aside: z.union([z.literal('promptDemo'), z.object({ proofCard: text }).strict()]),
}).strict();

const statStripBlock = z.object({ type: z.literal('statStrip'), ...sectionFields }).strict();

const problemCardsBlock = z.object({
  type: z.literal('problemCards'),
  ...sectionFields,
  eyebrow: text,
  title: text,
  intro: text.optional(),
  cards: z.array(z.object({
    eyebrow: text.optional(),
    title: text,
    body: text.optional(),
    items: z.array(text).optional(),
    highlight: z.boolean().optional(),
  }).strict()).min(1),
}).strict();

const engagementsBlock = z.object({
  type: z.literal('engagements'),
  ...sectionFields,
  eyebrow: text,
  title: text,
  fitLabel: text,
  items: z.array(z.object({
    tag: text,
    title: text,
    body: text,
    fit: text,
    cta: text,
    highlight: z.boolean().optional(),
  }).strict()).min(1),
}).strict();

const fitBlock = z.object({
  type: z.literal('fit'),
  ...sectionFields,
  eyebrow: text,
  title: text,
  good: z.object({ title: text, items: z.array(text).min(1) }).strict(),
  bad: z.object({ title: text, items: z.array(text).min(1) }).strict(),
}).strict();

const proofResultsBlock = z.object({
  type: z.literal('proofResults'),
  ...sectionFields,
  eyebrow: text,
  title: text,
  intro: text.optional(),
  // Every proof tab of each listed case study, in this order.
  caseStudies: z.array(text).min(1),
  cta: link,
  footnote: text,
}).strict();

const brandStripFields = {
  label: text,
  // {count} is the number of brands shown.
  caption: text,
  // Brand names from config/brands; omit for all.
  brands: z.array(text).optional(),
};

const brandStripBlock = z.object({ type: z.literal('brandStrip'), ...sectionFields, ...brandStripFields }).strict();

const caseStudyCardsBlock = z.object({
  type: z.literal('caseStudyCards'),
  ...sectionFields,
  eyebrow: text,
  title: text,
  intro: text.optional(),
  brandStrip: z.object(brandStripFields).strict().optional(),
  listLabel: text,
  caseStudies: z.array(text).min(1),
}).strict();

const stepsBlock = z.object({
  type: z.literal('steps'),
  ...sectionFields,
  eyebrow: text,
  title: text,
  items: z.array(z.object({ label: text, title: text, body: text }).strict()).min(1),
}).strict();

const serviceGridBlock = z.object({
  type: z.literal('serviceGrid'),
  ...sectionFields,
  eyebrow: text,
  title: text,
  intro: text.optional(),
  items: z.array(z.object({ code: text.optional(), title: text, body: text, link: link.optional() }).strict()).min(1),
}).strict();

const faqBlock = z.object({
  type: z.literal('faq'),
  ...sectionFields,
  eyebrow: text,
  title: text,
  items: z.array(z.object({
    q: text,
    a: text.optional(),
    rows: z.array(z.object({ k: text, v: text }).strict()).optional(),
  }).strict().refine((f) => f.a || f.rows?.length, 'needs an answer (a) or rows')).min(1),
}).strict();

const ctaBandBlock = z.object({
  type: z.literal('ctaBand'),
  ...sectionFields,
  eyebrow: text,
  title: text,
  body: text.optional(),
  primaryCta: cta,
  // Secondary link straight to the Calendly page (CAL_LINK).
  calendlyCta: cta.optional(),
  notes: z.array(z.object({ k: text, v: text }).strict()).optional(),
}).strict();

export const block = z.discriminatedUnion('type', [
  heroBlock, statStripBlock, problemCardsBlock, engagementsBlock, fitBlock, proofResultsBlock,
  brandStripBlock, caseStudyCardsBlock, stepsBlock, serviceGridBlock, faqBlock, ctaBandBlock,
]);

export const page = z.object({
  slug: text,
  status,
  title: text.optional(),
  description: text.optional(),
  blocks: z.array(block).min(1),
}).strict();

export type Block = z.infer<typeof block>;
// Without strictNullChecks zod marks every key optional, so match on an optional `type`.
export type BlockOf<T extends Block['type']> = Extract<Block, { type?: T }>;
export type Page = z.infer<typeof page>;
