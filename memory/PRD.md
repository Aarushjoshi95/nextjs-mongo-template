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
