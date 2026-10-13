'use client';

import { useMemo, useState } from 'react';
import { Plus, Trash2, RotateCcw } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { fmtMoney, fmtNum, fmtPct, num, uid, toCsv, downloadText, clamp } from '@/lib/tools/calc';
import {
  useCurrency, CurrencyToggle, Field, NumberInput, TextInput, Stat, Panel, SmallButton,
  useUrlState, ShareButton, ExportButton, CopyButton, Callout,
} from '@/components/tools/ui';

const PRESET_SCALER = {
  total: 20000,
  clusters: [
    { id: 'c1', name: 'Roadmap', traffic: 5000, cvr: 10, value: 4000, uplift: 0 },
    { id: 'c2', name: 'Projects', traffic: 5000, cvr: 2, value: 4000, uplift: 0 },
    { id: 'c3', name: 'Syllabus & Fees', traffic: 2000, cvr: 5, value: 6000, uplift: 0 },
  ],
  other: { cvr: 0.5, value: 2000, uplift: 0 },
};

const BLANK = {
  total: 10000,
  clusters: [
    { id: 'c1', name: 'Cluster A', traffic: 3000, cvr: 3, value: 1000, uplift: 0 },
    { id: 'c2', name: 'Cluster B', traffic: 3000, cvr: 1, value: 1000, uplift: 0 },
  ],
  other: { cvr: 0.5, value: 1000, uplift: 0 },
};

const COLORS = ['#1f5eff', '#111214'];

function compute(state) {
  const total = Math.max(0, num(state.total));
  const clusters = (state.clusters || []).map((c) => ({ ...c, traffic: Math.max(0, num(c.traffic)), cvr: clamp(num(c.cvr), 0, 100), value: Math.max(0, num(c.value)), uplift: clamp(num(c.uplift), -100, 1000) }));
  const allocated = clusters.reduce((s, c) => s + c.traffic, 0);
  const otherTraffic = Math.max(0, total - allocated);
  const rows = [...clusters];
  if (otherTraffic > 0) {
    rows.push({ id: 'other', name: 'Everything else', traffic: otherTraffic, cvr: clamp(num(state.other?.cvr), 0, 100), value: Math.max(0, num(state.other?.value)), uplift: clamp(num(state.other?.uplift), -100, 1000), isOther: true });
  }
  const computed = rows.map((r) => {
    const conv = (r.traffic * r.cvr) / 100;
    const rev = conv * r.value;
    const projTraffic = r.traffic * (1 + r.uplift / 100);
    const projConv = (projTraffic * r.cvr) / 100;
    const projRev = projConv * r.value;
    return { ...r, conv, rev, rpv: r.traffic ? rev / r.traffic : 0, projTraffic, projConv, projRev, delta: projRev - rev };
  });
  const T = computed.reduce((a, r) => ({ traffic: a.traffic + r.traffic, conv: a.conv + r.conv, rev: a.rev + r.rev, projRev: a.projRev + r.projRev, projTraffic: a.projTraffic + r.projTraffic }), { traffic: 0, conv: 0, rev: 0, projRev: 0, projTraffic: 0 });
  const withShares = computed.map((r) => ({ ...r, trafficShare: T.traffic ? (r.traffic / T.traffic) * 100 : 0, revShare: T.rev ? (r.rev / T.rev) * 100 : 0 }));
  const ranked = [...withShares].filter((r) => r.traffic > 0).sort((a, b) => b.rpv - a.rpv);
  return {
    rows: withShares,
    totals: { ...T, blendedCvr: T.traffic ? (T.conv / T.traffic) * 100 : 0, rpv: T.traffic ? T.rev / T.traffic : 0, delta: T.projRev - T.rev },
    allocated,
    overAllocated: allocated > total && total > 0,
    best: ranked[0] || null,
    worst: ranked.length > 1 ? ranked[ranked.length - 1] : null,
  };
}

