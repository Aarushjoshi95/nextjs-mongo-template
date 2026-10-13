'use client';

import { useMemo, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { fmtMoney, fmtNum, fmtPct, num, clamp, toCsv, downloadText } from '@/lib/tools/calc';
import {
  useCurrency, CurrencyToggle, Field, NumberInput, Stat, Panel, SmallButton,
  useUrlState, ShareButton, ExportButton, CopyButton, Callout,
} from '@/components/tools/ui';

const DEFAULTS = {
  before: 120000,
  dropPct: 35,
  cvr: 2,
  value: 2500,
  fixMonths: 2, // months until the fix ships (loss is flat until then)
  recoverMonths: 4, // months to climb back after the fix ships
  recoverTo: 100, // % of original traffic recovered at the end
  horizon: 12,
};

function compute(s) {
  const before = Math.max(0, num(s.before));
  const dropPct = clamp(num(s.dropPct), 0, 100);
  const cvr = clamp(num(s.cvr), 0, 100);
  const value = Math.max(0, num(s.value));
  const fixMonths = clamp(Math.round(num(s.fixMonths)), 0, 36);
  const recoverMonths = clamp(Math.round(num(s.recoverMonths)), 0, 36);
  const recoverTo = clamp(num(s.recoverTo), 0, 150);
  const horizon = clamp(Math.round(num(s.horizon, 12)), 1, 36);

  const after = before * (1 - dropPct / 100);
  const revPerVisit = (cvr / 100) * value;
  const revBefore = before * revPerVisit;
  const revAfter = after * revPerVisit;
  const monthlyLoss = revBefore - revAfter;

  const target = before * (recoverTo / 100);
  const months = [];
  let cumulative = 0;
  for (let m = 1; m <= horizon; m++) {
    let traffic;
    if (m <= fixMonths) traffic = after;
    else if (recoverMonths === 0) traffic = target;
    else {
      const t = Math.min(1, (m - fixMonths) / recoverMonths);
      traffic = after + (target - after) * t;
    }
    const rev = traffic * revPerVisit;
    const loss = Math.max(0, revBefore - rev);
    cumulative += loss;
    months.push({ month: `M${m}`, traffic, revenue: rev, loss, cumulative, baseline: revBefore });
  }
  const lostVisits = before - after;
  const lostConv = lostVisits * (cvr / 100);
  const noFixLoss = monthlyLoss * horizon;
  return { before, after, dropPct, revBefore, revAfter, monthlyLoss, lostVisits, lostConv, months, cumulative, noFixLoss, horizon, revPerVisit, recoveredAt: fixMonths + recoverMonths };
}

export default function TrafficDropCalculator() {
  const [currency, setCurrency] = useCurrency('INR');
  const [state, setState] = useState(DEFAULTS);
  const { shareUrl } = useUrlState('tdl', state, setState);
  const r = useMemo(() => compute(state), [state]);
  const set = (k) => (v) => setState((s) => ({ ...s, [k]: v }));

  const summaryText = () => [
    `Traffic drop loss model — ${fmtNum(r.before, currency)} → ${fmtNum(r.after, currency)} visits/mo (−${fmtPct(r.dropPct, 0)})`,
    `Monthly revenue: ${fmtMoney(r.revBefore, currency)} → ${fmtMoney(r.revAfter, currency)} (−${fmtMoney(r.monthlyLoss, currency)} / mo, ${fmtNum(r.lostConv, currency, 1)} conversions lost)`,
    `Cumulative loss over ${r.horizon} months with fix in ${state.fixMonths} mo + ${state.recoverMonths} mo recovery: ${fmtMoney(r.cumulative, currency)}`,
    `If nothing is fixed: ${fmtMoney(r.noFixLoss, currency)} over the same period.`,
    `Built with aarushjoshi.in/tools/traffic-drop-loss-calculator`,
  ].join('\n');

  const exportCsv = () => downloadText('traffic-drop-loss.csv', toCsv(
    ['Month', 'Traffic', 'Revenue', 'Baseline revenue', 'Monthly loss', 'Cumulative loss'],
    r.months.map((m) => [m.month, Math.round(m.traffic), Math.round(m.revenue), Math.round(m.baseline), Math.round(m.loss), Math.round(m.cumulative)]),
  ));

  const chart = r.months.map((m) => ({ name: m.month, 'Monthly loss': Math.round(m.loss), 'Cumulative loss': Math.round(m.cumulative) }));

  return (
    <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6 items-start" data-testid="traffic-drop-calculator">
      <div className="space-y-6 min-w-0">
        <Panel eyebrow="Step 1" title="The drop" actions={<><CurrencyToggle value={currency} onChange={setCurrency} /><SmallButton onClick={() => setState(DEFAULTS)} data-testid="reset-defaults">Reset example</SmallButton></>}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Monthly organic visits before the drop" hint="Use a stable 3-month average, not the peak.">
              <NumberInput value={state.before} onChange={set('before')} step="1000" data-testid="input-before" />
            </Field>
            <Field label="Traffic drop" suffix="%" hint={`Now ${fmtNum(r.after, currency)} visits / mo`}>
              <NumberInput value={state.dropPct} onChange={set('dropPct')} step="1" max={100} suffix="%" data-testid="input-drop" />
            </Field>
            <Field label="Conversion rate of the affected traffic" suffix="%" hint="If a commercial cluster dropped, use its rate, not the site average.">
              <NumberInput value={state.cvr} onChange={set('cvr')} step="0.1" max={100} suffix="%" data-testid="input-cvr" />
            </Field>
            <Field label="Value per conversion" prefix={currency === 'INR' ? '₹' : '$'} hint="Lead value, AOV or first-year LTV.">
              <NumberInput value={state.value} onChange={set('value')} step="100" prefix data-testid="input-value" />
            </Field>
          </div>
        </Panel>

        <Panel eyebrow="Step 2" title="Recovery assumptions">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Months until the fix ships" hint="Diagnosis + dev time. Loss is flat until then.">
              <NumberInput value={state.fixMonths} onChange={set('fixMonths')} step="1" max={36} data-testid="input-fix-months" />
            </Field>
            <Field label="Months to recover after the fix" hint="Core-update recoveries typically take 2–6 months.">
              <NumberInput value={state.recoverMonths} onChange={set('recoverMonths')} step="1" max={36} data-testid="input-recover-months" />
            </Field>
            <Field label="Recover to" suffix="% of original" hint="Set below 100 if part of the loss is permanent (e.g. AI Overviews).">
              <NumberInput value={state.recoverTo} onChange={set('recoverTo')} step="5" max={150} suffix="%" data-testid="input-recover-to" />
            </Field>
            <Field label="Reporting horizon" suffix="months">
              <NumberInput value={state.horizon} onChange={set('horizon')} step="1" min={1} max={36} suffix="mo" data-testid="input-horizon" />
            </Field>
          </div>
        </Panel>
      </div>

      <div className="space-y-6 min-w-0 lg:sticky lg:top-24">
        <Panel eyebrow="Result" title="What this drop is costing" actions={<><ShareButton getUrl={shareUrl} /><CopyButton getText={summaryText} label="Copy summary" data-testid="copy-summary-button" /><ExportButton onClick={exportCsv} /></>}>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <Stat label="Revenue lost per month" value={`−${fmtMoney(r.monthlyLoss, currency)}`} sub={`${fmtMoney(r.revBefore, currency)} → ${fmtMoney(r.revAfter, currency)}`} tone="neg" testId="stat-monthly-loss" />
            <Stat label="Conversions lost per month" value={fmtNum(r.lostConv, currency, 1)} sub={`${fmtNum(r.lostVisits, currency)} visits × ${fmtPct(num(state.cvr))} CVR`} testId="stat-lost-conv" />
            <Stat label={`Cumulative loss · ${r.horizon} mo`} value={fmtMoney(r.cumulative, currency)} sub={`with fix in ${state.fixMonths} mo, recovered by M${r.recoveredAt}`} accent testId="stat-cumulative" />
            <Stat label="If nothing is fixed" value={fmtMoney(r.noFixLoss, currency)} sub={`flat loss × ${r.horizon} months`} tone="neg" testId="stat-no-fix" />
          </div>
          <Callout testId="insight-callout">
            Every month the fix slips costs <strong>{fmtMoney(r.monthlyLoss, currency)}</strong>. Shipping it one month sooner saves roughly that much — compare it to the dev cost when you ask for the sprint. Fixing it fully saves <strong>{fmtMoney(Math.max(0, r.noFixLoss - r.cumulative), currency)}</strong> against doing nothing over {r.horizon} months.
          </Callout>
          <div className="h-[260px] mt-6 -ml-2" data-testid="loss-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="cum" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1f5eff" stopOpacity={0.35} /><stop offset="100%" stopColor="#1f5eff" stopOpacity={0.02} /></linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5e636b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#5e636b', style: { fontFamily: 'var(--font-mono)' } }} axisLine={false} tickLine={false} width={64} tickFormatter={(v) => fmtMoney(v, currency, { compact: true })} />
                <Tooltip formatter={(v) => fmtMoney(v, currency)} contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #e6e4de' }} />
                <Area type="monotone" dataKey="Cumulative loss" stroke="#1f5eff" strokeWidth={2} fill="url(#cum)" />
                <Area type="monotone" dataKey="Monthly loss" stroke="#111214" strokeWidth={1.5} strokeDasharray="4 3" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel eyebrow="Month by month" title="Recovery path">
          <div className="overflow-x-auto -mx-5 sm:-mx-7 px-5 sm:px-7">
            <table className="w-full text-[13px] tabular-nums" data-testid="months-table">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-[rgb(var(--muted))] border-b border-[rgb(var(--line))]">
                  <th className="py-2 pr-3 font-medium">Month</th>
                  <th className="py-2 px-3 font-medium text-right">Traffic</th>
                  <th className="py-2 px-3 font-medium text-right">Revenue</th>
                  <th className="py-2 px-3 font-medium text-right">Loss</th>
                  <th className="py-2 pl-3 font-medium text-right">Cumulative</th>
                </tr>
              </thead>
              <tbody>
                {r.months.map((m) => (
                  <tr key={m.month} className="border-b border-[rgb(var(--line))]/70 last:border-0">
                    <td className="py-2 pr-3 font-mono">{m.month}</td>
                    <td className="py-2 px-3 text-right font-mono">{fmtNum(m.traffic, currency)}</td>
                    <td className="py-2 px-3 text-right font-mono">{fmtMoney(m.revenue, currency)}</td>
                    <td className="py-2 px-3 text-right font-mono text-red-600">{m.loss > 0 ? `−${fmtMoney(m.loss, currency)}` : '—'}</td>
                    <td className="py-2 pl-3 text-right font-mono">{fmtMoney(m.cumulative, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}
