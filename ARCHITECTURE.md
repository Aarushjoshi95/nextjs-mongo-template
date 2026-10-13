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
| Styling | Tailwind 3.4 + `app/globals.css`: RGB colour tokens (`--ink`, `--line`, `--accent`…) and custom classes (`card-surface`, `eyebrow`, `btn-primary`) |
| Fonts | Inter, Inter Tight (headings), JetBrains Mono (numerals) |
| Hosting | Emergent cloud container (`.emergent/`), behind Cloudflare |
| API | One catch-all `app/api/[[...path]]/route.js`: enquiries, visibility check, admin reads |
| Data | MongoDB: `enquiries`, `visibility_checks` |
| AI | Gemini 2.5 Flash + "Jev" lead scoring via Emergent's proxy (`EMERGENT_LLM_KEY`) in `lib/ai.js`, `lib/jev.js` |
| Content | JS objects in `lib/content/` (case studies, tools registry, proof data) plus copy hardcoded in pages/components |
| SEO | `lib/seo.js` JSON-LD builders, `app/sitemap.js`, `app/robots.js`, `public/llms.txt`, per-page `metadata` |

**Routes:** `/`, `/case-studies`, `/case-studies/[slug]`, `/tools`, four `/tools/*` pages, `/api/*`, `sitemap.xml`, `robots.txt`.

**Rendering model:** pages are server components. Interactivity lives in client islands (ProofResults, BookingModal, PromptDemo, carousels, FAQ, Header). The root layout wraps everything in `BookingProvider` so any CTA can open the booking modal.

### Known structural debt

- No shared site layout: each page imports Header, Footer and AnnouncementBar itself.
- Content is scattered across page files, components, `lib/content/*`, `lib/seo.js` and `public/llms.txt`, so figures drift.
- Tailwind maps colours as `hsl(var(--x))` while tokens hold RGB, so code uses arbitrary `[rgb(var(--x))]` classes.
- `sitemap` and `llms.txt` are maintained by hand.
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
  (site)/tools/
  (site)/privacy, terms/
  api/enquiries/route.ts     one file per endpoint
  api/visibility/route.ts
  sitemap.ts, robots.ts, llms.txt/route.ts, opengraph-image.tsx
content/
  case-studies/*.mdx         frontmatter = stats, client, SEO fields
  insights/*.mdx
  services/*.mdx
config/
  site.ts                    name, positioning, headline stats, contact, socials
  nav.ts                     header + footer links
  tools.ts                   tools registry
  redirects                  renamed URLs never 404
components/
  ui/                        only primitives in use (today: dialog)
  sections/                  Hero, StatStrip, FAQ, CTA, BrandWall, Proof…
  tools/                     interactive calculators (client)
lib/
  content.ts                 load + validate MDX; build fails on missing fields
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
2. **Positioning line:** "Get recommended when buyers ask AI" vs "SEO that reports to revenue, not rankings".
3. **Repo visibility:** public or private.
4. **Page mix:** rough split of case studies, articles, service pages and tools within the 100.
