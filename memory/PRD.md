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
