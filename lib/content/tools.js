// Registry of free tools. Used by the /tools hub, the header nav and per-tool pages.
export const tools = [
  {
    slug: 'ai-visibility-checker',
    name: 'AI Visibility Checker',
    short: 'Does Gemini name your brand?',
    description:
      'Type your brand and the question a buyer would ask an AI. We ask Gemini live, show the answer with your brand highlighted, list who got named instead, and score your stance and shortlist odds.',
    tags: ['Live', 'Gemini', 'Share of voice'],
    eyebrow: 'Live · AI',
  },
  {
    slug: 'revenue-impact-calculator',
    name: 'Revenue Impact Calculator',
    short: 'Cluster-level revenue model',
    description:
      'Stop reporting blog traffic as one number. Split it into intent clusters, give each its own conversion rate and value, and see which clusters actually make the money — and what a traffic change in each is worth.',
    tags: ['Revenue', 'Clusters', 'Forecasting'],
    eyebrow: 'Most used',
  },
  {
    slug: 'traffic-drop-loss-calculator',
    name: 'Traffic Drop Loss Calculator',
    short: 'What a ranking drop costs',
    description:
      'Put a currency figure on a traffic drop. Model the monthly revenue gap, how long recovery takes, and the cumulative loss you can take to the board to get the fix prioritised.',
    tags: ['Core updates', 'Recovery', 'Reporting'],
  },
  {
    slug: 'ctr-position-opportunity-calculator',
    name: 'CTR / Position Opportunity Calculator',
    short: 'Position → clicks → revenue',
    description:
      'Paste keywords with volume and current position, set a target position, and see the incremental clicks, conversions and revenue — with an AI Overview CTR haircut you can toggle on.',
    tags: ['Keywords', 'CTR curve', 'AI Overviews'],
  },
];

export function getTool(slug) {
  return tools.find((t) => t.slug === slug) || null;
}
