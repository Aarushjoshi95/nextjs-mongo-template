# Architecture — aarushjoshi.in

How the site is built today, the structure it is moving to, and the rules that hold both together.
The phased to-do list lives in [PLAN.md](PLAN.md); this file describes the system itself.

## Goals and constraints

- **Grow to 100 pages at most** without each new page costing more than the last. New case studies, articles, service pages and tools are content files or registry entries, not new code.
- **One source of truth.** Every fact (positioning, headline stats, case-study numbers, nav, contact) is defined once and read everywhere else.
- **High polish, enforced by checks.** One type/spacing scale, a documented component set, and CI gates (build, lint, types, content, links, a11y, Lighthouse, screenshots).
- **Fast and accessible.** Lighthouse 95+ per template, LCP < 2.0 s on mobile, WCAG 2.2 AA.
- **No over-engineering.** No headless CMS, monorepo, microservices or custom component library. MDX in Git is enough at 100 pages.
- **Keep current features:** booking modal + Calendly, enquiry capture, AI visibility checker, four calculators, case-study template, JSON-LD.

## Current system

| Layer | Today |
| --- | --- |
| Framework | Next.js 15.5 App Router, React 18, plain JavaScript, `output: 'standalone'` |
| Styling | Tailwind 3.4 + `app/globals.css`: RGB colour tokens mapped to Tailwind colours (`paper`, `surface`, `ink`, `muted`, `line`, `accent`, `positive`) and custom classes (`card-surface`, `eyebrow`, `btn-primary`) |
| Fonts | Inter, Inter Tight (headings), JetBrains Mono (numerals) |
| Hosting | Emergent cloud container (`.emergent/`), behind Cloudflare |
| API | One catch-all `app/api/[[...path]]/route.js`: enquiries, visibility check, admin reads |
| Data | MongoDB: `enquiries`, `visibility_checks` |
| AI | Gemini 2.5 Flash + "Jev" lead scoring via Emergent's proxy (`EMERGENT_LLM_KEY`) in `lib/ai.js`, `lib/jev.js` |
| Content | `content/case-studies/*.mdx` and `content/pages/home.mdx` (YAML frontmatter, validated with zod schemas in `lib/schema.ts` through `lib/content.ts`); `config/site.ts`, `config/nav.ts`, `config/tools.ts`, `config/brands.ts` |
| SEO | `lib/seo.js` JSON-LD builders, `app/sitemap.ts` and `app/llms.txt/route.ts` generated from content, `app/robots.js`, per-page `metadata` |

**Routes:** `/`, `/case-studies`, `/case-studies/[slug]` (published and coming-soon), `/tools`, four `/tools/*` pages, `/privacy`, `/terms`, `/api/*`, `sitemap.xml`, `robots.txt`, `llms.txt`.

**Homepage:** `app/(site)/page.tsx` renders the block list in `content/pages/home.mdx` through `components/sections/Blocks.tsx`. Client islands (ProofResults, case-study carousel, brand wall, FAQ accordion, PromptDemo) get their data as props from server blocks.

**Rendering model:** pages are server components under `app/(site)/`, whose layout renders AnnouncementBar (when `site.announcement` is set), Header, `<main>` and Footer once. Interactivity lives in client islands (ProofResults, BookingModal, PromptDemo, carousels, FAQ, Header). The root layout wraps everything in `BookingProvider` so any CTA can open the booking modal.

**Config:** `config/site.ts` (name, positioning, description, headline stats, contact, socials, Calendly URL) and `config/nav.ts` (header, footer and legal links) feed metadata, JSON-LD, hero, header and footer.

**Content check:** `npm run content:check` (also run as `prebuild` and `prebuild:isolated`) loads everything through `lib/content.ts`. It fails on schema errors, unknown block types, unresolved case-study / brand / logo / `{token}` / internal-link references, non-empty MDX bodies, and `[PLACEHOLDER]` text in published content or `config/`. Coming-soon items need only `slug`, `title` and `status`.

### Known structural debt

- The case-study page template, tools pages and `lib/seo.js` are not yet on TypeScript; `components/sections/ProofResultsIsland.js` stays JS (about 900 lines of chart code).
- The case-study page's Outcome paragraph is template copy shared by every case study.
- AI features and hosting are coupled to Emergent.

## Target system

**Stack:** Next.js App Router + Tailwind (unchanged), plus TypeScript (gradual), MDX for long-form content, a content schema check, `next/font` and `next/og`.

**Principle:** content lives in files, pages are thin templates, and every fact is defined once. Pages, nav, sitemap, llms.txt, JSON-LD and OG images are all generated from the same content.

```
app/
  (site)/layout.tsx          Header + Footer once, for every page
  (site)/page.tsx            homepage: composes sections, no copy inline
  (site)/case-studies/[slug]/
  (site)/insights/[slug]/    articles, same pattern
  (site)/services/[slug]/    service pages
  (site)/consulting/page.tsx     consulting hub, generated from content/consulting
  (site)/consulting/[slug]/      consulting landing pages, one template
  (site)/tools/
  (site)/privacy, terms/
  api/enquiries/route.ts     one file per endpoint
  api/visibility/route.ts
  sitemap.ts, robots.ts, llms.txt/route.ts, opengraph-image.tsx
content/
  case-studies/*.mdx         frontmatter = stats, client, SEO fields
  consulting/*.mdx           ordered block list per consulting page (see below)
  pages/home.mdx             homepage block list
  insights/*.mdx
  services/*.mdx
config/
  site.ts                    name, positioning, headline stats, contact, socials
  nav.ts                     header + footer links: Services · Consulting · Case studies · Free tools · FAQ
  tools.ts                   tools registry
  redirects                  renamed URLs never 404
components/
  ui/                        only primitives in use (today: dialog)
  sections/                  shared blocks: one component per block type (below)
  tools/                     interactive calculators (client)
lib/
  content.ts                 load + validate MDX and block lists; build fails on errors
  seo.ts                     metadata + JSON-LD from config and frontmatter
  ai/                        provider-agnostic Gemini + lead scoring
  calc/                      calculator maths, separate from UI
```

