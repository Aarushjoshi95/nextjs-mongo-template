# Aarush · AI Search Visibility — PRD / state

## Product
Single-page lead-gen site for Aarush (GEO/AEO consultant). Next.js App Router + Tailwind + MongoDB.

## Built
- Single page (/app/app/page.js): hero + PromptDemo, proof strip, offers, fit check, brand wall + case studies (real Fueler data), how it works, reporting, FAQ, book section.
- Booking pop-up (components/site/BookingModal.js): BookingProvider in app/providers.js; BookButton opens Pepper-style form (first/last name, work email, company, country, code+phone, source, optional message, honeypot). Submits to POST /api/enquiries; success state links to Cal.com (CAL_LINK const).
- Brand wall (components/site/BrandWall.js): 12 brands (Traya, Kama Ayurveda, Forest Essentials, Spin, Zee Zest, QS Top Universities, Emeritus, Ramco, Nestlé, Scaler, Eureka Forbes, Schneider Electric). Logos via Google favicon service with monogram fallback (Spin, Zee Zest have no fetchable icon).
- API (app/api/[[...path]]/route.js): POST/GET /api/enquiries (Mongo collection `enquiries`, uuid ids). Backend tested 10/10.

## Pending / backlog
- Claude + ChatGPT live visibility checker (needs user's key decision).
- Email notification on enquiry (needs provider key).
- Real Cal.com link (currently https://cal.com/aarush placeholder).
- SEO: JSON-LD, sitemap, robots, llms.txt, OG images.
- Clean up orphaned /app/app/case-studies routes if unused.

## Update — tools, security & AI round
- Shipped /tools hub: AI Visibility Checker (live Gemini 2.5 Flash via Emergent key + Jev scoring), Revenue Impact Calculator (cluster-level), Traffic Drop Loss Calculator, CTR/Position Opportunity Calculator. INR default + USD toggle, share links, CSV, copy summary; calculators are client-side only.
- Hero PromptDemo now defaults to the live checker; before/after illustration kept as a tab.
- Security: admin-only GET /api/enquiries + /api/status (Bearer ADMIN_TOKEN in memory/test_credentials.md), 5/10min per-IP rate limit + 16KB cap on form POSTs, X-Frame-Options SAMEORIGIN / frame-ancestors 'self'.
- Jev enrichment on enquiries: leadScore/leadLabel, serviceIntent, industry, spam flag (stored as status 'spam', hidden from submitter).
- Env added: ADMIN_TOKEN, EMERGENT_LLM_KEY.
- Blocked on user: Razorpay keys + what is sold; ElevenLabs key + purpose; Perplexity key; file storage purpose; Spin logo; email alerts (user said leave open). Frontend testing agent not yet run (needs permission).

## Update — interactive "Proof, not just theory" section
- Rebuilt /app/components/site/ProofResults.js (client component, framer-motion) to match the user's reference video: 4 pill tabs (Traya Revenue, Traya Non-brand traffic, EdTech Revenue, EdTech Organic share), left stat panel with count-up metric + before/after boxes, right large SVG chart with grey pre-engagement line, "A" brand marker at kick-off (pulsing), blue growth line drawing in with gradient fill, data dots, hover/tap crosshair + tooltip, smart X-tick thinning on mobile.
- Uses site tokens only: bg rgb(var(--ink)), accent rgb(var(--accent)), Inter Tight / JetBrains Mono. Reduced-motion safe. Data series are deterministic (SSR-safe) shapes, not actuals (footnote states this).
- Verified via screenshots at 1920 and 390 widths. Section id stays #results; CTA links to #proof (case studies).
- Auto-rotate added: tabs advance every 6.5s once the section is in view; a thin progress bar runs under the active pill. Pauses on hover/focus inside the tabs+chart area and when the browser tab is hidden; stops permanently when a visitor clicks/keys a tab; small pause/play toggle at the end of the tab row (aria-pressed). Disabled under prefers-reduced-motion. Keyframe `proof-progress` added to globals.css.

## Update — Proof section re-themed + case-study carousel
- ProofResults now uses the site's light palette only (bg/surface/ink/accent/line tokens): white card-surface panels, ink active pill (btn-primary style), accent growth line + metric, ink "A" kick-off marker mirroring the header logo, inverse ink tooltip. Section uses overflow-clip (not hidden) so focusing a pill can never scroll the section.
- Tab strip is a 7-item carousel: prev/next arrows (sm+), swipe on mobile, 01/07 counter + dot indicators, active pill auto-centred. 3 new tabs from the uploaded case-study docs (Beauty blog clicks +158%, Luxury D2C non-brand +53%, Publisher Discover 164K clicks), each with a "Read the full case study" link to /case-studies/[slug]. Chart stretches to fill its card height.
- lib/content/caseStudies.js: beauty, luxury and Discover entries rewritten to match the user's 3 docx files exactly (titles, roles, durations, stats, context, pillars, actions, before/after tables, timelines, lessons). Homepage case cards (app/page.js `cases`) updated to the same numbers.

## Update — case-card carousel + real-data slots
- components/site/CaseStudyCarousel.js: homepage case-study cards are now a scroll-snap carousel (1 card mobile, 2 desktop), arrows step one card, dots + 01/05 counter, bounds-aware disabled states. page.js grid replaced with <CaseStudyCarousel cases={cases} />.
- lib/content/proofData.js: per-tab real-data slots (before/after arrays, optional labels + endLabel). ProofResults swaps shape curves for real series automatically, auto-scales Y ticks (niceTicks), shows real date labels on X-axis + tooltip, marks source "Actual figures" and adapts the footnote. All slots currently null — USER MUST PASTE FIGURES (they said they have data for Traya clicks, EdTech clicks, Beauty blog clicks, Luxury non-brand sessions, Publisher Discover clicks but did not provide numbers).
