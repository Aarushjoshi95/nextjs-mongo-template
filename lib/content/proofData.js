// Real data for the "Proof, not just theory" charts on the homepage.
//
// HOW TO USE
// - Each key matches a tab id in components/site/ProofResults.js.
// - `before`: values for the months BEFORE kick-off, oldest first. The LAST value is the kick-off month (t = 0).
// - `after`:  values for the months AFTER kick-off, oldest first (t = 1, 2, 3 ...).
// - Units must match the tab (K/day for daily clicks, K for monthly totals, $K for revenue).
// - Optional `labels`: one label per point (before + after), e.g. 'Jan 22'. If given, the X-axis shows them.
// - Optional `endLabel`: overrides the label shown at the last point, e.g. '15.2K/day'.
// - Leave an entry as `null` (or delete it) to keep the illustrative shape curve for that tab.
//
// EXAMPLE
// 'traya-traffic': {
//   before: [0.9, 1.0, 1.1, 1.0],
//   after:  [1.4, 2.1, 2.8, 3.9, 5.2, 6.8, 8.1, 9.6, 10.4, 11.9, 12.8, 13.6, 14.1, 14.8, 15.0, 15.4],
//   labels: ['Sep 21', 'Oct 21', 'Nov 21', 'Dec 21', 'Jan 22', ...],
//   endLabel: '15.4K/day',
// },

export const proofData = {
  'traya-revenue': null,
  'traya-traffic': null,
  'edtech-revenue': null,
  'edtech-share': null,
  'beauty-blog-clicks': null,
  'luxury-nonbrand': null,
  'publisher-discover': null,
};

/** Converts a proofData entry into the series shape used by the chart. Returns null when no real data. */
export function realSeries(entry) {
  if (!entry || !Array.isArray(entry.after) || entry.after.length === 0) return null;
  const before = Array.isArray(entry.before) && entry.before.length ? entry.before : [entry.after[0]];
  const pts = [];
  before.forEach((v, i) => pts.push({ t: -(before.length - 1 - i), v: Number(v) || 0 }));
  entry.after.forEach((v, i) => pts.push({ t: i + 1, v: Number(v) || 0 }));
  const labels = Array.isArray(entry.labels) && entry.labels.length === pts.length
    ? Object.fromEntries(pts.map((p, i) => [p.t, entry.labels[i]]))
    : null;
  return { pts, labels, endLabel: entry.endLabel || null };
}

/** Nice axis ticks (0 .. top in 3 or 4 steps) for a given max value. */
export function niceTicks(max) {
  if (!(max > 0)) return [0, 1];
  const target = max / 3.2;
  const mag = 10 ** Math.floor(Math.log10(target));
  const norm = target / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
  const top = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = 0; v <= top + 1e-9; v += step) ticks.push(+v.toFixed(6));
  return ticks;
}
