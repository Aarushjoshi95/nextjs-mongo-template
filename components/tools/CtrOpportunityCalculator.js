'use client';

import { useMemo, useState } from 'react';
import { Plus, Trash2, ClipboardPaste } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { fmtMoney, fmtNum, fmtPct, num, clamp, uid, toCsv, downloadText, DEFAULT_CTR_CURVE, ctrForPosition } from '@/lib/tools/calc';
import {
  useCurrency, CurrencyToggle, Field, NumberInput, TextInput, Stat, Panel, SmallButton,
  useUrlState, ShareButton, ExportButton, CopyButton, Callout, inputCls,
} from '@/components/tools/ui';

const DEFAULTS = {
  cvr: 2.5,
  value: 3000,
  targetPos: 3,
  aio: false,
  aioHaircut: 35,
  curve: DEFAULT_CTR_CURVE,
  keywords: [
    { id: 'k1', kw: 'data science roadmap', vol: 12000, pos: 8 },
    { id: 'k2', kw: 'machine learning projects for beginners', vol: 9000, pos: 11 },
    { id: 'k3', kw: 'data science course fees', vol: 4500, pos: 6 },
    { id: 'k4', kw: 'python for data science', vol: 20000, pos: 15 },
  ],
};

function compute(s) {
  const cvr = clamp(num(s.cvr), 0, 100);
  const value = Math.max(0, num(s.value));
  const haircut = s.aio ? clamp(num(s.aioHaircut), 0, 100) / 100 : 0;
  const curve = Array.isArray(s.curve) && s.curve.length === 20 ? s.curve.map((v) => clamp(num(v), 0, 100)) : DEFAULT_CTR_CURVE;
  const rows = (s.keywords || []).map((k) => {
    const vol = Math.max(0, num(k.vol));
    const pos = Math.max(0, num(k.pos));
    const target = clamp(num(k.target ?? s.targetPos, 1), 1, 100);
    const curCtr = ctrForPosition(pos, curve) * (1 - haircut);
    const tgtCtr = ctrForPosition(target, curve) * (1 - haircut);
    const curClicks = (vol * curCtr) / 100;
    const tgtClicks = (vol * tgtCtr) / 100;
    const inc = tgtClicks - curClicks;
    const incConv = inc * (cvr / 100);
    const incRev = incConv * value;
    return { ...k, vol, pos, target, curCtr, tgtCtr, curClicks, tgtClicks, inc, incConv, incRev };
  });
  const T = rows.reduce((a, r) => ({ vol: a.vol + r.vol, cur: a.cur + r.curClicks, tgt: a.tgt + r.tgtClicks, inc: a.inc + r.inc, conv: a.conv + r.incConv, rev: a.rev + r.incRev }), { vol: 0, cur: 0, tgt: 0, inc: 0, conv: 0, rev: 0 });
  const ranked = [...rows].sort((a, b) => b.incRev - a.incRev);
  return { rows, totals: T, top: ranked[0] || null, curve, haircut };
}

function parsePaste(text) {
  // Accepts lines like: "keyword, 12000, 8" or tab-separated from Sheets/GSC exports.
  return text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).map((line) => {
    const parts = line.split(/\t|,|;/).map((p) => p.trim()).filter((p) => p !== '');
    if (parts.length < 2) return null;
    const nums = parts.slice(1).map((p) => parseFloat(p.replace(/[^0-9.]/g, '')));
    const vol = nums[0];
    const pos = nums[1];
    if (!Number.isFinite(vol)) return null;
    return { id: uid(), kw: parts[0], vol, pos: Number.isFinite(pos) ? pos : 10 };
  }).filter(Boolean);
}

