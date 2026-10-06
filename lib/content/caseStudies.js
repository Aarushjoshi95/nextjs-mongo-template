// Real case studies from Aarush's Fueler portfolio.
// Phase 1: typed data file. Will swap to MDX frontmatter in Phase 2.

export const caseStudies = [
  {
    slug: 'd2c-beauty-brand-157-percent-growth',
    title: '157% clicks growth in 3 months for India\u2019s leading beauty brand',
    client: 'India\u2019s Leading Beauty Brand (D2C)',
    industry: 'D2C',
    status: 'published',
    featured: true,
    order: 1,
    summary: 'A product-led SEO engine built around velocity metrics \u2014 content, technical and link \u2014 that moved clicks +157.94% and lifted qualified leads 25\u201380% in a single quarter.',
    role: 'SEO & Organic Growth Lead',
    duration: '3 months',
    scope: 'Content strategy, technical SEO, backlink acquisition, Search TAM analysis',
    stats: [
      { value: '+157.94%', label: 'Clicks (Q/Q)' },
      { value: '2.54\u00d7', label: 'Organic traffic (26k \u2192 66k/mo)' },
      { value: '+20%', label: 'CTR' },
      { value: '25\u201380%', label: 'Qualified leads lift' },
    ],
    context: [
      'The brand was already a household name with a solid foundation \u2014 DR 27, ~26,000 monthly organic visits, ~600 pages, ~7,000 ranking keywords and 390 referring domains. Respectable, but nowhere near its ceiling. The channel was being managed like a marketing checklist, not a product.',
      'The hard part: a competitive beauty SERP where every incumbent was shipping content weekly. Winning meant out-executing them on velocity without diluting quality \u2014 and tying every brief to a buyer-journey stage, not a keyword.',
    ],
    pillars: [
      { title: 'Content velocity', body: 'Match and beat the competitor publishing pace with intent-mapped briefs: ~20 new pages and ~15 refreshes per month, every month.' },
      { title: 'Technical velocity', body: 'A fast, bot-friendly stack with clean internal linking and schema \u2014 so every piece of content ships with its full authority intact.' },
      { title: 'Link velocity', body: 'High-authority backlinks earned through original statistic campaigns and resource assets, not scraped guest-post lists.' },
    ],
    actions: [
      'Mapped the full Search TAM for the beauty category and re-sequenced the content roadmap around buyer-journey intent.',
      'Re-optimised top-performing pages with fresh statistics, sharper hooks, concise answers and new internal links.',
      'Shipped ~20 new pages and ~15 refreshes per month, held strictly to the editorial scorecard.',
      'Fixed internal-linking bugs that were leaking authority to irrelevant templates.',
      'Added schema markup to the pages that most needed SERP real estate.',
      'Cleared crawl bottlenecks and template-level technical errors blocking Googlebot.',
      'Launched statistic-led PR campaigns to earn natural backlinks from high-authority editors.',
      'Built shareable resource pages that became backlink magnets.',
    ],
    chart: {
      title: 'Indexed organic clicks, month over month',
      note: 'Indexed to 100 at month 0 (pre-engagement baseline). Source: GSC.',
      series: [
        { x: 'M0', y: 100 }, { x: 'M1', y: 128 }, { x: 'M2', y: 189 }, { x: 'M3', y: 258 },
      ],
    },
    beforeAfter: [
      { metric: 'Organic traffic / month', before: '26,000', after: '66,000', delta: '+154%' },
      { metric: 'Domain Rating', before: '27', after: '36', delta: '+9' },
      { metric: 'Ranking keywords', before: '~7,000', after: '~17,000', delta: '+143%' },
      { metric: 'Referring domains', before: '390', after: '580', delta: '+49%' },
      { metric: 'Impressions', before: '100', after: '222', delta: '+121.94%' },
    ],
    timeline: [
      { phase: 'M0', period: 'Diagnose', detail: 'Search TAM audit, competitor velocity benchmark, kill-list for underperformers.' },
      { phase: 'M1', period: 'Rewire', detail: 'Internal linking rebuild, schema rollout, technical cleanups.' },
      { phase: 'M2', period: 'Ship', detail: 'Full-cadence editorial engine switched on \u2014 20 new + 15 refreshed.' },
      { phase: 'M3', period: 'Compound', detail: 'PR-led statistic campaigns, resource pages, backlink velocity acceleration.' },
    ],
    lessons: [
      'Treat SEO like a product. Marketing checklists get out-shipped by product teams every single quarter.',
      'Velocity is a strategy, not a vanity metric \u2014 but only when quality holds and intent is mapped.',
      'The best backlinks are byproducts of content people actually want to cite.',
    ],
    testimonial: null,
    publishedAt: '2023-08-01',
  },
  {
    slug: 'luxury-d2c-48-percent-growth-6-months',
    title: '48% traffic growth and 40% monthly revenue uplift for a luxury D2C brand',
    client: 'India\u2019s Leading Luxury D2C Brand',
    industry: 'D2C',
    status: 'published',
    featured: false,
    order: 2,
    summary: 'A PDP-first program that moved product pages from positions 30\u201340 to the top 5, added 45,000 monthly organic visits and lifted directly attributable revenue +40% month over month.',
    role: 'SEO Advisor',
    duration: '6 months',
    scope: 'PDP optimisation, pillar/hub-and-spoke, technical SEO, internal linking, backlink automation',
    stats: [
      { value: '+40%', label: 'Direct attributable revenue / mo' },
      { value: '+45,000', label: 'Added organic visits / mo' },
      { value: '350K \u2192 500K', label: 'Overall sessions' },
      { value: '260K \u2192 397K', label: 'Non-brand sessions' },
    ],
    context: [
      'A leading luxury D2C player wanted bottom-line ROI from organic \u2014 not more blog traffic. The brief was explicit: lift directly attributable revenue by 30% month over month by making Product Detail Pages (PDPs) and high-priority business pages carry their weight.',
      'The hard part: PDPs were stuck in positions 30\u201340 for their most commercial queries. Luxury buyers rarely scroll past page one. The entire gap between \u201ca nice SEO case\u201d and \u201ca revenue line item\u201d sat in those 25 positions.',
    ],
    pillars: [
      { title: 'Rank the money pages', body: 'Move PDPs from positions 30\u201340 to top 5 through keyword mapping, on-page SEO and intent-aligned content layers.' },
      { title: 'Pillar + hub-and-spoke', body: 'Build topical authority around each category with pillar content and interlinked spokes that funnel equity back to PDPs.' },
      { title: 'Fix the foundation', body: 'Cannibalisation, index bloat, sitemap hierarchy and log-file-driven crawl prioritisation \u2014 the invisible work that unblocks everything.' },
    ],
    actions: [
      'Mapped priority keywords to every PDP and ran template-level on-page optimisation.',
      'Added FAQs, user reviews and comparison tables to PDPs for intent coverage and SERP real estate.',
      'Built pillar content per category with contextual spokes targeting long-tail and related queries.',
      'Resolved cannibalisation by merging or redirecting duplicate product pages to consolidate ranking signals.',
      'Cut index bloat by ~20% via robots.txt and meta-directive updates \u2014 only valuable pages crawled.',
      'Reorganised the sitemap with proper hierarchy and categorisation for Googlebot context.',
      'Ran log-file analysis to prioritise crawl budget on high-value templates.',
      'Automated brand mention and backlink outreach, cutting manual effort ~40%.',
    ],
    chart: {
      title: 'Indexed non-brand organic sessions',
      note: 'Indexed to 100 at month 0. Source: GA + GSC.',
      series: [
        { x: 'M0', y: 100 }, { x: 'M1', y: 108 }, { x: 'M2', y: 118 },
        { x: 'M3', y: 128 }, { x: 'M4', y: 137 }, { x: 'M5', y: 145 }, { x: 'M6', y: 153 },
      ],
    },
    beforeAfter: [
      { metric: 'Overall sessions / month', before: '350,000', after: '500,000', delta: '+30%' },
      { metric: 'Non-brand sessions', before: '260,000', after: '397,000', delta: '+40%' },
      { metric: 'PDP ranking positions', before: '30\u201340', after: 'Top 5', delta: '\u221225\u201335 pos' },
      { metric: 'Direct attributable revenue', before: 'baseline', after: '+40% / mo', delta: '+40%' },
      { metric: 'Index bloat', before: 'baseline', after: '\u221220%', delta: '\u221220%' },
    ],
    timeline: [
      { phase: 'M0\u2013M1', period: 'Diagnose', detail: 'PDP ranking audit, cannibalisation map, log-file analysis.' },
      { phase: 'M2\u2013M3', period: 'Rewire', detail: 'Sitemap rebuild, index-bloat cleanup, PDP on-page overhaul.' },
      { phase: 'M4\u2013M5', period: 'Scale', detail: 'Hub-and-spoke rollout, internal-linking push to PDPs.' },
      { phase: 'M6', period: 'Automate', detail: 'Outreach + brand-mention automation, periodic internal-link audits.' },
    ],
    lessons: [
      'If a page cannot be named against a revenue line, it should not get a brief.',
      'Internal linking is a quota tool. Point link equity at the pages that pay the bills.',
      'Technical SEO wins look boring in a deck and move the business more than anything else.',
    ],
    testimonial: null,
    publishedAt: '2022-01-03',
  },
  {
    slug: 'news-media-108-percent-organic-growth',
    title: '108% organic growth for a US news media giant \u2014 250K to 1M+ monthly sessions',
    client: 'US News Media Giant',
    industry: 'Publishing',
    status: 'published',
    featured: false,
    order: 3,
    summary: 'A technical rebuild, taxonomy redesign and Discover-first editorial system that scaled sessions from 250K to 600K in 8 months and past 1M+ monthly thereafter.',
    role: 'SEO Lead',
    duration: '~12 months',
    scope: 'Technical SEO, migration, information architecture, Google News & Discover, automation',
    stats: [
      { value: '4\u00d7', label: 'Monthly sessions (250K \u2192 1M+)' },
      { value: '95%', label: 'Core Web Vitals score' },
      { value: '2M+', label: 'Sessions in Q1 after relaunch' },
      { value: '\u221240%', label: 'Manual reporting effort' },
    ],
    context: [
      'A leading US news media site needed to turn organic into a dependable traffic engine in a crowded, saturated market. The baseline was 250K monthly sessions \u2014 the ambition was category leadership.',
      'The hard part: news SEO is a daily game. Any technical regression, any taxonomy mistake, any lag in trend-spotting costs real traffic within hours. The system had to be fast, automated and editorially disciplined all at once.',
    ],
    pillars: [
      { title: 'Define the TAM, pick the clusters', body: 'Search TAM analysis to find under-served content clusters \u2014 then back only the themes where competitors had real gaps.' },
      { title: 'Fix the foundation', body: 'Music-industry schema, Core Web Vitals to 95%, redesigned taxonomy and contextual interlinking at scale.' },
      { title: 'Win Discover and News', body: 'Image SOPs, celebrity/trend frameworks and content-quantum recommendations tuned for the Discover and News feeds.' },
    ],
    actions: [
      'Ran a Search TAM analysis to find under-served clusters \u2014 music being the biggest opportunity.',
      'Rolled out industry-specific structured data to lift SERP visibility.',
      'Lifted Core Web Vitals to a 95% performance score across templates.',
      'Redesigned information architecture and taxonomy for contextual relevance.',
      'Led a seamless migration to a new tech stack with <10% transient ranking loss.',
      'Built automated dashboards for indexing and URL ranking insights.',
      'Shipped SOPs for celebrity-image optimisation and trend-driven editorial briefs.',
      'Launched an auto-weekly trending-topic suggestion system for editorial.',
    ],
    chart: {
      title: 'Indexed monthly organic sessions',
      note: 'Indexed to 100 at month 0 (= 250K monthly sessions).',
      series: [
        { x: 'M0', y: 100 }, { x: 'M2', y: 128 }, { x: 'M4', y: 162 },
        { x: 'M6', y: 208 }, { x: 'M8', y: 240 }, { x: 'M10', y: 320 }, { x: 'M12', y: 400 },
      ],
    },
    beforeAfter: [
      { metric: 'Monthly organic sessions', before: '250K', after: '1M+', delta: '+300%' },
      { metric: 'Monthly sessions at M8', before: '250K', after: '600K', delta: '+140%' },
      { metric: 'Core Web Vitals score', before: 'baseline', after: '95%', delta: '\u2191\u2191' },
      { metric: 'Evergreen contribution', before: 'baseline', after: '+30% sessions', delta: '+30%' },
      { metric: 'Manual reporting effort', before: 'baseline', after: '\u221240%', delta: '\u221240%' },
    ],
    timeline: [
      { phase: 'M0\u2013M2', period: 'Define', detail: 'Search TAM analysis, cluster prioritisation, taxonomy redesign.' },
      { phase: 'M3\u2013M5', period: 'Foundation', detail: 'Schema rollout, Core Web Vitals rebuild, interlinking at scale.' },
      { phase: 'M6\u2013M8', period: 'Migrate', detail: 'Platform migration with pre/post audits \u2014 ranking stability held.' },
      { phase: 'M9\u2013M12', period: 'Operate', detail: 'Discover SOPs, trend-detection system, reporting automation.' },
    ],
    lessons: [
      'In news SEO, your tooling is your editorial team\u2019s reflex. Automate ruthlessly or lose the day.',
      'Evergreen is not boring. It is the floor your trending traffic bounces off every month.',
      'A migration is only successful if the business cannot feel it in the numbers.',
    ],
    testimonial: null,
    publishedAt: '2021-11-11',
  },
  {
    slug: 'google-discover-1m-traffic-3-months',
    title: '1M+ Google Discover sessions in 3 months on a sub-DR-25 site',
    client: 'News Website (DR < 25)',
    industry: 'Publishing',
    status: 'published',
    featured: false,
    order: 4,
    summary: 'An AMP Web Stories + automation playbook that cracked Google Discover for a low-authority site \u2014 1M+ Discover sessions inside 90 days.',
    role: 'SEO Lead',
    duration: '3 months',
    scope: 'AMP Web Stories, Core Web Vitals, content automation, Discover optimisation',
    stats: [
      { value: '1M+', label: 'Discover sessions in 3 months' },
      { value: '<25', label: 'Starting Domain Rating' },
      { value: '100%', label: 'AMP-validated stories' },
      { value: '\u2191\u2191', label: 'Push + social engagement' },
    ],
    context: [
      'A news site with a Domain Rating under 25 wanted a disproportionate share of Google Discover. Most playbooks for Discover assume authority you don\u2019t have yet. This one assumed we had none.',
      'The hard part: Discover rewards a very particular mix of speed, structure and signal \u2014 and punishes anything that smells like scaled-but-thin content. The system had to be fast enough to compete and strict enough to keep quality in.',
    ],
    pillars: [
      { title: 'Make AMP Web Stories a channel', body: 'Lightweight AMP HTML, clean URL structure, proper metadata and canonicals \u2014 Discover-friendly from the first story.' },
      { title: 'Automate the production line', body: 'Trend tracking, AI-assisted ideation and visual tooling so output stays high without diluting signal.' },
      { title: 'Earn attention, keep it', body: 'Headline testing, push notifications and internal-link automation to compound every piece of Discover traffic.' },
    ],
    actions: [
      'Built AMP Web Stories on a lightweight AMP HTML framework and validated every single story.',
      'Standardised URL structure (/stories/story-title/) for clean indexing.',
      'Added schema.org metadata, Open Graph tags and Twitter Cards to make stories Discover-friendly.',
      'Hit Core Web Vitals targets with lazy loading, WebP media and reduced render-blocking resources.',
      'Automated a dynamic XML sitemap for AMP stories and submitted via Search Console.',
      'Set up Google Trends, BuzzSumo and Ahrefs flows for trend-spotting; AI tools for headline ideation.',
      'A/B tested headlines (CoSchedule) and automated social scheduling (Buffer) + push (OneSignal).',
      'Scaled internal linking with Link Whisper and automated analytics reporting via Data Studio.',
    ],
    chart: {
      title: 'Indexed Google Discover sessions',
      note: 'Indexed to 100 at week 0. Source: GSC Discover report.',
      series: [
        { x: 'W0', y: 100 }, { x: 'W2', y: 180 }, { x: 'W4', y: 320 },
        { x: 'W6', y: 540 }, { x: 'W8', y: 820 }, { x: 'W10', y: 1300 }, { x: 'W12', y: 1800 },
      ],
    },
    beforeAfter: [
      { metric: 'Discover sessions (90 days)', before: '~0', after: '1,000,000+', delta: '+1M' },
      { metric: 'Domain Rating required', before: 'High', after: '<25', delta: 'No gatekeeper' },
      { metric: 'AMP validation', before: 'ad-hoc', after: '100%', delta: 'standardised' },
    ],
    timeline: [
      { phase: 'W0\u2013W2', period: 'Foundation', detail: 'AMP framework, URL structure, metadata and schema baseline.' },
      { phase: 'W3\u2013W6', period: 'Automate', detail: 'Trend-spotting + AI ideation + visual pipeline.' },
      { phase: 'W7\u2013W12', period: 'Scale', detail: 'Headline testing, push + social loops, internal-linking automation.' },
    ],
    lessons: [
      'Discover does not care about your DR. It cares about speed, structure and signal.',
      'Automation is the only honest way to run a Discover program without burning out the team.',
      'Every story needs a canonical back to its home. If you forget this, you train Google to ignore you.',
    ],
    testimonial: null,
    publishedAt: '2022-03-31',
  },
  {
    slug: 'core-web-vitals-99-good-urls',
    title: '99.1% Good URLs on mobile \u2014 and a 5\u00d7 keyword lift to show for it',
    client: 'New Website (Technical SEO)',
    industry: 'Technical SEO',
    status: 'published',
    featured: false,
    order: 5,
    summary: 'A systematic Core Web Vitals + mobile usability rebuild that pushed Good URLs from ~60% to 99.1%, added 735,000 impressions and lifted ranking keywords from ~7,000 to 35,000+.',
    role: 'SEO Lead',
    duration: '~6 months',
    scope: 'Core Web Vitals, mobile usability, performance engineering',
    stats: [
      { value: '99.1%', label: 'Good URLs on mobile' },
      { value: '+735K', label: 'Impressions gained' },
      { value: '5\u00d7', label: 'Ranking keywords (7K \u2192 35K+)' },
      { value: '1M+', label: 'Discover pageviews in Q1' },
    ],
    context: [
      'A new site had mobile-first indexing working against it: Good URL percentage hovered near 60%, LCP/CLS/INP all failing on key templates, and mobile usability errors across the catalogue. Traffic was flat at 26,000 sessions a month.',
      'The hard part: Core Web Vitals is where SEO stops being marketing and starts being engineering. The win depended on getting the right fixes shipped by developers who had ten other priorities \u2014 so every ticket had to be justified by exact business impact.',
    ],
    pillars: [
      { title: 'Fix Core Web Vitals properly', body: 'LCP, CLS and INP addressed at the root \u2014 image pipeline, render-blocking resources, font-loading and JS execution.' },
      { title: 'Mobile usability without compromises', body: 'Viewport, touch targets, font legibility and spacing \u2014 the small things that make a site actually usable on a phone.' },
      { title: 'Instrument the recovery', body: 'GSC + PageSpeed Insights + Mobile-Friendly Test on a weekly audit cadence \u2014 catch regressions before they cost traffic.' },
    ],
    actions: [
      'Compressed and lazy-loaded images, migrated to WebP, cut LCP below 2.5s.',
      'Added width/height attributes to every image and iframe to eliminate CLS.',
      'Used font-display: swap and size-adjust to kill font-driven layout shifts.',
      'Minimised third-party scripts and deferred non-critical JavaScript to improve FID/INP.',
      'Fixed viewport meta, scaling and horizontal scroll on every template.',
      'Enlarged touch targets and spacing on all interactive elements; minimum 16px fonts.',
      'Minified HTML/CSS/JS and migrated to a high-performance HTTP/2 server.',
      'Set up a weekly audit cadence with GSC, PageSpeed Insights and the Mobile-Friendly Test.',
    ],
    chart: {
      title: 'Good URLs on mobile (% of indexed URLs)',
      note: 'Source: GSC Core Web Vitals report.',
      series: [
        { x: 'M0', y: 60 }, { x: 'M1', y: 68 }, { x: 'M2', y: 78 },
        { x: 'M3', y: 87 }, { x: 'M4', y: 93 }, { x: 'M5', y: 97 }, { x: 'M6', y: 99 },
      ],
    },
    beforeAfter: [
      { metric: 'Good URLs on mobile', before: '~60%', after: '99.1%', delta: '+39 pts' },
      { metric: 'Monthly traffic', before: '26,000', after: '150K+ / quarter', delta: '5.8\u00d7' },
      { metric: 'Ranking keywords', before: '~7,000', after: '35,000+', delta: '5\u00d7' },
      { metric: 'Google Discover pageviews', before: 'minimal', after: '1M+ in Q1', delta: '\u2191\u2191' },
      { metric: 'Domain Rating', before: '32', after: '37', delta: '+5' },
      { metric: 'Impressions gained', before: 'baseline', after: '+735,000', delta: '+735K' },
    ],
    timeline: [
      { phase: 'M0', period: 'Diagnose', detail: 'Full CWV audit, template-level bottleneck map, dev ticket pack.' },
      { phase: 'M1\u2013M2', period: 'Image + layout', detail: 'WebP pipeline, lazy loading, image dimensions, CLS fixes.' },
      { phase: 'M3\u2013M4', period: 'JS + fonts', detail: 'Defer non-critical JS, font-display: swap, HTTP/2 migration.' },
      { phase: 'M5\u2013M6', period: 'Instrument', detail: 'Weekly audits, regression alerts, mobile usability sweep.' },
    ],
    lessons: [
      'Core Web Vitals is engineering work. Treat it like a dev project, not an SEO task list.',
      'Every CWV fix needs a business case or it dies in standup. Bring the impact math.',
      'Instrumentation is the difference between a fix that holds and a fix that silently regresses.',
    ],
    testimonial: null,
    publishedAt: '2022-04-28',
  },
];

export function getCaseStudy(slug) {
  return caseStudies.find((c) => c.slug === slug);
}

export function getPublishedCaseStudies() {
  return caseStudies.filter((c) => c.status === 'published').sort((a, b) => a.order - b.order);
}

export function getPipelineCaseStudies() {
  return caseStudies.filter((c) => c.status === 'coming-next');
}

export function getFeaturedCaseStudy() {
  return caseStudies.find((c) => c.featured) || caseStudies[0];
}

export function getNextCaseStudy(slug) {
  const published = getPublishedCaseStudies();
  const idx = published.findIndex((c) => c.slug === slug);
  if (idx === -1) return null;
  return published[(idx + 1) % published.length];
}
