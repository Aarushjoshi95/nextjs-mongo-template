# aarushjoshi.in — Architecture Analysis & Rebuild Plan

Source of truth for the restructure. Work one phase at a time, one branch per phase, merged back into `rebuild`.

## Summary

**Keep the stack, fix the skeleton.** The site is a Next.js 15 App Router app with Tailwind, generated on the Emergent vibe-coding platform from its `nextjs-mongo-template`. It is roughly 5,700 lines of hand-written code across 13 routes, and the foundations are sound: real routes, a shared case-study template, a tools registry, server-rendered pages with client islands, and working SEO plumbing.

The problems are structural, not framework-level:

- **Content lives in four places:** page files, components, `lib/content/*` and `lib/seo.js`. Facts like positioning and headline stats have already drifted between them.
- **There is no shared layout.** Every page imports Header and Footer itself, and the nav is a constant inside `Header.js`.
- **The design tokens are wired wrong.** Tailwind maps colours as `hsl(...)`, but the variables hold RGB values, which forces 330+ one-off `rgb(var(--x))` classes.
- **The template baggage is heavy.** There are 48 shadcn components (1 used), about 20 unused npm packages, MongoDB, Python test scripts, and a dependency on Emergent's AI proxy key.
- **One urgent security issue:** the admin token that protects lead data is committed to this public repo (see Issues).

The plan is to stay on Next.js and do one focused restructure in six phases of roughly 1–2 days each. The result is a site that grows to its 100-page ceiling by adding content files rather than writing code, with polish enforced by automated quality checks rather than by eye.

## Requirements

The target is a high-polish site whose skeleton can grow to **100 pages at most** without each new page costing more effort than the last.

| Requirement | What it means in practice |
| --- | --- |
| Scalable to 100 pages | New case studies, service pages, articles and tools are added as content files or registry entries; listing, tag and related-content pages build themselves |
| Maintainable | One source of truth for site facts, nav and SEO; shared layout; clear folder conventions any developer or AI tool can follow |
| High fidelity and polish | One type and spacing scale, a documented component set, consistent motion, pixel-checked at phone, tablet and desktop widths, no broken links or placeholder states |
| Quality enforced, not hoped for | Every pull request must pass build, lint, type and content checks, link checking, accessibility, Lighthouse budgets and screenshot comparison before merge |
| Fast | Lighthouse 95+ on every template; LCP under 2.0 s on mobile; optimised images; a JavaScript budget per page type |
| Accessible | WCAG 2.2 AA: keyboard paths, focus states, contrast, reduced motion, alt text |
| Efficient effort | Restructure what exists rather than rebuild; small phased PRs; the site stays live throughout |
| No over-engineering | No headless CMS, monorepo, microservices or custom component library; MDX in Git still works at 100 pages |
| Keep current features | Booking modal + Calendly, enquiry capture, AI visibility checker, four calculators, case-study template, JSON-LD |
| SEO / GEO-grade output | Static pages, per-page metadata and schema, sitemap, llms.txt, OG images and redirects generated from content |

## Current structure

Repo: Aarushjoshi95/nextjs-mongo-template. Plain JavaScript (no TypeScript), 144 files.

| Layer | What is there now |
| --- | --- |
| Framework | Next.js 15.5 App Router, React 18, `output: 'standalone'` |
| Styling | Tailwind 3.4 + `globals.css` (275 lines) with RGB colour tokens and custom classes (`card-surface`, `eyebrow`, `btn-primary`) |
| Hosting | Emergent cloud container (`.emergent/emergent.yml`), behind Cloudflare |
| Backend | One catch-all route `app/api/[[...path]]/route.js` (324 lines): enquiries, visibility check, admin reads, template `status` endpoints |
| Data | MongoDB: `enquiries`, `visibility_checks`, `status_checks` collections |
| AI | Gemini 2.5 Flash + "Jev" lead scoring, both via Emergent's integration proxy and `EMERGENT_LLM_KEY` |
| Content | JS objects in `lib/content/` (case studies 390 lines, tools registry, proof data) plus copy hardcoded in pages and components |
| SEO | `lib/seo.js` JSON-LD builders, `app/sitemap.js`, `app/robots.js`, `public/llms.txt`, per-page `metadata` |

