# CLAUDE.md

Personal site for Aarush (aarushjoshi.in), an SEO / organic growth advisor. Next.js 15 App Router + Tailwind, plain JS, migrating to TypeScript gradually.

- **PLAN.md**: the phased restructure plan. Source of truth for what is being done and in which order.
- **ARCHITECTURE.md**: the current and target system. Read it before adding new files or folders.

## Commands

```
npm install          # npm locally; package-lock.json is committed
npm run dev          # http://localhost:3000, no heap cap
npm run dev:capped   # same with a 512 MB heap cap (Emergent container); OOMs locally on calculator pages
npm run build        # must pass before every PR
npm run start        # serve the production build
```

There are no tests, lint or typecheck yet (Phase 4/5 add them). Until then `npm run build` and a manual browser check are the gate.

**Never run `npm run build` while the dev server may be running.** Both write to `.next/`, so a build breaks the running dev server. Check first (e.g. a `next dev` process or port 3000 in use). If it is running, ask the user to stop it, or build into a separate folder instead.

### Package managers

npm is used locally. Emergent hosting may still install with yarn, so `package.json` keeps `packageManager` (yarn) and `resolutions`. `overrides` mirrors the same pins for npm. **Change a pin in both places.** Keep both until the hosting decision is made, then delete the unused one.

## Folder conventions

New code follows the **target** layout. Existing code moves there in the phase that touches it.

| What | Today | Target |
| --- | --- | --- |
| Site chrome (Header, Footer, AnnouncementBar) | `app/(site)/layout.tsx` (done) | same |
| Page routes | `app/(site)/<route>/page.js` | `app/(site)/<route>/page.tsx`, thin templates |
| Page sections | `components/site/*`, some inline in `app/page.js` | `components/sections/*` |
| UI primitives | `components/ui/dialog.jsx` | `components/ui/` (only what is used) |
| Calculators / tools UI | `components/tools/*` | same |
| Calculator maths | `lib/tools/calc.js` | `lib/calc/` |
| Case studies | `lib/content/caseStudies.js` | `content/case-studies/*.mdx` |
| Tools registry | `lib/content/tools.js` | `config/tools.ts` |
| Site facts, nav, socials | `config/site.ts`, `config/nav.ts` (done) | same |
| SEO / JSON-LD | `lib/seo.js` | `lib/seo.ts` |
| AI (Gemini, lead scoring) | `lib/ai.js`, `lib/jev.js` | `lib/ai/` |
| API | `app/api/[[...path]]/route.js` | `app/api/<endpoint>/route.ts` |
| Static assets | `public/` (`logos/`, `case-studies/<slug>/`) | same |

- Path alias: `@/` → repo root (`tsconfig.json`, `allowJs`). New files are `.ts`/`.tsx`; existing `.js` files convert when touched.
- Case-study images go in `public/case-studies/<slug>/` as `.webp`.
- Brand logos go in `public/logos/` as `.svg` (preferred) or `.png`.

## Code rules

- **One fact, one place.** Never hardcode a stat, positioning line, link or contact detail that already exists elsewhere. Import it, or move it to `config/` / `content/` first.
- **Server components by default.** Add `'use client'` only for real interactivity, and keep client islands small.
- **Booking CTAs** open the modal through `useBooking()` / `<BookButton>` from `components/site/BookingModal.js`. The Calendly URL is `CAL_LINK` there, so never hardcode it.
- **SEO:** every page exports `metadata`. JSON-LD is built with helpers in `lib/seo` and rendered with `components/site/JsonLd.js`. Breadcrumbs use `components/site/Breadcrumb.tsx`, which also emits the `BreadcrumbList` JSON-LD. New routes must be added to the sitemap (generated from content after Phase 3), except draft pages marked noindex.
- **Styling:** use the shared classes (`card-surface`, `eyebrow`, `btn-primary`) and the semantic Tailwind colours `paper` (page background), `surface`, `ink`, `muted`, `line`, `accent`, `positive`, with opacity modifiers where needed (`border-accent/30`). Never write `[rgb(var(--x))]` classes. Avoid inline styles and one-off sizes.
- **Fonts** load through `next/font` in `app/layout.js` (`--font-sans`, `--font-display`, `--font-mono`). Never use CSS `@import` for fonts.
- **Motion:** framer-motion only in ProofResults. Respect `prefers-reduced-motion`.
- **Accessibility:** keyboard reachable, visible focus, alt text on every meaningful image, AA contrast.
- **Dependencies:** don't add a package for something a few lines can do. Don't re-add shadcn primitives "just in case". Add only what a page uses.
- **No Emergent-only APIs in new code.** Existing AI calls stay in `lib/ai*` until Phase 4 isolates them.
- Keep `data-testid` attributes on interactive elements; future Playwright tests will use them.
- Match the surrounding code's style, naming and comment density.

## Working rules

- **One phase per session and per branch** (`phase-N-name`). Plan first, get approval, then edit.
- **Git base is `rebuild`.** Every phase branch is cut from `rebuild` and merges back into `rebuild`. PRs target `rebuild`.
- **`main` is off-limits.** Never check out, commit to, merge into, rebase or push `main`.
- **origin is the original `Aarushjoshi95/nextjs-mongo-template` repo, and Emergent deploys from `main`.** Anything that reaches `main` goes live, so keep all work on `rebuild` and its phase branches.
- Before each commit, check `localhost:3000` at phone (375px) and desktop widths.
- Run `npm run build` before each merge into `rebuild`.
- **Never commit secrets.** `.env*` stays local (gitignored). Rotate any token that reaches Git.
- Don't edit the site in Emergent while the restructure is in progress.
- Keep `.emergent/` until the hosting decision is made.
- Small, focused commits with clear messages. Don't mix phases.

## Environment

Server-only env vars (never expose to the client): `MONGO_URL`, `DB_NAME`, `EMERGENT_LLM_KEY`, `INTEGRATION_PROXY_URL`, `ADMIN_TOKEN`, `CORS_ORIGINS`. Without Mongo, the API routes return 500 locally. Pages still render.
