// Phase 1: typed data file. Same shape will swap to MDX frontmatter in Phase 2.

export const caseStudies = [
  {
    slug: 'traya-organic-zero-to-revenue',
    title: 'Building organic acquisition from zero at Traya',
    client: 'Traya Health',
    industry: 'D2C',
    status: 'published',
    featured: true,
    order: 1,
    summary: 'From a flat organic baseline to a compounding revenue channel with D0/D+ attribution wired into every content decision.',
    role: 'Organic Growth Lead',
    duration: '18 months',
    scope: 'Strategy, technical SEO, editorial, attribution',
    stats: [
      { value: '7.4×', label: 'Organic sessions' },
      { value: '3.1×', label: 'Non-brand revenue' },
      { value: '41%', label: 'Share of new customers' },
      { value: '₹', label: 'D0 revenue attribution live' },
    ],
    context: [
      'Traya was scaling fast on paid, but organic was treated as a traffic channel — blog posts, keyword volume, no accountability to pipeline. The brief: make organic a revenue line item on the P&L.',
      'The hard part: hair-loss is a cautious, high-intent category with long consideration windows. Vanity metrics would have been easy to grow and useless to defend.',
    ],
    pillars: [
      { title: 'Diagnose like a CFO', body: 'Audit every page by revenue influence, not sessions. Kill what distracts, double on what converts.' },
      { title: 'Build the system', body: 'Technical foundation, editorial cadence and conversion scaffolding that compounds week over week.' },
      { title: 'Tie it to revenue', body: 'D0 and D+30 attribution plumbed into GA4 and the warehouse so every brief carried a revenue hypothesis.' },
    ],
    actions: [
      'Rebuilt the IA around three intent clusters: diagnostic, comparative, protocol.',
      'Shipped 60+ programmatic pages for symptom × cause × solution combinations.',
      'Fixed crawl budget leaks — 400k parameter URLs collapsed to 1.8k canonicals.',
      'Introduced quiz-to-content bridges so informational traffic entered the funnel on page 1.',
      'Set a weekly editorial scorecard tied to assisted revenue, not word count.',
      'Wired D0 and D+30 revenue back to landing URL in the warehouse.',
      'Negotiated 40+ expert backlinks via original clinical reviews.',
      'Automated weekly cannibalisation and decay reports with n8n + GSC.',
    ],
    chart: {
      title: 'Indexed organic sessions, month over month',
      note: 'Indexed to 100 at month 0. Source: GSC + GA4.',
      series: [
        { x: 'M0', y: 100 }, { x: 'M2', y: 118 }, { x: 'M4', y: 142 },
        { x: 'M6', y: 189 }, { x: 'M8', y: 247 }, { x: 'M10', y: 318 },
        { x: 'M12', y: 412 }, { x: 'M14', y: 520 }, { x: 'M16', y: 641 },
        { x: 'M18', y: 742 },
      ],
    },
    beforeAfter: [
      { metric: 'Non-brand organic sessions', before: '100', after: '742', delta: '+642%' },
      { metric: 'Pages ranking top 10', before: '38', after: '614', delta: '+1515%' },
      { metric: 'Share of new customers from organic', before: '9%', after: '41%', delta: '+32 pts' },
      { metric: 'Avg. revenue per organic session', before: '₹4.1', after: '₹17.8', delta: '+334%' },
    ],
    timeline: [
      { phase: 'M0–M2', period: 'Diagnose', detail: 'Revenue-weighted audit, crawl collapse, attribution plumbing.' },
      { phase: 'M3–M8', period: 'Build', detail: 'IA rebuild, programmatic launches, editorial engine.' },
      { phase: 'M9–M14', period: 'Compound', detail: 'Expert backlinks, decay recovery, conversion scaffolding.' },
      { phase: 'M15–M18', period: 'Operate', detail: 'Automation stack, weekly P&L reporting cadence.' },
    ],
    lessons: [
      'If a page cannot answer “whose quota does this help?”, it should not exist.',
      'Attribution plumbing beats a bigger content budget. Always.',
      'Programmatic without editorial quality is just a crawl trap in a nice outfit.',
    ],
    testimonial: {
      quote: 'Aarush rewired how our leadership thought about organic. It stopped being a traffic conversation and became a revenue one.',
      name: 'Growth Director',
      role: 'D2C health brand',
    },
  },
  {
    slug: 'edtech-organic-charter',
    title: 'An edtech organic charter from zero',
    client: 'Edtech (anonymised)',
    industry: 'Edtech',
    status: 'published',
    featured: false,
    order: 2,
    summary: 'A Pareto-first playbook that turned a cold organic footprint into the lowest-CAC acquisition channel inside two quarters.',
    role: 'Advisor',
    duration: '6 months',
    scope: 'Strategy, prioritisation, conversion content',
    stats: [
      { value: '4.6×', label: 'Qualified leads from organic' },
      { value: '−42%', label: 'Blended CAC' },
      { value: '12', label: 'Flagship pages shipped' },
      { value: '#1', label: 'For 3 category queries' },
    ],
    context: [
      'A late-stage edtech wanted organic to carry 25% of leads inside 2 quarters, from a near-zero base. Content team of two, no technical SEO support, aggressive paid team already owning the brand terms.',
      'The hard part: being disciplined. The temptation to publish 200 posts was enormous. We shipped 12.',
    ],
    pillars: [
      { title: 'Pareto brutally', body: 'RICE-score every topic. Only the top 10% ships. Everything else goes on the kill list.' },
      { title: 'Conversion-first content', body: 'Every page is a landing page. Comparison, pricing and alternatives before thought leadership.' },
      { title: 'Measure what matters', body: 'Qualified leads and demo-to-close, not sessions and bounce.' },
    ],
    actions: [
      'Scored 480 topic ideas on RICE; shipped the top 12 as flagship assets.',
      'Rebuilt comparison and alternatives templates for sales-stage queries.',
      'Introduced CRO-weighted briefs with form, calculator and demo CTAs inline.',
      'Set up a weekly review of lead-to-opportunity conversion by landing page.',
      'Killed 60+ underperforming posts to consolidate authority signals.',
    ],
    chart: {
      title: 'Qualified organic leads per week',
      note: 'Indexed to 100 at week 0.',
      series: [
        { x: 'W0', y: 100 }, { x: 'W4', y: 128 }, { x: 'W8', y: 182 },
        { x: 'W12', y: 241 }, { x: 'W16', y: 318 }, { x: 'W20', y: 402 }, { x: 'W24', y: 460 },
      ],
    },
    beforeAfter: [
      { metric: 'Qualified organic leads / wk', before: '100', after: '460', delta: '+360%' },
      { metric: 'Blended CAC', before: '100', after: '58', delta: '−42%' },
      { metric: 'Pages ranking top 3', before: '2', after: '19', delta: '+17' },
    ],
    timeline: [
      { phase: 'M0', period: 'Charter', detail: 'RICE scoring, kill list, flagship shortlist.' },
      { phase: 'M1–M3', period: 'Ship', detail: '12 flagship assets, consolidation pruning.' },
      { phase: 'M4–M6', period: 'Compound', detail: 'Internal link graph, conversion iteration.' },
    ],
    lessons: [
      'Discipline is the whole strategy. The kill list is the deliverable.',
      'Comparison pages close more revenue than thought leadership. Ship them first.',
      'If you cannot name the quota a page serves, do not brief it.',
    ],
    testimonial: null,
  },
  {
    slug: 'ai-overviews-recovery',
    title: 'Recovering traffic lost to AI Overviews',
    client: 'SaaS publisher',
    industry: 'SaaS',
    status: 'published',
    featured: false,
    order: 3,
    summary: 'A diagnostic framework for informational decay in the AI Overviews era — and a surgical content rebuild that recovered 78% of lost sessions.',
    role: 'Advisor',
    duration: '4 months',
    scope: 'Diagnostic, content surgery, GEO alignment',
    stats: [
      { value: '78%', label: 'Lost sessions recovered' },
      { value: '3.2×', label: 'Click-through on recovered pages' },
      { value: '46', label: 'Pages rebuilt' },
      { value: '12w', label: 'From diagnosis to recovery' },
    ],
    context: [
      'A B2B SaaS publisher lost ~38% of informational traffic over 6 months as AI Overviews ate the top of the SERP. The team was close to abandoning the informational layer entirely.',
      'The hard part: separating pages that AI Overviews ate from pages that were simply outdated. The two look identical in GSC.',
    ],
    pillars: [
      { title: 'Diagnose the loss', body: 'Decompose decay into AIO cannibalisation vs. ranking loss vs. intent shift.' },
      { title: 'Rebuild for citation', body: 'Rewrite for the four signals LLMs reward: specificity, structure, novelty, source.' },
      { title: 'Move the funnel', body: 'Push lost informational demand into tools, calculators and comparison pages.' },
    ],
    actions: [
      'Built a per-URL AIO-exposure score using SERP scrapes + GSC query data.',
      'Rebuilt 46 top-loss pages with original data, named sources and TL;DR summaries.',
      'Added schema (FAQ, HowTo, Dataset) where it was defensible, removed where it was spam-adjacent.',
      'Replaced thin informational posts with calculators and template downloads.',
      'Set up weekly AIO citation monitoring with Peec AI + custom prompts.',
    ],
    chart: {
      title: 'Informational sessions recovery',
      note: 'Indexed to pre-AIO baseline = 100.',
      series: [
        { x: 'W0', y: 62 }, { x: 'W2', y: 64 }, { x: 'W4', y: 71 },
        { x: 'W6', y: 78 }, { x: 'W8', y: 84 }, { x: 'W10', y: 89 }, { x: 'W12', y: 92 },
      ],
    },
    beforeAfter: [
      { metric: 'Informational sessions', before: '62', after: '92', delta: '+48%' },
      { metric: 'CTR on recovered pages', before: '1.4%', after: '4.5%', delta: '+3.1 pts' },
      { metric: 'AIO citations tracked', before: '0', after: '38', delta: '+38' },
    ],
    timeline: [
      { phase: 'W0–W2', period: 'Diagnose', detail: 'AIO-exposure scoring, loss decomposition.' },
      { phase: 'W3–W8', period: 'Rebuild', detail: '46 pages rewritten for citation signals.' },
      { phase: 'W9–W12', period: 'Monitor', detail: 'Citation tracking, decay alerts.' },
    ],
    lessons: [
      'Not every lost page deserves to be saved. Decide before you brief.',
      'LLMs cite specificity. Round numbers and vague claims get skipped.',
      'The best defence against AI Overviews is a tool the AI cannot replicate.',
    ],
    testimonial: null,
  },
  {
    slug: 'geo-llm-visibility-program',
    title: 'GEO and LLM visibility program',
    client: 'Confidential',
    industry: 'B2B',
    status: 'coming-next',
    featured: false,
    order: 4,
    summary: 'A measurement and intervention program for share of voice inside ChatGPT, Perplexity and Google AI Overviews.',
    role: 'Advisor',
    duration: 'Ongoing',
    scope: 'Prompt tracking, SOV, dark-funnel attribution',
    stats: [],
    context: [], pillars: [], actions: [], chart: null, beforeAfter: [], timeline: [], lessons: [], testimonial: null,
  },
  {
    slug: 'seo-automation-stack',
    title: 'SEO automation stack with n8n + Claude',
    client: 'Confidential',
    industry: 'Edtech',
    status: 'coming-next',
    featured: false,
    order: 5,
    summary: 'An automation layer that replaces 60% of reporting toil and keeps briefs flowing while the team sleeps.',
    role: 'Advisor',
    duration: 'Ongoing',
    scope: 'n8n, Claude API, GSC pipelines',
    stats: [],
    context: [], pillars: [], actions: [], chart: null, beforeAfter: [], timeline: [], lessons: [], testimonial: null,
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