**Routes (13):** `/`, `/case-studies`, `/case-studies/[slug]` (5 static pages from one template), `/tools`, four `/tools/*` pages, `/api/*`, `sitemap.xml`, `robots.txt`.

**Components:**

- `components/site/` — 17 site sections (Header, Footer, FAQ, BrandWall, ProofResults, BookingModal…)
- `components/tools/` — the four calculators, a shared `ToolShell` and tool UI
- `components/ui/` — 48 shadcn primitives from the template; only `dialog` is used

**Rendering:** `app/page.js` is a server component with sections inline (310 lines). Interactivity sits in client islands: ProofResults (913 lines, framer-motion), BookingModal, PromptDemo, carousels, FAQ and Header. Extra client JS comes from those islands plus a global React Query + Booking provider wrapping every page.

## Issues found

**Fix first, independently of the plan:** `backend_ai_test.py` and `security_test.py` hardcode the `ADMIN_TOKEN`, and this repo is public. That token unlocks `GET /api/enquiries` (lead names, emails, phones). Rotate the token in hosting, delete it from the scripts, and consider making the repo private.

| Area | Issue | Impact at 100 pages |
| --- | --- | --- |
| Layout | No shared site chrome: each page imports Header, Footer and AnnouncementBar itself | Every new page re-wires chrome; easy to miss one |
| Nav and links | Nav is a constant in `Header.js`; footer links typed separately; Privacy/Terms point to `#`, LinkedIn to `linkedin.com` | Nav changes in two or more places; dead links multiply |
| Content | Homepage `cases`, `offers` and stats live in `app/page.js`; the same case numbers also live in `lib/content/caseStudies.js`, `ProofResults.js` and `llms.txt` | Figures drift; one update needs four edits |
| Positioning drift | Title says "AI recommended", OG says "SEO that reports to revenue", schema lists BFSI + media, layout says fintech | Mixed signals to Google, AI engines and link previews |
| Hand-maintained SEO files | `sitemap.js` and `llms.txt` are edited by hand; no OG image | New pages silently missed |
| Styling | Tailwind maps colours as `hsl(var(--x))` but tokens are RGB, so shadcn colour classes are broken and code uses `text-[rgb(var(--ink))]` everywhere; 40+ inline styles | Every new section repeats arbitrary values; restyling is find-and-replace |
| Template baggage | 47 unused UI components; ~20 unused packages (axios, swr, zod, react-hook-form, date-fns, dayjs, lodash, embla…); `status` endpoints; Python tests; Emergent files | Slower installs and builds; confusing for any new contributor |
| Platform lock-in | AI features call Emergent's proxy with `EMERGENT_LLM_KEY`; hosting is an Emergent container | Leaving Emergent breaks the checker and lead scoring |
| Backend shape | One 324-line catch-all API file; every request opens Mongo even for 404s; in-memory rate limit; CORS `*` on every page | Hard to extend; minor security and cost noise |
| Fonts and JS | Google Fonts via CSS `@import`; React Query provider wraps the whole site for one use | Slower first paint; extra JS on every page |
| Windows dev | `npm run dev` uses Unix-only `NODE_OPTIONS='…'` syntax; no lockfile committed, so Next.js picks up a stray lockfile outside the repo | Dev breaks on Windows; workspace-root warning |
| Deploy drift | `public/llms.txt` exists in the repo but returns 404 live | Live site may not match `main`; deploy process unclear |

No tests, linting or TypeScript are in place.

## Target architecture

**Stack decision: stay on Next.js App Router + Tailwind, add TypeScript and MDX.**

| Keep | Add | Remove |
| --- | --- | --- |
| Next.js 15, Tailwind, lucide, framer-motion (ProofResults only), recharts, Radix dialog | TypeScript (gradual), MDX for long-form content, a content schema check, `next/font`, `next/og` OG images | 47 unused UI components, ~20 unused packages, `status` endpoints, Python tests, React Query provider |

One principle: **content lives in files, pages are thin templates, and every fact is defined once.** Pages, nav, sitemap, llms.txt, JSON-LD and OG images are all generated from the same content.