export default function CtrOpportunityCalculator() {
  const [currency, setCurrency] = useCurrency('INR');
  const [state, setState] = useState(DEFAULTS);
  const [paste, setPaste] = useState('');
  const [showPaste, setShowPaste] = useState(false);
  const [showCurve, setShowCurve] = useState(false);
  const { shareUrl } = useUrlState('ctr', state, setState);
  const r = useMemo(() => compute(state), [state]);
  const set = (k) => (v) => setState((s) => ({ ...s, [k]: v }));
  const setKw = (id, patch) => setState((s) => ({ ...s, keywords: s.keywords.map((k) => (k.id === id ? { ...k, ...patch } : k)) }));
  const addKw = () => setState((s) => ({ ...s, keywords: [...s.keywords, { id: uid(), kw: '', vol: 1000, pos: 10 }] }));
  const removeKw = (id) => setState((s) => ({ ...s, keywords: s.keywords.filter((k) => k.id !== id) }));
  const applyPaste = () => {
    const parsed = parsePaste(paste);
    if (parsed.length) setState((s) => ({ ...s, keywords: [...s.keywords.filter((k) => k.kw), ...parsed] }));
    setPaste('');
    setShowPaste(false);
  };
  const setCurveAt = (i, v) => setState((s) => { const c = [...(s.curve || DEFAULT_CTR_CURVE)]; c[i] = v; return { ...s, curve: c }; });

  const summaryText = () => [
    `CTR / position opportunity — ${r.rows.length} keywords, ${fmtNum(r.totals.vol, currency)} searches/mo${state.aio ? ` (AI Overview haircut −${state.aioHaircut}%)` : ''}`,
    `Clicks: ${fmtNum(r.totals.cur, currency)} → ${fmtNum(r.totals.tgt, currency)} (+${fmtNum(r.totals.inc, currency)} / mo)`,
    `Incremental: ${fmtNum(r.totals.conv, currency, 1)} conversions, ${fmtMoney(r.totals.rev, currency)} / mo, ${fmtMoney(r.totals.rev * 12, currency)} / yr`,
    ...(r.top ? [`Biggest single opportunity: "${r.top.kw}" (pos ${r.top.pos} → ${r.top.target}) = ${fmtMoney(r.top.incRev, currency)} / mo`] : []),
    `Built with aarushjoshi.in/tools/ctr-position-opportunity-calculator`,
  ].join('\n');

  const exportCsv = () => downloadText('ctr-opportunity.csv', toCsv(
    ['Keyword', 'Monthly searches', 'Current position', 'Target position', 'Current CTR %', 'Target CTR %', 'Current clicks', 'Target clicks', 'Incremental clicks', 'Incremental conversions', 'Incremental revenue'],
    r.rows.map((k) => [k.kw, k.vol, k.pos, k.target, k.curCtr.toFixed(2), k.tgtCtr.toFixed(2), Math.round(k.curClicks), Math.round(k.tgtClicks), Math.round(k.inc), k.incConv.toFixed(1), Math.round(k.incRev)]),
  ));

  const chart = [...r.rows].sort((a, b) => b.incRev - a.incRev).slice(0, 8).map((k) => ({ name: k.kw.length > 22 ? k.kw.slice(0, 20) + '…' : k.kw || '(blank)', Revenue: Math.round(k.incRev) }));

  return (
    <div className="grid lg:grid-cols-[1.15fr_1fr] gap-6 items-start" data-testid="ctr-opportunity-calculator">
      <div className="space-y-6 min-w-0">
        <Panel eyebrow="Step 1" title="Keywords" actions={<>
          <CurrencyToggle value={currency} onChange={setCurrency} />
          <SmallButton icon={ClipboardPaste} onClick={() => setShowPaste((v) => !v)} data-testid="toggle-paste">Paste list</SmallButton>
          <SmallButton icon={Plus} variant="solid" onClick={addKw} data-testid="add-keyword">Add row</SmallButton>
        </>}>
          {showPaste ? (
            <div className="mb-5 rounded-lg border border-dashed border-[rgb(var(--line))] p-4" data-testid="paste-panel">
              <p className="text-[13px] text-[rgb(var(--muted))] mb-2">One keyword per line: <code className="font-mono text-[12px]">keyword, monthly searches, current position</code>. Tabs or commas both work (paste straight from Sheets).</p>
              <textarea value={paste} onChange={(e) => setPaste(e.target.value)} rows={5} className={`${inputCls} h-auto py-2 font-mono text-[13px]`} placeholder={'data science roadmap, 12000, 8\nml projects, 9000, 11'} data-testid="paste-textarea" />
              <div className="flex gap-2 mt-3"><SmallButton variant="solid" onClick={applyPaste} data-testid="apply-paste">Add keywords</SmallButton><SmallButton onClick={() => setShowPaste(false)}>Cancel</SmallButton></div>
            </div>
          ) : null}
          <div className="space-y-2">
            <div className="hidden md:grid grid-cols-[1.6fr_1fr_0.8fr_0.8fr_auto] gap-3 text-[11px] uppercase tracking-wider text-[rgb(var(--muted))] px-1">
              <span>Keyword</span><span>Searches / mo</span><span>Current pos.</span><span>Target pos.</span><span className="w-10" />
            </div>
            {state.keywords.map((k, i) => (
              <div key={k.id} className="grid grid-cols-2 md:grid-cols-[1.6fr_1fr_0.8fr_0.8fr_auto] gap-3 items-center rounded-lg border border-[rgb(var(--line))] md:border-0 p-3 md:p-0 bg-[rgb(var(--bg))] md:bg-transparent" data-testid={`kw-row-${i}`}>
                <TextInput value={k.kw} onChange={(v) => setKw(k.id, { kw: v })} placeholder="keyword" className="col-span-2 md:col-span-1" data-testid={`kw-name-${i}`} />
                <NumberInput value={k.vol} onChange={(v) => setKw(k.id, { vol: v })} step="100" aria-label="Monthly searches" data-testid={`kw-vol-${i}`} />
                <div className="flex items-center gap-2">
                  <NumberInput value={k.pos} onChange={(v) => setKw(k.id, { pos: v })} step="1" min={1} max={100} aria-label="Current position" data-testid={`kw-pos-${i}`} />
                  <span className="md:hidden text-[11px] text-[rgb(var(--muted))] shrink-0">now</span>
                </div>
                <div className="flex items-center gap-2 col-span-2 md:col-span-1">
                  <NumberInput value={k.target ?? ''} onChange={(v) => setKw(k.id, { target: v === '' ? undefined : v })} placeholder={String(state.targetPos)} step="1" min={1} max={100} aria-label="Target position" data-testid={`kw-target-${i}`} />
                  <button type="button" onClick={() => removeKw(k.id)} className="md:hidden h-10 w-10 shrink-0 rounded-md border border-[rgb(var(--line))] flex items-center justify-center text-[rgb(var(--muted))] hover:text-red-600" aria-label="Remove keyword"><Trash2 className="w-4 h-4" /></button>
                </div>
                <button type="button" onClick={() => removeKw(k.id)} className="hidden md:flex h-10 w-10 rounded-md border border-[rgb(var(--line))] items-center justify-center text-[rgb(var(--muted))] hover:text-red-600 hover:border-red-300 transition" aria-label={`Remove ${k.kw}`} data-testid={`kw-remove-${i}`}><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Step 2" title="Assumptions" actions={<SmallButton onClick={() => setShowCurve((v) => !v)} data-testid="toggle-curve">{showCurve ? 'Hide CTR curve' : 'Edit CTR curve'}</SmallButton>}>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Default target position" hint="Used when a row has no target of its own.">
              <NumberInput value={state.targetPos} onChange={set('targetPos')} step="1" min={1} max={100} data-testid="input-target-pos" />
            </Field>
            <Field label="Conversion rate" suffix="%">
              <NumberInput value={state.cvr} onChange={set('cvr')} step="0.1" max={100} suffix="%" data-testid="input-cvr" />
            </Field>
            <Field label="Value per conversion" prefix={currency === 'INR' ? '₹' : '$'}>
              <NumberInput value={state.value} onChange={set('value')} step="100" prefix data-testid="input-value" />
            </Field>
          </div>
          <div className="mt-5 rounded-lg border border-[rgb(var(--line))] p-4 flex flex-wrap items-center gap-4" data-testid="aio-panel">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" checked={!!state.aio} onChange={(e) => set('aio')(e.target.checked)} className="h-4 w-4 accent-[rgb(var(--accent))]" data-testid="aio-toggle" />
              <span className="text-[14px] font-medium">SERP shows an AI Overview</span>
            </label>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-[12.5px] text-[rgb(var(--muted))]">Organic CTR haircut</span>
              <NumberInput value={state.aioHaircut} onChange={set('aioHaircut')} step="5" max={100} suffix="%" className="w-24" disabled={!state.aio} data-testid="aio-haircut" />
            </div>
            <p className="w-full text-[12px] text-[rgb(var(--muted))] leading-snug">Studies in 2024–25 put the organic CTR loss under an AI Overview at roughly 20–60% depending on query type. Applies to both current and target CTR — the gap closes, which is the point.</p>
          </div>
          {showCurve ? (
            <div className="mt-5" data-testid="curve-editor">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] text-[rgb(var(--muted))]">Organic CTR % by position (1–20). Positions 21–30 use 0.35%, 31–50 0.15%, beyond 0.05%.</span>
                <SmallButton onClick={() => set('curve')(DEFAULT_CTR_CURVE)}>Reset curve</SmallButton>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {r.curve.map((v, i) => (
                  <label key={i} className="block">
                    <span className="block text-[10px] font-mono text-[rgb(var(--muted))] mb-1">#{i + 1}</span>
                    <input type="number" step="0.1" min={0} max={100} value={(state.curve || DEFAULT_CTR_CURVE)[i]} onChange={(e) => setCurveAt(i, e.target.value)} className={`${inputCls} h-9 px-2 text-[12px]`} />
                  </label>
                ))}
              </div>
            </div>
          ) : null}
        </Panel>
      </div>

      <div className="space-y-6 min-w-0 lg:sticky lg:top-24">
        <Panel eyebrow="Result" title="What moving up is worth" actions={<><ShareButton getUrl={shareUrl} /><CopyButton getText={summaryText} label="Copy summary" data-testid="copy-summary-button" /><ExportButton onClick={exportCsv} /></>}>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <Stat label="Incremental revenue / mo" value={fmtMoney(r.totals.rev, currency)} sub={`${fmtMoney(r.totals.rev * 12, currency)} annualised`} accent testId="stat-inc-revenue" />
            <Stat label="Incremental clicks / mo" value={`+${fmtNum(r.totals.inc, currency)}`} sub={`${fmtNum(r.totals.cur, currency)} → ${fmtNum(r.totals.tgt, currency)} clicks`} testId="stat-inc-clicks" />
            <Stat label="Incremental conversions" value={fmtNum(r.totals.conv, currency, 1)} sub={`at ${fmtPct(num(state.cvr))} CVR`} testId="stat-inc-conv" />
            <Stat label="Search demand modelled" value={fmtNum(r.totals.vol, currency)} sub={`${r.rows.length} keywords${state.aio ? ` · AIO −${state.aioHaircut}%` : ''}`} testId="stat-volume" />
          </div>
          {r.top && r.top.incRev > 0 ? (
            <Callout testId="insight-callout">
              <strong>“{r.top.kw}”</strong> is the biggest single opportunity: moving from position {r.top.pos} to {r.top.target} adds about <strong>{fmtNum(r.top.inc, currency)} clicks</strong> and <strong>{fmtMoney(r.top.incRev, currency)} / mo</strong>. {state.aio ? 'Under an AI Overview, winning the citation in the overview itself is often worth more than the position move — model that separately.' : 'Volume is not the opportunity; the CTR gap times value is.'}
            </Callout>
          ) : null}
          <div className="h-[260px] mt-6 -ml-2" data-testid="opportunity-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid horizontal={false} stroke="rgba(0,0,0,0.06)" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#5e636b', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={(v) => fmtMoney(v, currency, { compact: true })} />
                <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11, fill: '#111214' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => fmtMoney(v, currency)} contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #e6e4de' }} cursor={{ fill: 'rgba(31,94,255,0.05)' }} />
                <Bar dataKey="Revenue" fill="#1f5eff" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel eyebrow="Breakdown" title="Keyword table">
          <div className="overflow-x-auto -mx-5 sm:-mx-7 px-5 sm:px-7">
            <table className="w-full text-[13px] tabular-nums" data-testid="keyword-table">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-[rgb(var(--muted))] border-b border-[rgb(var(--line))]">
                  <th className="py-2 pr-3 font-medium">Keyword</th>
                  <th className="py-2 px-3 font-medium text-right">Pos.</th>
                  <th className="py-2 px-3 font-medium text-right">CTR</th>
                  <th className="py-2 px-3 font-medium text-right">+Clicks</th>
                  <th className="py-2 pl-3 font-medium text-right">+Revenue</th>
                </tr>
              </thead>
              <tbody>
                {r.rows.map((k) => (
                  <tr key={k.id} className="border-b border-[rgb(var(--line))]/70 last:border-0">
                    <td className="py-2.5 pr-3 font-medium max-w-[180px] truncate">{k.kw || <span className="text-[rgb(var(--muted))]">(blank)</span>}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{k.pos} <span className="text-[rgb(var(--muted))]">→</span> {k.target}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{fmtPct(k.curCtr)} <span className="text-[rgb(var(--muted))]">→</span> {fmtPct(k.tgtCtr)}</td>
                    <td className={`py-2.5 px-3 text-right font-mono ${k.inc < 0 ? 'text-red-600' : ''}`}>{k.inc >= 0 ? '+' : ''}{fmtNum(k.inc, currency)}</td>
                    <td className={`py-2.5 pl-3 text-right font-mono ${k.incRev < 0 ? 'text-red-600' : ''}`}>{fmtMoney(k.incRev, currency)}</td>
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
