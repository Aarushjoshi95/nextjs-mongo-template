// Helpers for the ProofResults charts. Real month-by-month figures come from a proof tab's
// optional `series` field in its case-study file:
// - `before`: months BEFORE kick-off, oldest first. The LAST value is the kick-off month (t = 0).
// - `after`:  months AFTER kick-off, oldest first (t = 1, 2, 3 ...).
// - Units must match the tab's `format` (K/day for clicksDay, K for k, $K for revenue, M for m).
// - Optional `labels` (one per point, before + after) and `endLabel` (text at the last point).
// Without `series` the chart draws the interpolated curve through the reported anchors.
import type { ProofTab } from '@/lib/schema';

type Pt = { t: number; v: number };

/** Converts a tab's `series` into the chart's point shape. Returns null when there is no real data. */
export function realSeries(entry: ProofTab['series']) {
  if (!entry || !Array.isArray(entry.after) || entry.after.length === 0) return null;
  const before = Array.isArray(entry.before) && entry.before.length ? entry.before : [entry.after[0]];
  const pts: Pt[] = [];
  before.forEach((v, i) => pts.push({ t: -(before.length - 1 - i), v: Number(v) || 0 }));
  entry.after.forEach((v, i) => pts.push({ t: i + 1, v: Number(v) || 0 }));
  const labels = Array.isArray(entry.labels) && entry.labels.length === pts.length
    ? Object.fromEntries(pts.map((p, i) => [p.t, entry.labels[i]]))
    : null;
  return { pts, labels, endLabel: entry.endLabel || null };
}

/** Nice axis ticks (0 .. top in 3 or 4 steps) for a given max value. */
export function niceTicks(max: number): number[] {
  if (!(max > 0)) return [0, 1];
  const target = max / 3.2;
  const mag = 10 ** Math.floor(Math.log10(target));
  const norm = target / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
  const top = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = 0; v <= top + 1e-9; v += step) ticks.push(+v.toFixed(6));
  return ticks;
}