```
app/
  (site)/layout.tsx          Header + Footer once, for every page
  (site)/page.tsx            homepage: composes sections, no copy inline
  (site)/case-studies/[slug]/
  (site)/insights/[slug]/    future articles, same pattern
  (site)/services/[slug]/    future service pages
  (site)/consulting/         hub + /consulting/[slug], about 10 landing pages (ARCHITECTURE.md)
  (site)/tools/
  (site)/privacy, terms/
  api/enquiries/route.ts     one file per endpoint
  api/visibility/route.ts
  sitemap.ts, robots.ts, llms.txt/route.ts, opengraph-image.tsx
content/
  case-studies/*.mdx         frontmatter = stats, client, SEO fields
  consulting/*.mdx           ordered block list per consulting page
  pages/home.mdx             homepage block list
  insights/*.mdx
  services/*.mdx
config/
  site.ts                    name, positioning, headline stats, contact, socials
  nav.ts                     Services · Consulting · Case studies · Free tools · FAQ
  tools.ts                   tools registry (exists today)
components/
  ui/                        only primitives in use
  sections/                  shared blocks: hero, brandStrip, comparisonTable, problemCards, serviceGrid, caseStudyCards, engagements, deliverableTable, steps, fit, faq, relatedConsulting, ctaBand
  tools/                     the interactive calculators (client)
lib/
  content.ts                 load + validate MDX, fail the build on missing fields
  seo.ts                     metadata + JSON-LD from config and frontmatter
  ai/                        provider-agnostic Gemini + lead scoring
  calc/                      calculator maths, separate from UI
```

Design tokens move into `tailwind.config` as real colours, so components write `text-ink`, `bg-surface`, `border-line` instead of arbitrary values. MongoDB stays for now. If AI and DB move off Emergent later, the change is isolated to `lib/ai` and the two API routes.

**At 100 pages** the structure holds as is. Add listing pages per content type with tags, related-content links generated from shared tags, and a `redirects` map in config so renamed URLs never 404.

**For polish**, add a `/styleguide` route (noindex) that renders every section and component in every state. It is the reference for screenshot tests and for anyone building a new page.

## Phased plan

Six phases, each on its own branch cut from `rebuild` and merged back into it; the live site keeps working after every merge to `main`.

**Phase 0 — Secure and set up (half a day)**

- [ ] Rotate `ADMIN_TOKEN` in hosting; remove it from the Python scripts; decide public vs private repo
- [ ] Confirm how the site deploys from `main` and why live lags the repo
- [ ] Add `ARCHITECTURE.md` + a short `CLAUDE.md` with the target structure and conventions

**Phase 1 — Clean out the template (half a day)**

- [ ] Delete unused `components/ui/*`, unused packages, `status` endpoints, Python tests, `test_result.md`, `memory/`, `.emergent/` (confirm hosting first)
- [ ] Remove the global React Query provider; keep BookingProvider
- [ ] Swap the CSS `@import` fonts for `next/font`
- [ ] Make `npm run dev` work on Windows (cross-platform script); commit `package-lock.json`; set the workspace root in `next.config` to silence the stray-lockfile warning
- [ ] Run `npm audit` after the clean-up and fix what remains

**Phase 2 — Shared layout, config and tokens (1–2 days)**

- [x] Create `config/site.ts` and `config/nav.ts`; pick one positioning line and use it in metadata, schema, hero and footer
- [x] Move Header, Footer and AnnouncementBar into a `(site)` route-group layout; strip them from every page
- [x] Fix Tailwind colour mapping to RGB tokens; replace `[rgb(var(--x))]` classes with semantic ones
- [x] Add real Privacy and Terms pages, real LinkedIn, consistent contact email (pages are drafts: noindex, out of the sitemap until approved)
- [x] Set the nav in `config/nav.ts` to Services · Consulting · Case studies · Free tools · FAQ, with footer links read from the same file. Services → `/#offers`, FAQ → `/#faq`; Consulting is `hidden` until Phase 4

**Phase 3 — Content as files (1–2 days)**

