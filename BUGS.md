# BUGS.md

Open bugs and launch items from the functional QA sweep (headless Playwright, localhost:3000 vs https://aarushjoshi.in, 1440px and 375px). Sessions read this at the start. Move an item out when it ships.

## fixes-1 (next session, one batch)

- [ ] **Carousel dots 4–5 (desktop).** The desktop view shows 2 cards, so scroll caps early and both dots land on card 5; the counter jumps 03 → 05. Derive the dots from reachable positions. Broken on live too. (`components/sections/CaseStudyCarousel.tsx`)
- [ ] **Calculator inputs accept out-of-range values** (e.g. CVR 150% gives a blended CVR of 89.76% and ₹53.8 crore/month). Clamp in the input handler/calc, including values restored from share links (`?s=`). Confirmed on Revenue Impact; CTR stores the unclamped value in its share link; Traffic Drop outputs not checked. Broken on live too. (`components/tools/*`, `lib/tools/calc.js`)
- [ ] **CTR calculator keyword-name inputs have no accessible label** (5 inputs, `kw-name-N`). Add `aria-label`. Broken on live too.
- [ ] **Coming-soon cards on `/case-studies` restart numbering at 01.** Drop the numbers on coming-soon cards.
- [ ] **`/case-studies` category filters do nothing** (All, Edtech, D2C, SaaS, Technical SEO, GEO). Re-tested: clicking each leaves the card count unchanged (7 locally, 5 on live). The chips are `<button>` elements with no handler or state (`app/(site)/case-studies/page.tsx`, "Filter chips"), so broken on live too. The first sweep missed them because the crawler skipped untyped buttons as submit buttons. Make them filter by tags, with an empty state for filters with no matches.

## Phase 5 (polish)

- [ ] Calculator tables: add a per-row remove button (Revenue Impact clusters, CTR keywords; add-only today).
- [ ] Mobile tables scroll sideways inside their wrapper with no visual cue (case-study results tables, the three calculators).
- [ ] Redesign tool UIs to the new design system.

## Phase 4

- [ ] Footer "Work" links (AI Visibility Audit, GEO Programme, Growth Advisory) all point to `/#offers`; point them at real pages once they exist (`config/nav.ts`).

## Launch checklist (live-site issues the rebuild fixes or must verify)

- [ ] `/hire-me` 404, Traya link 404, `/privacy` and `/terms` 404 on live: all fixed in the rebuild. Verify after cut-over.
- [ ] About 25 case-study screenshots 404 on live (d2c, luxury, Discover pages). Verify `public/case-studies/` ships with the deploy.
- [ ] Live deploy appears out of sync with the repo. Confirm how Emergent deploys before cut-over.

## Open questions for Aarush

- Traya figure: 7.4× sessions or 21× non-brand traffic?
- Confirm contact email and LinkedIn URL.
- Review the coming-soon copy (Traya, K-12 EdTech) and the draft Privacy/Terms.
- Is "Services" its own set of pages, or the homepage offers section?
- Rotate `ADMIN_TOKEN` in Emergent (it is in public git history).
- Full write-ups for Traya and K-12 EdTech.

## Expected, not bugs

- AI checker and enquiry API fail locally without a database.
- The Next.js "N" dev badge.
- LinkedIn returns 999 to bots.
