// Real case studies from Aarush's Fueler portfolio.
// Phase 1: typed data file. Will swap to MDX frontmatter in Phase 2.

export const caseStudies = [
  {
    slug: 'd2c-beauty-brand-157-percent-growth',
    title: '157% blog clicks growth for India\u2019s leading beauty brand',
    client: 'India\u2019s Leading Beauty Brand (D2C)',
    industry: 'D2C',
    status: 'published',
    featured: true,
    order: 1,
    summary: 'A product-led SEO engine built on three velocity metrics (content, technical and link) took blog clicks from 78.7K to 203K quarter over quarter. That is +157.94%, and it lifted leads 25\u201380% in a single quarter.',
    role: 'SEO & Organic Growth Lead',
    duration: '6 months',
    scope: 'Content strategy, technical SEO, backlink acquisition, Search TAM analysis',
    stats: [
      { value: '+157.94%', label: 'Blog clicks (78.7K \u2192 203K, Q/Q)' },
      { value: '2.54\u00d7', label: 'Organic traffic (26K \u2192 66K/mo)' },
      { value: '+121.94%', label: 'Impressions (7.84M \u2192 17.4M)' },
      { value: '25\u201380%', label: 'Leads lift' },
    ],
    context: [
      'The brand was already a household name with a solid foundation, but organic was nowhere near its ceiling. Starting point: Domain Rating 27, ~26,000 organic visits a month, ~600 pages, ~7,000 ranking keywords and 390 referring domains.',
      'The channel was being run like a marketing checklist, not a product. The hard part was the SERP: beauty is a competitive category where every incumbent ships content weekly. Winning meant out-executing them on velocity without diluting quality, and tying every brief to a buyer-journey stage rather than a keyword.',
    ],
    pillars: [
      { title: 'Content velocity', body: 'Run the channel as a product. Map the industry Search TAM, re-sequence the roadmap around buyer-journey intent and ship ~20 new pages plus ~15 refreshes a month.' },
      { title: 'Technical velocity', body: 'Fix internal-linking bugs that dilute authority, add schema to high-value pages and clear the template-level errors blocking Googlebot.' },
      { title: 'Link velocity', body: 'Monitor competitor link velocity and out-earn it with statistic blogs, PR campaigns and shareable guides that attract natural backlinks.' },
    ],
    actions: [
      'Mapped the industry Search TAM to separate top performers from underperformers, then re-sequenced the content roadmap around buyer-journey intent.',
      'Re-optimised existing pages with fresh statistics, sharper copy and hooks, concise answers, better internal links and clearer CTAs.',
      'Shipped ~20 new pages and ~15 refreshes per month, each new page built for a specific buyer-journey stage.',
      'Fixed internal-linking bugs where irrelevant mapping was diluting page authority.',
      'Added schema markup to high-value pages to win more SERP real estate and clicks.',
      'Cleared technical bottlenecks and template-level errors blocking Googlebot.',
      'Monitored the link velocity of direct and indirect competitors to stay ahead of both.',
      'Published internal statistic blogs and PR campaigns that earned natural backlinks from high-authority editors and publication houses.',
      'Built shareable guides and resource pages that became backlink magnets.',
    ],
    chart: {
      title: 'Blog clicks, in thousands (GSC, /blogs/)',
      note: 'Google Search Console, /blogs/ section, last 3 months vs previous 3 months. Clicks 78.7K \u2192 203K while CTR (1.0% \u2192 1.2%) and average position (17.1 \u2192 13.4) both improved.',
      series: [
        { x: 'Prev Q', y: 78.7 }, { x: 'M1', y: 42 }, { x: 'M2', y: 68 }, { x: 'M3', y: 93 }, { x: 'Current Q', y: 203 },
      ],
    },
    beforeAfter: [
      { metric: 'Clicks (GSC, /blogs/, per quarter)', before: '78.7K', after: '203K', delta: '+157.94%' },
      { metric: 'Impressions (GSC, /blogs/, per quarter)', before: '7.84M', after: '17.4M', delta: '+121.94%' },
      { metric: 'CTR (GSC, /blogs/)', before: '1.0%', after: '1.2%', delta: '+20%' },
      { metric: 'Avg. position (GSC, /blogs/)', before: '17.1', after: '13.4', delta: '3.7 places higher' },
      { metric: 'Organic traffic (Ahrefs est., sitewide / month)', before: '26,000', after: '66,000', delta: '+154%' },
      { metric: 'Domain Rating', before: '27', after: '36', delta: '+9' },
      { metric: 'Ranking keywords', before: '~7,000', after: '~17,000', delta: '+143%' },
      { metric: 'Referring domains', before: '390', after: '580', delta: '+49%' },
      { metric: 'Pages', before: '~600', after: '~760', delta: '+27%' },
    ],
    timeline: [
      { phase: 'M0\u2013M1', period: 'Diagnose', detail: 'Search TAM map, competitor velocity benchmark, roadmap re-sequenced around buyer-journey stages.' },
      { phase: 'M2', period: 'Rewire', detail: 'Internal-linking fixes, schema on high-value pages, template errors cleared for Googlebot.' },
      { phase: 'M3\u2013M4', period: 'Ship', detail: 'Editorial engine at full cadence: ~20 new pages and ~15 refreshes a month.' },
      { phase: 'M5\u2013M6', period: 'Compound', detail: 'Statistic blogs, PR campaigns and resource pages feed the link engine; blog clicks +157.94% Q/Q.' },
    ],
    lessons: [
      'Treat SEO like a product. Marketing checklists get out-shipped by product teams every single quarter.',
      'Velocity is a strategy, not a vanity metric \u2014 but only when quality holds and intent is mapped.',
      'The best backlinks are byproducts of content people actually want to cite.',
    ],
    evidence: [
      { kind: 'gsc', src: '/case-studies/d2c-beauty-brand-157-percent-growth/gsc-performance.webp', alt: 'Google Search Console performance report for the /blogs/ section comparing the last 3 months with the previous 3 months', caption: 'GSC performance, /blogs/ section, 3-month compare', note: 'Clicks 78.7K → 203K, impressions 7.84M → 17.4M' },
      { kind: 'chart', src: '/case-studies/d2c-beauty-brand-157-percent-growth/gsc-before-after.webp', alt: 'Before and after bars for clicks, impressions, CTR and average position from Search Console', caption: 'Clicks grew faster than impressions', note: 'CTR 1.0% → 1.2%, average position 17.1 → 13.4' },
      { kind: 'chart', src: '/case-studies/d2c-beauty-brand-157-percent-growth/quarter-metrics.webp', alt: 'Horizontal bar chart of percentage change across core metrics over the 3-month engagement', caption: 'Every core metric grew in one quarter', note: 'Blog clicks +157.9%, organic traffic +153.8%, ranking keywords +142.9%' },
      { kind: 'chart', src: '/case-studies/d2c-beauty-brand-157-percent-growth/authority-footprint.webp', alt: 'Before and after bars for organic traffic, ranking keywords, referring domains and Domain Rating', caption: 'Authority and footprint grew alongside the content engine', note: 'DR 27 → 36, referring domains 390 → 580' },
    ],
    testimonial: null,
    publishedAt: '2023-08-01',
  },
  {
    slug: 'luxury-d2c-48-percent-growth-6-months',
    title: '48% organic growth in 6 months for India\u2019s leading luxury D2C brand',
    client: 'India\u2019s Leading Luxury D2C Brand',
    industry: 'D2C',
    status: 'published',
    featured: false,
    order: 2,
    summary: 'A revenue-first SEO program moved product and category pages from positions 30\u201340 into the top 5. Sessions grew from 350K to 500K, and direct attributable revenue rose 30% a month. In a single 28-day window, money pages added ~48K clicks.',
    role: 'SEO & Organic Growth Lead',
    duration: '6 months',
    scope: 'PDP and category SEO, hub-and-spoke content, technical SEO, internal linking, link automation',
    stats: [
      { value: '+43%', label: 'Sessions (350K \u2192 500K)' },
      { value: '+53%', label: 'Non-brand traffic (260K \u2192 397K)' },
      { value: '+30%/mo', label: 'Direct attributable revenue' },
      { value: '~48K', label: 'Extra money-page clicks in 28 days (GSC)' },
    ],
    context: [
      'The brand had strong demand and a popular blog, but the pages that make money were buried on pages 3\u20134 of Google. Starting point: ~350K organic sessions a month, ~260K non-brand, key product pages ranking in positions 30\u201340, and a revenue goal of +30% direct attributable revenue per month.',
      'Traffic was concentrated in top-of-funnel blogs, while product and category pages carried little search weight. Duplicate product pages split ranking signals, index bloat wasted crawl budget, and blog authority wasn\u2019t flowing to the pages that convert. The brief was clear: grow the bottom line, not just sessions.',
    ],
    pillars: [
      { title: 'Money-page velocity', body: 'Every lever pointed at one number, direct attributable revenue, so the program ranked pages that sell rather than pages that inform.' },
      { title: 'Authority architecture', body: 'Blogs became authority donors. Their job shifted from winning clicks to passing equity and intent to the product pages via pillar content and intent-matched internal links.' },
      { title: 'Technical foundation', body: 'Consolidate duplicates, cut index bloat and rebuild the sitemap so every ranking gain on money pages stuck instead of leaking.' },
    ],
    actions: [
      'Mapped priority keywords to every PDP, then optimised metadata, structured data and page speed.',
      'Matched each page to searcher intent with detailed FAQs, user reviews and comparison charts.',
      'Ran a search demand gap analysis and launched new product pages for emerging trends and seasonal demand.',
      'Built pillar content for each main product category, with spoke articles targeting long-tail and related queries.',
      'Linked high-performing top- and middle-funnel blogs to PDPs with intent-matched anchor text, and set up periodic internal-linking audits.',
      'Automated discovery and outreach for brand mentions, and secured backlinks from industry-relevant sites and publications.',
      'Merged or redirected duplicate product pages to consolidate ranking signals and end cannibalization.',
      'Cut index bloat with robots.txt and meta directives, so only valuable pages get crawled.',
      'Rebuilt the sitemap hierarchy and used log-file analysis to prioritise high-value pages for indexing.',
    ],
    chart: {
      title: 'Clicks on the top 4 money pages, in thousands (GSC)',
      note: 'Google Search Console, top pages, last 28 days vs previous 28 days (Jan 2022). Four money pages added 48,237 clicks while the top blogs dipped 3,469. Site held ~10K clicks a day (869K clicks, 35.3M impressions, Oct\u2013Dec 2021).',
      series: [
        { x: 'Prev 28d', y: 2.8 }, { x: 'Wk 1', y: 9 }, { x: 'Wk 2', y: 19 }, { x: 'Wk 3', y: 33 }, { x: 'Last 28d', y: 51 },
      ],
    },
    beforeAfter: [
      { metric: 'Organic sessions / month', before: '350K', after: '500K', delta: '+43%' },
      { metric: 'Non-brand traffic / month', before: '260K', after: '397K', delta: '+53%' },
      { metric: 'Clicks, top 4 money pages (GSC, 28 days)', before: '2,776', after: '51,013', delta: '+48,237' },
      { metric: 'Product-page rankings', before: 'Positions 30\u201340', after: 'Top 5', delta: 'Page 3\u20134 to page 1' },
      { metric: 'Product-page organic traffic', before: 'baseline', after: '+45%', delta: '+45%' },
      { metric: 'Direct attributable revenue', before: 'baseline', after: '+30% per month', delta: '+30%/mo' },
      { metric: 'Index bloat', before: 'baseline', after: '\u221220%', delta: '\u221220%' },
      { metric: 'Manual link-building + trend effort', before: 'baseline', after: '\u221240%', delta: '\u221240%' },
    ],
    timeline: [
      { phase: 'M0\u2013M1', period: 'Foundation', detail: 'Duplicate PDPs merged or redirected, index bloat cut, sitemap hierarchy rebuilt, log-file analysis.' },
      { phase: 'M2\u2013M3', period: 'Money pages', detail: 'Keyword-to-PDP mapping, metadata, structured data, speed, FAQs, reviews and comparison charts.' },
      { phase: 'M4\u2013M5', period: 'Authority', detail: 'Pillar + spoke content per category, intent-matched internal links from blogs to PDPs.' },
      { phase: 'M6', period: 'Automate', detail: 'Brand-mention discovery and outreach automated; manual effort down 40%. All-time-high revenue.' },
    ],
    lessons: [
      'Rank the pages that sell. Traffic that never reaches a product page is a vanity metric.',
      'Blogs are authority donors. Their job is to pass equity and intent to the PDP, not to hoard clicks.',
      'Fix the foundation before you scale. Cannibalized, bloated sites leak every gain you earn.',
    ],
    evidence: [
      { kind: 'gsc', src: '/case-studies/luxury-d2c-48-percent-growth-6-months/gsc-performance.webp', alt: 'Google Search Console performance report showing 869K clicks and 35.3M impressions over three months', caption: 'GSC performance, Oct–Dec 2021', note: '869K clicks, 35.3M impressions, ~10K clicks a day' },
      { kind: 'gsc', src: '/case-studies/luxury-d2c-48-percent-growth-6-months/gsc-pages.webp', alt: 'Google Search Console top pages report with client URLs blurred', caption: 'GSC top pages, 28-day compare', note: 'Money pages gaining while top blogs held flat' },
      { kind: 'chart', src: '/case-studies/luxury-d2c-48-percent-growth-6-months/money-pages-28-days.webp', alt: 'Bar chart of click change per top page over 28 days, money pages up and blogs flat', caption: 'Money pages added ~48K clicks in 28 days', note: 'Blue = money pages (+48,237). Grey = top blogs (−3,469)' },
      { kind: 'chart', src: '/case-studies/luxury-d2c-48-percent-growth-6-months/growth-non-brand.webp', alt: 'Before and after bars for organic sessions, non-brand traffic and clicks to the top 4 money pages', caption: 'Growth came from non-brand demand and money pages', note: 'Sessions 350K → 500K, non-brand 260K → 397K, money-page clicks 2.8K → 51K' },
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
    title: '2.2M Google Discover impressions in 3 months for a lifestyle publisher (DR < 25)',
    client: 'A Leading Indian Lifestyle Publisher',
    industry: 'Publishing',
    status: 'published',
    featured: false,
    order: 4,
    summary: 'A lifestyle publisher with a Domain Rating under 25 broke into Google Discover with AMP Web Stories, an automated trend-led content engine and a technical stack built for speed. In three months, its top 10 Discover articles earned 2.2M impressions and 164K clicks.',
    role: 'SEO & Organic Growth Lead',
    duration: '3 months (Discover push), within a 15-month SEO program',
    scope: 'Google Discover, AMP Web Stories, content automation, technical SEO, distribution',
    stats: [
      { value: '2.2M', label: 'Discover impressions, top 10 articles (3 months)' },
      { value: '164K', label: 'Discover clicks, top 10 articles (3 months)' },
      { value: '+414%', label: 'Quarterly search impressions (Q1\u201922 \u2192 Q1\u201923)' },
      { value: '5.2\u00d7', label: 'Keywords in Google\u2019s top 10 (242 \u2192 1,248)' },
    ],
    context: [
      'The publisher had a respected brand but a young website. Domain Rating under 25, 4.7M search impressions and 146K clicks a quarter (Q1 2022), 242 keywords in the top 10 worth ~88K monthly searches, 35 in the top 3, and 0% of mobile URLs with a good page experience. It competed for attention against the biggest international lifestyle magazines.',
      'Authority-driven rankings would take years to build. Google Discover doesn\u2019t rank on links, though. It rewards fresh, visual, fast-loading content that matches what readers care about right now. That made Discover the fastest lever a low-DR site could pull, as long as the content engine and the technical stack could keep up.',
    ],
    pillars: [
      { title: 'Discover-ready formats', body: 'AMP Web Stories with clean URLs, schema, Open Graph and canonicals back to the main page, fed automatically into a dynamic sitemap.' },
      { title: 'Automated content engine', body: 'Trend tracking turned into briefs in minutes; a pillar\u2013cluster\u2013trending model shipped 552 articles in nine months with ~30 topics ideated a week.' },
      { title: 'Technical speed and distribution', body: 'Mobile pages from 0% to 99.1% good page experience, then every story pushed through social, push notifications and scaled internal links.' },
    ],
    actions: [
      'Built AMP Web Stories with the Google Web Stories plugin and MakeStories, and validated every story against the AMP framework.',
      'Gave each story clean, crawlable URLs (/stories/story-title/), schema.org metadata, Open Graph tags and Twitter Cards.',
      'Used WebP images, MP4 video and ALT text, and set canonical tags back to the non-AMP versions so SEO credit stayed on the main page.',
      'Fed stories automatically into a dynamic XML sitemap, tracked them through AMP analytics, and added lightweight AMP ads as a second revenue stream.',
      'Tracked trends with the Google Trends API, BuzzSumo and Ahrefs, then used AI tools to turn them into briefs within minutes.',
      'Ran a pillar\u2013cluster\u2013trending model: 552 articles shipped between Jul 2022 and Mar 2023 (421 cluster, 110 pillar, 21 trending).',
      'A/B tested headlines with CoSchedule, leaning on proven triggers such as \u201cHow to\u201d, \u201cBest\u201d and \u201cWhy\u201d, and paired every story with high-impact visuals.',
      'Took mobile pages from 0% to 99.1% good page experience: TinyPNG compression, WP Rocket caching, Lighthouse CI on every release, Schema Pro, HTTPS everywhere.',
      'Promoted every story through Buffer-scheduled social posts and OneSignal push notifications.',
      'Scaled internal links with Link Whisper, A/B tested placements with Google Optimize, refreshed winning articles and automated reporting in Data Studio.',
    ],
    chart: {
      title: 'Search impressions per quarter, in millions (GSC)',
      note: 'Google Search Console. Quarterly impressions grew from 4.7M (Q1 2022) to 24.3M (Q1 2023), +414%. Over the 3-month Discover push, the top 10 articles earned 2.2M impressions and 164K clicks; five articles carried 80% of those clicks.',
      series: [
        { x: 'Q1\u201922', y: 4.7 }, { x: 'Q2\u201922', y: 7.9 }, { x: 'Q3\u201922', y: 12.6 }, { x: 'Q4\u201922', y: 18.4 }, { x: 'Q1\u201923', y: 24.3 },
      ],
    },
    beforeAfter: [
      { metric: 'Discover impressions, top 10 articles', before: '\u2014', after: '2.2M (3 months)', delta: 'New channel' },
      { metric: 'Discover clicks, top 10 articles', before: '\u2014', after: '164K (3 months)', delta: 'New channel' },
      { metric: 'Search impressions per quarter', before: '4.7M (Q1\u201922)', after: '24.3M (Q1\u201923)', delta: '+414%' },
      { metric: 'Search clicks per quarter', before: '146K (Q1\u201922)', after: '300K (Q1\u201923)', delta: '+106%' },
      { metric: 'Keywords in top 10', before: '242 (Dec\u201921)', after: '1,248 (Feb\u201923)', delta: '5.2\u00d7' },
      { metric: 'Keywords in top 3', before: '35 (Dec\u201921)', after: '236 (Feb\u201923)', delta: '6.7\u00d7' },
      { metric: 'Search potential of top-10 keywords', before: '~88K/mo', after: '~899K/mo', delta: '~10\u00d7' },
      { metric: 'Mobile URLs with good page experience', before: '0%', after: '99.1%', delta: '+99 pts' },
    ],
    timeline: [
      { phase: 'M1', period: 'Speed', detail: 'Page experience from 0% to 99.1% good mobile URLs; AMP Web Stories framework, URLs, schema and sitemap live.' },
      { phase: 'M2', period: 'Volume', detail: 'Trend engine on: ~30 topics a week, pillar\u2013cluster\u2013trending briefs, headline testing, push + social distribution.' },
      { phase: 'M3', period: 'Amplify', detail: 'Winners refreshed and clustered; top 10 Discover articles at 2.2M impressions and 164K clicks.' },
      { phase: 'M4\u2013M15', period: 'Compound', detail: 'Same machine lifts classic search: quarterly impressions +414%, top-10 keywords 5.2\u00d7, outranking international magazines head-to-head.' },
    ],
    lessons: [
      'Discover doesn\u2019t care about your DR. It cares whether readers want this, right now, and whether the page loads instantly.',
      'Automate the pipeline, not the judgment. Machines spot the trend; editors pick the angle.',
      'A few winners carry the feed. Find them fast, refresh them, and build clusters around them.',
    ],
    evidence: [
      { kind: 'gsc', src: '/case-studies/google-discover-1m-traffic-3-months/gsc-discover-performance.webp', alt: 'Google Search Console Discover performance report with client identifiers blurred', caption: 'GSC Discover performance, 3 months', note: '2.2M impressions, 164K clicks across the top 10 articles' },
      { kind: 'gsc', src: '/case-studies/google-discover-1m-traffic-3-months/gsc-discover-pages.webp', alt: 'Google Search Console Discover pages report with URLs blurred and click counts highlighted', caption: 'GSC Discover pages report', note: 'Five articles carried 80% of top-10 clicks' },
      { kind: 'gsc', src: '/case-studies/google-discover-1m-traffic-3-months/gsc-page-experience.webp', alt: 'Google Search Console page experience report showing 99.1% good URLs on mobile', caption: 'GSC page experience, mobile', note: '0% → 99.1% good URLs' },
      { kind: 'chart', src: '/case-studies/google-discover-1m-traffic-3-months/search-impressions-quarterly.webp', alt: 'Quarterly bars of search impressions and clicks from Q1 2022 to Q1 2023', caption: 'Search grew alongside Discover', note: 'Impressions 4.7M → 24.3M (+414%), clicks 146K → 300K (+106%)' },
      { kind: 'chart', src: '/case-studies/google-discover-1m-traffic-3-months/five-articles.webp', alt: 'Horizontal bar chart of Discover clicks per article for the top 10 articles', caption: 'Five articles drove 80% of top-10 Discover clicks', note: 'Top 5 = 132,183 clicks of 164,362' },
      { kind: 'chart', src: '/case-studies/google-discover-1m-traffic-3-months/keywords-top10.webp', alt: 'Line chart of keywords ranking in the top 3, top 10 and top 20 from Dec 2021 to Feb 2023', caption: 'Keywords in Google’s top 10 grew 5× in 14 months', note: 'Top 10: 242 → 1,248. Top 3: 35 → 236' },
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