- [x] Convert the five case studies to `content/case-studies/*.mdx` with validated frontmatter; add `status: published | coming-soon` (Traya and K-12 EdTech are coming-soon pages: noindex, out of the sitemap, badged in listings)
- [x] Make homepage cards, ProofResults anchors and `llms.txt` read from the same case-study data (`card` and `proof` frontmatter)
- [x] Build the shared block library in `components/sections/*`: hero (with proof card), statStrip, brandStrip, problemCards, serviceGrid, caseStudyCards, engagements, steps, fit, faq, proofResults, ctaBand. Each block takes props only and holds no copy. comparisonTable, deliverableTable and relatedConsulting move to Phase 4 with the consulting pages that need them
- [x] Move homepage copy (offers, FAQ, how-it-works) into `content/pages/home.mdx` as a block list; `app/(site)/page.tsx` renders those blocks and holds no copy. `ProofResults` and the visibility checker stay client islands inside their blocks
- [x] Content check in `lib/content.ts`, run as `prebuild` / `prebuild:isolated` (`npm run content:check`): validates frontmatter, block types and required fields; resolves case-study, brand, logo, `{token}` and internal-link references; fails the build on any `[PLACEHOLDER]` text in `content/` (published items) or `config/` (exact, case-sensitive match)
- [x] Generate `sitemap.ts` and `llms.txt` from content, not by hand
- [x] Route dead internal links: CTABand's `/hire-me` now opens the booking modal; the announcement bar links to the Traya coming-soon page

**Phase 4 — Scale-ready extras (1–2 days)**

- [ ] Consulting template: `/consulting` hub and `/consulting/[slug]` rendering the ordered block list from `content/consulting/*.mdx` (about 10 pages). Metadata, JSON-LD, sitemap and llms.txt come from the same files
- [ ] Add `insights/` and `services/` templates so new page types are just new MDX files
- [ ] Listing pages with tags, related-content links and a `redirects` map
- [ ] OG images via `next/og` from frontmatter; per-type JSON-LD from `lib/seo.ts`
- [ ] Split the catch-all API into `api/enquiries` and `api/visibility`; move AI calls behind `lib/ai`
- [ ] Convert files to TypeScript as they are touched; add ESLint + a build check on each PR

**Phase 5 — Polish and quality gates (2–3 days, then ongoing)**

- [ ] Define the type, spacing, radius and motion scales in the Tailwind config; remove remaining one-off sizes
- [ ] Build `/styleguide` showing every block and component in every state; fix inconsistencies it exposes
- [ ] Redesign the tool UIs (four calculators, `ToolShell`, AI visibility checker) to the new design system: tokens, shared classes and semantic colours only
- [ ] Turn on Next.js image optimisation (currently disabled) and set image sizes per slot
- [ ] Design proper 404, error and loading states, favicon set and OG templates
- [ ] GitHub Actions on every PR: build, lint, typecheck, content validation, broken-link check
- [ ] Playwright screenshot tests of each template (homepage, consulting hub and a landing page, case study, tool) at 375, 768 and 1440 px, plus an axe accessibility scan
- [ ] Lighthouse CI budgets: 95+ performance and accessibility, LCP under 2.0 s, JS size limit per page type
- [ ] Copy pass: one voice, consistent numbers, sentence case, no placeholder text

After Phase 4, adding a case study, article, service page or consulting page is one MDX file. Adding a tool is one registry entry plus its component.

## Working rules

- One phase per session and per branch (`phase-N-name`); plan first, then edit.
- Git base is `rebuild`: each phase branches off `rebuild` and merges back into it. PRs target `rebuild`.
- origin is the original `Aarushjoshi95/nextjs-mongo-template` repo, which Emergent deploys from `main`.
- `main` is off-limits: never check out, commit to, merge into, rebase or push `main`.
- Check `localhost:3000` at phone and desktop widths before each commit; run `npm run build` before each merge into `rebuild`.
- Do not edit the site in Emergent while this plan is in progress.
- Never commit secrets; `.env.local` stays local.

## Open questions

1. **Hosting:** stay on Emergent, or move to Vercel / Cloudflare Pages (preview URLs per PR, no lock-in; needs own Gemini key and MongoDB Atlas)?
2. **Who edits content?** Developers only → MDX in Git is enough.
3. **Positioning:** "Get recommended when buyers ask AI" chosen for now (Phase 2); may change, and lives only in `config/site.ts`.
4. **Repo visibility:** public or private?
5. **What the 100 pages are:** rough split of case studies, articles, service pages and tools.
6. **Lead alerts:** Resend key and inbox still pending.
7. **Services vs consulting:** what goes on `/services` and what goes on `/consulting`. Until `/services` exists, the Services nav item points to a homepage anchor.