export default function RevenueImpactCalculator() {
  const [currency, setCurrency] = useCurrency('INR');
  const [state, setState] = useState(PRESET_SCALER);
  const { shareUrl } = useUrlState('ric', state, setState);
  const r = useMemo(() => compute(state), [state]);

  const setCluster = (id, patch) => setState((s) => ({ ...s, clusters: s.clusters.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
  const addCluster = () => setState((s) => ({ ...s, clusters: [...s.clusters, { id: uid(), name: `Cluster ${s.clusters.length + 1}`, traffic: 1000, cvr: 1, value: s.clusters[0]?.value ?? 1000, uplift: 0 }] }));
  const removeCluster = (id) => setState((s) => ({ ...s, clusters: s.clusters.filter((c) => c.id !== id) }));
  const setOther = (patch) => setState((s) => ({ ...s, other: { ...s.other, ...patch } }));
  const setAllUplift = (v) => setState((s) => ({ ...s, clusters: s.clusters.map((c) => ({ ...c, uplift: v })), other: { ...s.other, uplift: v } }));

  const chartData = r.rows.map((row) => ({ name: row.name, 'Traffic share': +row.trafficShare.toFixed(1), 'Revenue share': +row.revShare.toFixed(1) }));

  const summaryText = () => {
    const lines = [
      `Revenue impact model — ${fmtNum(r.totals.traffic, currency)} monthly visits → ${fmtMoney(r.totals.rev, currency)} / month (blended CVR ${fmtPct(r.totals.blendedCvr, 2)})`,
      ...r.rows.map((row) => `• ${row.name}: ${fmtNum(row.traffic, currency)} visits (${fmtPct(row.trafficShare)}) @ ${fmtPct(row.cvr)} CVR × ${fmtMoney(row.value, currency)} = ${fmtMoney(row.rev, currency)} (${fmtPct(row.revShare)} of revenue)`),
    ];
    if (r.best && r.worst && r.best.id !== r.worst.id) lines.push(`1,000 visits to "${r.best.name}" are worth ${fmtMoney(r.best.rpv * 1000, currency)} vs ${fmtMoney(r.worst.rpv * 1000, currency)} for "${r.worst.name}" (${(r.worst.rpv ? r.best.rpv / r.worst.rpv : 0).toFixed(1)}×).`);
    if (Math.abs(r.totals.delta) > 0) lines.push(`Scenario: ${fmtMoney(r.totals.projRev, currency)} / month projected (${r.totals.delta >= 0 ? '+' : ''}${fmtMoney(r.totals.delta, currency)}).`);
    lines.push(`Built with aarushjoshi.in/tools/revenue-impact-calculator`);
    return lines.join('\n');
  };

  const exportCsv = () => {
    const csv = toCsv(
      ['Cluster', 'Monthly traffic', 'Traffic share %', 'Conversion rate %', 'Value per conversion', 'Conversions', 'Revenue', 'Revenue share %', 'Revenue per visit', 'Traffic change %', 'Projected revenue', 'Delta'],
      r.rows.map((row) => [row.name, Math.round(row.traffic), row.trafficShare.toFixed(1), row.cvr, row.value, row.conv.toFixed(1), Math.round(row.rev), row.revShare.toFixed(1), row.rpv.toFixed(2), row.uplift, Math.round(row.projRev), Math.round(row.delta)]),
    );
    downloadText('revenue-impact-model.csv', csv);
  };

  return (
    <div className="grid lg:grid-cols-[1.15fr_1fr] gap-6 items-start" data-testid="revenue-impact-calculator">
      {/* INPUTS */}
      <div className="space-y-6 min-w-0">
        <Panel
          eyebrow="Step 1"
          title="Total monthly organic traffic"
          actions={
            <>
              <CurrencyToggle value={currency} onChange={setCurrency} />
              <SmallButton icon={RotateCcw} onClick={() => setState(PRESET_SCALER)} data-testid="preset-scaler">Example: edtech blog</SmallButton>
              <SmallButton onClick={() => setState(BLANK)} data-testid="preset-blank">Start blank</SmallButton>
            </>
          }
        >
          <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-end">
            <Field label="Monthly visits to the section you are modelling (e.g. /blog)" hint="From GA4 or GSC. Clusters below carve this up; anything unallocated becomes “Everything else”.">
              <NumberInput value={state.total} onChange={(v) => setState((s) => ({ ...s, total: v }))} step="100" data-testid="input-total-traffic" />
            </Field>
            <div className="text-[12.5px] text-[rgb(var(--muted))] sm:pb-2.5 font-mono tabular-nums">
              {fmtNum(r.allocated, currency)} / {fmtNum(num(state.total), currency)} allocated
            </div>
          </div>
          {r.overAllocated ? <div className="mt-4"><Callout tone="warn" testId="over-allocated-warning">Your clusters add up to more than the total. Either raise the total or trim a cluster — the shares below are based on the cluster sum.</Callout></div> : null}
        </Panel>

        <Panel eyebrow="Step 2" title="Intent clusters" actions={<SmallButton icon={Plus} variant="solid" onClick={addCluster} data-testid="add-cluster">Add cluster</SmallButton>}>
          <p className="text-[13.5px] text-[rgb(var(--muted))] -mt-2 mb-5 leading-relaxed">Group pages by the job the reader is doing — a “roadmap” reader is closer to buying than a “free project ideas” reader. Give each cluster its own conversion rate and value per conversion (lead value, AOV or LTV).</p>
          <div className="space-y-3">
            {state.clusters.map((c, i) => (
              <div key={c.id} className="rounded-lg border border-[rgb(var(--line))] p-4 bg-[rgb(var(--bg))]" data-testid={`cluster-row-${i}`}>
                <div className="grid grid-cols-2 md:grid-cols-[1.3fr_1fr_0.9fr_1.1fr_auto] gap-3 items-end">
                  <Field label="Cluster" className="col-span-2 md:col-span-1">
                    <TextInput value={c.name} onChange={(v) => setCluster(c.id, { name: v })} placeholder="e.g. Roadmap" data-testid={`cluster-name-${i}`} />
                  </Field>
                  <Field label="Visits / mo">
                    <NumberInput value={c.traffic} onChange={(v) => setCluster(c.id, { traffic: v })} step="100" data-testid={`cluster-traffic-${i}`} />
                  </Field>
                  <Field label="Conv. rate" suffix="%">
                    <NumberInput value={c.cvr} onChange={(v) => setCluster(c.id, { cvr: v })} step="0.1" max={100} suffix="%" data-testid={`cluster-cvr-${i}`} />
                  </Field>
                  <Field label="Value / conv." prefix={currency === 'INR' ? '₹' : '$'}>
                    <NumberInput value={c.value} onChange={(v) => setCluster(c.id, { value: v })} step="100" prefix="x" data-testid={`cluster-value-${i}`} />
                  </Field>
                  <button type="button" onClick={() => removeCluster(c.id)} className="h-10 w-10 rounded-md border border-[rgb(var(--line))] flex items-center justify-center text-[rgb(var(--muted))] hover:text-red-600 hover:border-red-300 transition justify-self-end" aria-label={`Remove ${c.name}`} data-testid={`cluster-remove-${i}`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {r.rows.some((x) => x.isOther) ? (
              <div className="rounded-lg border border-dashed border-[rgb(var(--line))] p-4" data-testid="other-row">
                <div className="grid grid-cols-2 md:grid-cols-[1.3fr_1fr_0.9fr_1.1fr_auto] gap-3 items-end">
                  <div className="col-span-2 md:col-span-1">
                    <span className="block text-[12px] font-medium mb-1.5">Everything else</span>
                    <span className="block text-[12px] text-[rgb(var(--muted))] leading-snug">Unallocated traffic, usually low-intent informational pages.</span>
                  </div>
                  <div>
                    <span className="block text-[12px] font-medium mb-1.5">Visits / mo</span>
                    <div className="h-10 flex items-center font-mono text-[14px] tabular-nums text-[rgb(var(--muted))]">{fmtNum(r.rows.find((x) => x.isOther).traffic, currency)}</div>
                  </div>
                  <Field label="Conv. rate" suffix="%">
                    <NumberInput value={state.other.cvr} onChange={(v) => setOther({ cvr: v })} step="0.1" max={100} suffix="%" data-testid="other-cvr" />
                  </Field>
                  <Field label="Value / conv." prefix={currency === 'INR' ? '₹' : '$'}>
                    <NumberInput value={state.other.value} onChange={(v) => setOther({ value: v })} step="100" prefix="x" data-testid="other-value" />
                  </Field>
                  <span className="hidden md:block w-10" />
                </div>
              </div>
            ) : null}
          </div>
        </Panel>

        <Panel eyebrow="Step 3 · Optional" title="What-if: change traffic per cluster" actions={<>
          {[-20, 0, 20, 50].map((v) => <SmallButton key={v} onClick={() => setAllUplift(v)} data-testid={`uplift-all-${v}`}>{v > 0 ? `+${v}%` : `${v}%`} all</SmallButton>)}
        </>}>
          <div className="space-y-4">
            {r.rows.map((row, i) => (
              <div key={row.id} className="grid grid-cols-[1fr_auto] sm:grid-cols-[160px_1fr_90px] gap-3 items-center">
                <span className="text-[13.5px] font-medium truncate">{row.name}</span>
                <input
                  type="range" min={-100} max={200} step={5}
                  value={row.uplift}
                  onChange={(e) => (row.isOther ? setOther({ uplift: num(e.target.value) }) : setCluster(row.id, { uplift: num(e.target.value) }))}
                  className="w-full accent-[rgb(var(--accent))] col-span-2 sm:col-span-1 order-3 sm:order-2"
                  aria-label={`Traffic change for ${row.name}`}
                  data-testid={`uplift-slider-${i}`}
                />
                <span className={`font-mono text-[13px] tabular-nums text-right order-2 sm:order-3 ${row.uplift > 0 ? 'text-[rgb(var(--positive))]' : row.uplift < 0 ? 'text-red-600' : 'text-[rgb(var(--muted))]'}`}>{row.uplift > 0 ? '+' : ''}{row.uplift}%</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* OUTPUTS */}
      <div className="space-y-6 min-w-0 lg:sticky lg:top-24">
        <Panel eyebrow="Result" title="Where the revenue actually comes from" actions={<>
          <ShareButton getUrl={shareUrl} />
          <CopyButton getText={summaryText} label="Copy summary" data-testid="copy-summary-button" />
          <ExportButton onClick={exportCsv} />
        </>}>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <Stat label="Monthly revenue" value={fmtMoney(r.totals.rev, currency)} sub={`${fmtNum(r.totals.conv, currency, 1)} conversions / mo`} accent testId="stat-revenue" />
            <Stat label="Blended conversion rate" value={fmtPct(r.totals.blendedCvr, 2)} sub={`${fmtMoney(r.totals.rpv, currency)} per visit`} testId="stat-blended-cvr" />
            <Stat label="Projected (what-if)" value={fmtMoney(r.totals.projRev, currency)} sub={`${fmtNum(r.totals.projTraffic, currency)} visits in scenario`} testId="stat-projected" />
            <Stat label="Monthly delta" value={`${r.totals.delta >= 0 ? '+' : ''}${fmtMoney(r.totals.delta, currency)}`} sub={`${r.totals.delta >= 0 ? '+' : ''}${fmtMoney(r.totals.delta * 12, currency)} annualised`} tone={r.totals.delta > 0 ? 'pos' : r.totals.delta < 0 ? 'neg' : undefined} testId="stat-delta" />
          </div>

          {r.best && r.worst && r.best.id !== r.worst.id ? (
            <Callout testId="insight-callout">
              <strong>{r.best.name}</strong> is {fmtPct(r.best.trafficShare, 0)} of traffic but {fmtPct(r.best.revShare, 0)} of revenue. 1,000 extra visits there are worth <strong>{fmtMoney(r.best.rpv * 1000, currency)}</strong> — <strong>{(r.worst.rpv ? r.best.rpv / r.worst.rpv : 0).toFixed(1)}×</strong> the same visits to {r.worst.name} ({fmtMoney(r.worst.rpv * 1000, currency)}). Report and prioritise at this level, not as “blog traffic”.
            </Callout>
          ) : null}

          <div className="h-[260px] mt-6 -ml-2" data-testid="share-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={4}>
                <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5e636b' }} axisLine={false} tickLine={false} interval={0} />
                <YAxis unit="%" tick={{ fontSize: 11, fill: '#5e636b', style: { fontFamily: 'var(--font-mono)' } }} axisLine={false} tickLine={false} width={44} />
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #e6e4de' }} cursor={{ fill: 'rgba(31,94,255,0.05)' }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Traffic share" fill={COLORS[1]} radius={[4, 4, 0, 0]} fillOpacity={0.25} />
                <Bar dataKey="Revenue share" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel eyebrow="Breakdown" title="Cluster table">
          <div className="overflow-x-auto -mx-5 sm:-mx-7 px-5 sm:px-7">
            <table className="w-full text-[13px] tabular-nums" data-testid="cluster-table">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-[rgb(var(--muted))] border-b border-[rgb(var(--line))]">
                  <th className="py-2 pr-3 font-medium">Cluster</th>
                  <th className="py-2 px-3 font-medium text-right">Traffic</th>
                  <th className="py-2 px-3 font-medium text-right">Conv.</th>
                  <th className="py-2 px-3 font-medium text-right">Revenue</th>
                  <th className="py-2 px-3 font-medium text-right">Rev. share</th>
                  <th className="py-2 pl-3 font-medium text-right">Per 1K visits</th>
                </tr>
              </thead>
              <tbody>
                {r.rows.map((row) => (
                  <tr key={row.id} className="border-b border-[rgb(var(--line))]/70 last:border-0">
                    <td className="py-2.5 pr-3 font-medium">{row.name}{row.id === r.best?.id && r.rows.length > 1 ? <span className="ml-2 pill text-[10px] text-[rgb(var(--accent))] border-[rgb(var(--accent))]/30">Highest value</span> : null}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{fmtNum(row.traffic, currency)} <span className="text-[rgb(var(--muted))]">({fmtPct(row.trafficShare, 0)})</span></td>
                    <td className="py-2.5 px-3 text-right font-mono">{fmtNum(row.conv, currency, 1)}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{fmtMoney(row.rev, currency)}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{fmtPct(row.revShare, 0)}</td>
                    <td className="py-2.5 pl-3 text-right font-mono">{fmtMoney(row.rpv * 1000, currency)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[rgb(var(--ink))]/80 font-semibold">
                  <td className="py-2.5 pr-3">Total</td>
                  <td className="py-2.5 px-3 text-right font-mono">{fmtNum(r.totals.traffic, currency)}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{fmtNum(r.totals.conv, currency, 1)}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{fmtMoney(r.totals.rev, currency)}</td>
                  <td className="py-2.5 px-3 text-right font-mono">100%</td>
                  <td className="py-2.5 pl-3 text-right font-mono">{fmtMoney(r.totals.rpv * 1000, currency)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}