### Data flow

```
content/*.mdx ─┐
config/*.ts  ──┼─> lib/content.ts (validate) ─┬─> pages (thin templates)
               │                              ├─> sitemap.ts, llms.txt route
               │                              ├─> lib/seo.ts → metadata + JSON-LD
               │                              └─> opengraph-image.tsx
```

Nothing downstream holds its own copy of a fact.

### Page types

| Page type | Route | Content file | Built from |
| --- | --- | --- | --- |
| Homepage | `/` | `content/pages/home.mdx` | block list |
| Consulting hub | `/consulting` | `content/consulting/*.mdx` | generated listing |
| Consulting landing (about 10) | `/consulting/[slug]` | `content/consulting/<slug>.mdx` | block list |
| Case study (5) | `/case-studies/[slug]` | `content/case-studies/<slug>.mdx` | case-study template |
| Service | `/services/[slug]` | `content/services/*.mdx` | Phase 4; may reuse blocks |
| Tool | `/tools/*` | registry entry + component | tools template |

Consulting pages and the homepage count towards the 100-page ceiling.

### Consulting landing pages and blocks

A consulting page is one file, `content/consulting/<slug>.mdx`. Its frontmatter holds the SEO fields and an ordered `blocks` list. The template renders the blocks top to bottom in that order. There is no free-form body in v1: all copy sits in frontmatter, so the content check can validate it.

The homepage works the same way: `content/pages/home.mdx` lists its blocks, and `app/(site)/page.tsx` renders them.

**Block library** (`components/sections/`, one component per type, props validated in `lib/content.ts`):

| Block (`type`) | Content it takes |
| --- | --- |
| `hero` | eyebrow, headline, subhead, primary CTA, optional proof card that points to a case-study slug |
| `statStrip` | none; renders the headline stats from `config/site` |
| `brandStrip` | label, caption (`{count}`), optional brand names from `config/brands.ts` (logos in `public/logos/`) |
| `comparisonTable` | column headers and rows |
| `problemCards` | title and body, repeated |
| `serviceGrid` | title, body, optional internal link, repeated |
| `caseStudyCards` | list of published case-study slugs (card numbers come from each file's `card`), optional brand strip |
| `proofResults` | case-study slugs; renders every `proof` tab in those files, in order (interactive chart island) |
| `engagements` | name, duration, what is included, repeated |
| `deliverableTable` | deliverable, format, timing |
| `steps` | ordered title and body |
| `fit` | "good fit" and "not a fit" lists |
| `faq` | question and answer pairs; also feeds `FAQPage` JSON-LD |
| `relatedConsulting` | slugs of other consulting pages |
| `ctaBand` | headline and button; opens the booking modal through `BookButton` |

Rules:

- **Reference, don't copy.** Case-study numbers come from the case-study file via its slug. Booking goes through `BookButton` and `CAL_LINK`. Contact details come from `config/site.ts`.
- **Blocks are data-driven.** Blocks render props only and hold no copy. Only `faq` (accordion) and `ctaBand` (modal) need client code; keep those islands small.
- **Validation fails the build** on: an unknown block type, a missing required field, an unresolved slug or logo, or `[PLACEHOLDER]` text anywhere in `content/` or `config/`. The check is case-sensitive and exact.
- **Hub** `/consulting` lists the consulting files from content. Nothing is hand-maintained.
- **Metadata and JSON-LD** come from frontmatter through `lib/seo.ts`: `Service` on each landing page, `FAQPage` when a `faq` block is present, `BreadcrumbList` on every page. Each page gets one `h1` from its hero.

### Design system

- Colour tokens become real Tailwind colours (`text-ink`, `bg-surface`, `border-line`, `text-accent`), not arbitrary values.
- Type, spacing, radius and motion scales are defined in `tailwind.config`; no one-off sizes.
- A `/styleguide` route (noindex) renders every section and component in every state. It is the reference for screenshot tests and for building new pages.
- framer-motion is used only by ProofResults; other motion uses CSS.

### Backend

- One route file per endpoint. Validation, rate limiting and admin auth are shared helpers.
- MongoDB stays for now. AI calls go through `lib/ai/`, so moving off Emergent touches only `lib/ai` and the two API routes.

### Scaling to 100 pages

Listing pages per content type with tags, related-content links from shared tags, and a `redirects` map. After Phase 4, a new case study, article or service page is one MDX file. A new tool is one registry entry plus its component.

## Quality gates (target)

Every PR runs build, lint, typecheck, content validation and a broken-link check. Playwright screenshots at 375 / 768 / 1440 px plus an axe scan. Lighthouse CI budgets: 95+ performance and accessibility, LCP < 2.0 s, a JS size limit per page type.

## Open decisions

1. **Hosting:** stay on Emergent, or move to Vercel / Cloudflare Pages (needs own Gemini key and MongoDB Atlas). Until decided, `.emergent/`, yarn metadata in `package.json` and the Emergent AI proxy stay.
2. **Positioning line:** "Get recommended when buyers ask AI" for now; it lives only in `config/site.ts`.
3. **Repo visibility:** public or private.
4. **Page mix:** rough split of case studies, articles, service pages, consulting pages and tools within the 100.
5. **Services vs consulting:** what belongs on `/services` and what belongs on `/consulting`. Until `/services` exists, the nav's Services item points to a homepage anchor.
