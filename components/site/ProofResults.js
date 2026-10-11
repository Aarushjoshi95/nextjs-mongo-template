'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  Deterministic series builders (no Math.random => SSR-safe)         */
/* ------------------------------------------------------------------ */
function rng(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Builds a time series in months. t <= 0 is the pre-engagement period, t > 0 is post kick-off.
 * Post kick-off values follow base + (end - base) * p^curve with optional multiplicative noise.
 */
function buildSeries({ before, after, step = 1, base = 0, end, curve = 2, noise = 0, beforeNoise = 0, seed = 1 }) {
  const r = rng(seed);
  const pts = [];
  for (let t = -before; t <= after + 1e-9; t += step) {
    let v;
    if (t <= 0) {
      v = base + (beforeNoise ? (r() - 0.5) * 2 * beforeNoise * (base || 1) : 0);
    } else {
      const p = t / after;
      v = base + (end - base) * Math.pow(p, curve);
      if (noise) v *= 1 + (r() - 0.5) * 2 * noise * (1 - 0.35 * p);
    }
    pts.push({ t: +t.toFixed(2), v: Math.max(0, v) });
  }
  pts[pts.length - 1].v = end;
  return pts;
}

const fmtRevenue = (v) => `$${Math.round(v)}K`;
const fmtClicks = (v) => (v >= 1 ? `${v.toFixed(1)}K/day` : `${Math.round(v * 1000)}/day`);
const axisRevenue = (v) => (v === 0 ? '$0' : `$${v}K`);
const axisClicks = (v) => (v === 0 ? '0' : `${v}K`);

const TABS = [
  {
    id: 'traya-revenue',
    chapter: 'In-house',
    client: 'Traya',
    pill: 'Traya · Revenue',
    sector: 'D2C hair-health brand',
    metric: { value: 450, prefix: '$', suffix: 'K' },
    body: 'attributable revenue built from $0 — D0 acquisition driven through SEO-led initiatives at a D2C hair-health brand.',
    before: { label: 'Revenue · before', value: '$0' },
    after: { label: 'Revenue · after', value: '$450K' },
    chart: {
      caption: 'Cumulative attributed revenue',
      window: '24 months',
      yTicks: [0, 150, 300, 450],
      xEvery: 6,
      fmt: fmtRevenue,
      fmtAxis: axisRevenue,
      endLabel: '$450K',
      dots: true,
      series: buildSeries({ before: 4, after: 24, end: 450, curve: 2.2, seed: 11 }),
    },
  },
  {
    id: 'traya-traffic',
    chapter: 'In-house',
    client: 'Traya',
    pill: 'Traya · Non-brand traffic',
    sector: 'D2C hair-health brand',
    metric: { value: 21, prefix: '', suffix: '×' },
    body: 'non-brand organic traffic in 2 years, starting from scratch — an SEO engine returning 6×+ attributable ROI.',
    before: { label: 'Clicks · before', value: '1K/day' },
    after: { label: 'Clicks · after', value: '15K+/day' },
    chart: {
      caption: 'Daily clicks · Google Search Console',
      window: '16 months',
      yTicks: [0, 4, 8, 12, 16],
      xEvery: 4,
      fmt: fmtClicks,
      fmtAxis: axisClicks,
      endLabel: '15K+/day',
      dots: false,
      series: buildSeries({ before: 5, after: 16, step: 0.25, base: 1, end: 15.4, curve: 1.9, noise: 0.11, beforeNoise: 0.09, seed: 23 }),
    },
  },
  {
    id: 'edtech-revenue',
    chapter: 'Client',
    client: 'EdTech',
    pill: 'EdTech · Revenue',
    sector: 'K-12 EdTech brand',
    metric: { value: 700, prefix: '$', suffix: 'K+' },
    body: 'revenue generated in 8 months from $0 — a client-facing SEO engagement with a K-12 EdTech brand.',
    before: { label: 'Revenue · before', value: '$0' },
    after: { label: 'Revenue · 8 mo', value: '$700K+' },
    chart: {
      caption: 'Cumulative attributed revenue',
      window: '8 months',
      yTicks: [0, 250, 500, 750],
      xEvery: 2,
      fmt: fmtRevenue,
      fmtAxis: axisRevenue,
      endLabel: '$700K+',
      dots: true,
      series: buildSeries({ before: 3, after: 8, end: 700, curve: 1.8, seed: 7 }),
    },
  },
  {
    id: 'edtech-share',
    chapter: 'Client',
    client: 'EdTech',
    pill: 'EdTech · Organic share',
    sector: 'K-12 EdTech brand',
    metric: { value: 20, prefix: '', suffix: '%' },
    body: 'of net business came from the organic channel — built from a standing start inside 8 months.',
    before: { label: 'Organic share · before', value: '0%' },
    after: { label: 'Organic share · after', value: '20%' },
    chart: {
      caption: 'Daily clicks · Google Search Console',
      window: '8 months',
      yTicks: [0, 8, 16, 24],
      xEvery: 2,
      fmt: fmtClicks,
      fmtAxis: axisClicks,
      endLabel: '24K/day',
      dots: false,
      series: buildSeries({ before: 3, after: 8, step: 0.125, base: 0.15, end: 24, curve: 2.4, noise: 0.14, beforeNoise: 0.35, seed: 41 }),
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */
function useCountUp(target, { start, reduced, duration = 1300 }) {
  const [val, setVal] = useState(target);
  useEffect(() => {
    if (!start) return undefined;
    if (reduced) { setVal(target); return undefined; }
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(target * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, reduced, duration]);
  return val;
}

function useElementWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}

/* ------------------------------------------------------------------ */
/*  Chart                                                              */
/* ------------------------------------------------------------------ */
const ACCENT = 'rgb(var(--accent))';
const PAPER = 'rgb(var(--bg))';
const EASE = [0.22, 1, 0.36, 1];

function GrowthChart({ tab, width, play, reduced }) {
  const [hover, setHover] = useState(null);
  const { series, yTicks, xEvery, fmt, fmtAxis, endLabel, dots } = tab.chart;

  const compact = width < 560;
  const height = compact ? 240 : 330;
  const m = { top: 22, right: compact ? 14 : 22, bottom: 32, left: compact ? 42 : 56 };

  const geo = useMemo(() => {
    if (!width) return null;
    const iw = width - m.left - m.right;
    const ih = height - m.top - m.bottom;
    const t0 = series[0].t;
    const t1 = series[series.length - 1].t;
    const yMax = yTicks[yTicks.length - 1];
    const x = (t) => m.left + ((t - t0) / (t1 - t0)) * iw;
    const y = (v) => m.top + ih - (v / yMax) * ih;
    const pts = series.map((p) => ({ ...p, x: x(p.t), y: y(p.v) }));
    const startIdx = pts.findIndex((p) => p.t >= 0);
    const beforePts = pts.slice(0, startIdx + 1);
    const afterPts = pts.slice(startIdx);
    const line = (arr) => arr.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const baseY = m.top + ih;
    const last = afterPts[afterPts.length - 1];
    const area = `${line(afterPts)} L${last.x.toFixed(1)} ${baseY} L${afterPts[0].x.toFixed(1)} ${baseY} Z`;
    const raw = [{ t: t0, label: `${t0} mo` }, { t: 0, label: 'Kick-off' }];
    for (let t = xEvery; t <= t1 + 1e-9; t += xEvery) raw.push({ t, label: `+${t} mo` });
    if (raw[raw.length - 1].t < t1 - 1e-9) raw.push({ t: t1, label: `+${t1} mo` });
    // thin out labels that would collide (always keep Kick-off and the final tick)
    const minGap = compact ? 62 : 52;
    const lastX = x(t1);
    const xTicks = [];
    raw.forEach((tk, i) => {
      const px = x(tk.t);
      const isLast = i === raw.length - 1;
      const prev = xTicks[xTicks.length - 1];
      if (tk.t === 0) {
        if (prev && px - x(prev.t) < minGap) xTicks.pop();
        xTicks.push(tk);
        return;
      }
      if (prev && px - x(prev.t) < minGap) return;
      if (!isLast && lastX - px < minGap) return;
      xTicks.push(tk);
    });
    return { iw, ih, pts, startIdx, beforePath: line(beforePts), afterPath: line(afterPts), area, xTicks, x, y, baseY, last, start: pts[startIdx], afterPts };
  }, [width, height, series, yTicks, xEvery, compact, m.left, m.right, m.top, m.bottom]);

  const onMove = useCallback((e) => {
    if (!geo) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < geo.pts.length; i += 1) {
      const d = Math.abs(geo.pts[i].x - px);
      if (d < bestD) { bestD = d; best = i; }
    }
    setHover(best);
  }, [geo]);

  if (!geo) return <div style={{ height }} />;

  const gradId = `proof-grad-${tab.id}`;
  const hp = hover != null ? geo.pts[hover] : null;
  const tipRight = hp ? hp.x > width - 150 : false;
  const drawDur = reduced ? 0 : 1.5;
  const beforeW = geo.x(0) - geo.x(series[0].t);

  return (
    <div className="relative" data-testid="proof-chart">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block select-none"
        style={{ touchAction: 'pan-y' }}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        role="img"
        aria-label={`${tab.chart.caption}: ${tab.before.value} before kick-off to ${endLabel} after ${tab.chart.window}`}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: ACCENT, stopOpacity: 0.42 }} />
            <stop offset="100%" style={{ stopColor: ACCENT, stopOpacity: 0 }} />
          </linearGradient>
          <clipPath id={`${gradId}-clip`}>
            <rect x={geo.x(0)} y={0} width={Math.max(0, width - geo.x(0))} height={height} />
          </clipPath>
        </defs>

        {/* pre-engagement shading */}
        <rect x={m.left} y={m.top} width={beforeW} height={geo.ih} fill="rgb(255 255 255 / 0.025)" />
        {beforeW > 70 && (
          <text x={m.left + beforeW / 2} y={m.top + 14} textAnchor="middle" className="font-mono" fontSize="10" letterSpacing="0.1em" fill="rgb(250 250 247 / 0.35)">
            BEFORE
          </text>
        )}

        {/* grid + y labels */}
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={m.left} x2={width - m.right} y1={geo.y(v)} y2={geo.y(v)} stroke="rgb(255 255 255 / 0.08)" strokeDasharray={v === 0 ? '0' : '2 4'} />
            <text x={m.left - 10} y={geo.y(v) + 4} textAnchor="end" className="font-mono" fontSize="11" fill="rgb(250 250 247 / 0.45)">
              {fmtAxis(v)}
            </text>
          </g>
        ))}

        {/* x labels */}
        {geo.xTicks.map((tk) => (
          <text
            key={tk.t}
            x={geo.x(tk.t)}
            y={height - 10}
            textAnchor={tk.t === series[0].t ? 'start' : tk.t >= series[series.length - 1].t - 0.01 ? 'end' : 'middle'}
            className="font-mono"
            fontSize="11"
            fill={tk.t === 0 ? 'rgb(250 250 247 / 0.85)' : 'rgb(250 250 247 / 0.45)'}
            fontWeight={tk.t === 0 ? 500 : 400}
          >
            {tk.label}
          </text>
        ))}

        {/* kick-off divider */}
        <line x1={geo.x(0)} x2={geo.x(0)} y1={m.top} y2={geo.baseY} stroke="rgb(255 255 255 / 0.14)" strokeDasharray="3 4" />

        {/* before line */}
        <motion.path
          d={geo.beforePath}
          fill="none"
          stroke="rgb(250 250 247 / 0.42)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reduced ? 1 : 0, opacity: reduced ? 1 : 0 }}
          animate={play ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: reduced ? 0 : 0.6, ease: 'easeOut' }}
        />

        {/* area */}
        <motion.path
          d={geo.area}
          fill={`url(#${gradId})`}
          initial={{ opacity: 0 }}
          animate={play ? { opacity: 1 } : {}}
          transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : 0.7, ease: 'easeOut' }}
        />

        {/* growth line */}
        <motion.path
          d={geo.afterPath}
          fill="none"
          style={{ stroke: ACCENT }}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reduced ? 1 : 0 }}
          animate={play ? { pathLength: 1 } : {}}
          transition={{ duration: drawDur, delay: reduced ? 0 : 0.45, ease: EASE }}
        />

        {/* data dots (sparse series only) */}
        {dots && geo.afterPts.slice(1).map((p, i, arr) => (
          <motion.circle
            key={p.t}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="rgb(var(--ink))"
            style={{ stroke: ACCENT }}
            strokeWidth="1.75"
            initial={{ opacity: 0 }}
            animate={play ? { opacity: 1 } : {}}
            transition={{ duration: 0.25, delay: reduced ? 0 : 0.45 + ((i + 1) / arr.length) * drawDur * 0.92 }}
          />
        ))}

        {/* kick-off brand marker */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={play ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: reduced ? 0 : 0.5 }}
        >
          {!reduced && (
            <circle cx={geo.start.x} cy={geo.start.y} r="13" fill="none" style={{ stroke: ACCENT }} strokeWidth="1.5" opacity="0.6">
              <animate attributeName="r" from="13" to="26" dur="2.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.55" to="0" dur="2.2s" repeatCount="indefinite" />
            </circle>
          )}
          <circle cx={geo.start.x} cy={geo.start.y} r="13" style={{ fill: ACCENT }} />
          <text x={geo.start.x} y={geo.start.y + 4.5} textAnchor="middle" fontSize="13" fontWeight="600" fill="#fff" style={{ fontFamily: 'Inter Tight, Inter, sans-serif' }}>
            A
          </text>
        </motion.g>

        {/* end label */}
        <motion.g
          initial={{ opacity: 0, y: 6 }}
          animate={play ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: reduced ? 0 : 0.45 + drawDur }}
        >
          <circle cx={geo.last.x} cy={geo.last.y} r="4.5" style={{ fill: ACCENT }} stroke="rgb(var(--ink))" strokeWidth="2" />
          <text x={geo.last.x - 12} y={geo.last.y - 10} textAnchor="end" className="font-mono" fontSize="12.5" fontWeight="500" fill="rgb(250 250 247)">
            {endLabel}
          </text>
        </motion.g>

        {/* hover crosshair */}
        {hp && (
          <g style={{ pointerEvents: 'none' }}>
            <line x1={hp.x} x2={hp.x} y1={m.top} y2={geo.baseY} stroke="rgb(250 250 247 / 0.35)" strokeDasharray="2 3" />
            <circle cx={hp.x} cy={hp.y} r="9" style={{ fill: hp.t > 0 ? ACCENT : 'rgb(250 250 247)' }} opacity="0.18" />
            <circle cx={hp.x} cy={hp.y} r="4.5" style={{ fill: hp.t > 0 ? ACCENT : 'rgb(250 250 247 / 0.7)' }} stroke="rgb(var(--ink))" strokeWidth="2" />
          </g>
        )}
      </svg>

      {/* tooltip */}
      {hp && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg px-3 py-2 shadow-lg"
          style={{
            left: tipRight ? hp.x - 12 : hp.x + 12,
            top: Math.max(0, hp.y - 50),
            transform: tipRight ? 'translateX(-100%)' : 'none',
            backgroundColor: PAPER,
            color: 'rgb(var(--ink))',
          }}
          data-testid="proof-chart-tooltip"
        >
          <div className="text-[10.5px] uppercase tracking-[0.1em] font-mono" style={{ color: 'rgb(var(--muted))' }}>
            {hp.t > 0 ? `+${Math.round(hp.t * 10) / 10} mo` : hp.t === 0 ? 'Kick-off' : `${Math.round(hp.t * 10) / 10} mo · before`}
          </div>
          <div className="font-mono text-[15px] font-medium leading-tight mt-0.5" style={{ color: hp.t > 0 ? ACCENT : 'rgb(var(--ink))' }}>
            {fmt(hp.v)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
export default function ProofResults() {
  const [active, setActive] = useState(0);
  const [chartRef, chartWidth] = useElementWidth();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-15% 0px -15% 0px' });
  const reduced = useReducedMotion();
  const tab = TABS[active];

  const metricVal = useCountUp(tab.metric.value, { start: inView, reduced });

  const onTabKey = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = e.key === 'ArrowRight' ? (active + 1) % TABS.length : (active - 1 + TABS.length) % TABS.length;
    setActive(next);
    e.currentTarget.parentElement?.querySelectorAll('[role="tab"]')[next]?.focus();
  };

  const soft = 'rgb(250 250 247 / 0.62)';
  const dim = 'rgb(250 250 247 / 0.42)';
  const rule = 'rgb(255 255 255 / 0.1)';

  return (
    <section
      id="results"
      ref={sectionRef}
      className="relative overflow-hidden bg-[rgb(var(--ink))] text-[rgb(var(--bg))]"
      data-testid="proof-results-section"
    >
      {/* ambient accent glow */}
      <div aria-hidden className="pointer-events-none absolute -top-40 right-[-10%] w-[520px] h-[520px] rounded-full bg-[rgb(var(--accent))]/[0.14] blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-56 left-[-10%] w-[480px] h-[480px] rounded-full bg-[rgb(var(--accent))]/[0.08] blur-3xl" />

      <div className="container-max section-y relative">
        {/* heading */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.12em] font-medium" style={{ color: soft }}>
            <span className="inline-block h-px w-6 bg-[rgb(var(--accent))]" />
            Receipts, not theory
          </span>
          <h2 className="text-[clamp(34px,5.2vw,60px)] font-semibold leading-[1.04] tracking-tight mt-5 text-[rgb(var(--bg))]">
            Proof, not just theory.
          </h2>
          <p className="text-[17px] mt-5 leading-relaxed max-w-[56ch]" style={{ color: soft }}>
            Two chapters, both starting at zero. One in-house, one client-facing — each tied to revenue the business could count.
          </p>
        </div>

        {/* tabs */}
        <div
          role="tablist"
          aria-label="Growth metrics"
          className="mt-10 lg:mt-12 flex gap-2 overflow-x-auto -mx-6 px-6 pb-1 lg:mx-0 lg:px-0 lg:flex-wrap"
          style={{ scrollbarWidth: 'none' }}
          data-testid="proof-tabs"
        >
          {TABS.map((t, i) => {
            const isActive = i === active;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={onTabKey}
                data-testid={`proof-tab-${t.id}`}
                className={`shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--ink))] ${
                  isActive
                    ? 'bg-[rgb(var(--accent))] text-white shadow-[0_8px_24px_-8px_rgb(var(--accent)_/_0.8)]'
                    : 'bg-white/[0.05] text-[rgb(var(--bg))]/80 border border-white/10 hover:bg-white/[0.1] hover:text-[rgb(var(--bg))]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-[rgb(var(--accent))]'}`} />
                {t.pill}
              </button>
            );
          })}
        </div>

        {/* content */}
        <div className="mt-8 lg:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* stat panel */}
          <motion.div
            key={`stat-${tab.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
            className="lg:col-span-4 flex flex-col rounded-2xl p-6 sm:p-7 border"
            style={{ borderColor: rule, backgroundColor: 'rgb(255 255 255 / 0.03)' }}
            data-testid="proof-stat-panel"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium"
                style={{
                  border: `1px solid ${tab.chapter === 'Client' ? 'rgb(var(--accent) / 0.5)' : rule}`,
                  color: tab.chapter === 'Client' ? 'color-mix(in srgb, rgb(var(--accent)) 55%, white)' : 'rgb(250 250 247 / 0.85)',
                }}
              >
                {tab.chapter} · {tab.client}
              </span>
              <span className="text-[12px]" style={{ color: dim }}>{tab.sector}</span>
            </div>

            <div
              className="font-mono text-[clamp(52px,6vw,76px)] font-semibold leading-none tracking-[-0.04em] mt-7"
              style={{ color: 'color-mix(in srgb, rgb(var(--accent)) 58%, white)' }}
              data-testid="proof-metric"
            >
              {tab.metric.prefix}{Math.round(metricVal)}{tab.metric.suffix}
            </div>

            <p className="text-[15px] leading-relaxed mt-5" style={{ color: soft }}>
              {tab.body}
            </p>

            <div className="grid grid-cols-2 gap-2.5 mt-auto pt-7">
              <div className="rounded-xl p-3.5 border" style={{ borderColor: rule }}>
                <div className="text-[10px] uppercase tracking-[0.1em] leading-tight" style={{ color: dim }}>{tab.before.label}</div>
                <div className="font-mono text-[17px] font-medium mt-1 text-[rgb(var(--bg))]">{tab.before.value}</div>
              </div>
              <div className="rounded-xl p-3.5 border border-[rgb(var(--accent))]/50 bg-[rgb(var(--accent))]/[0.14]">
                <div className="text-[10px] uppercase tracking-[0.1em] leading-tight" style={{ color: 'color-mix(in srgb, rgb(var(--accent)) 55%, white)' }}>{tab.after.label}</div>
                <div className="font-mono text-[17px] font-medium mt-1 text-[rgb(var(--bg))]">{tab.after.value}</div>
              </div>
            </div>
          </motion.div>

          {/* chart panel */}
          <div
            className="lg:col-span-8 rounded-2xl border p-4 sm:p-6 flex flex-col"
            style={{ borderColor: rule, backgroundColor: 'rgb(255 255 255 / 0.02)' }}
          >
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 mb-3">
              <div className="text-[13px] font-medium" style={{ color: 'rgb(250 250 247 / 0.9)' }}>
                {tab.chart.caption}
                <span className="font-mono text-[11px] ml-2 uppercase tracking-[0.08em]" style={{ color: dim }}>{tab.chart.window}</span>
              </div>
              <div className="flex items-center gap-4 text-[11.5px]" style={{ color: dim }}>
                <span className="inline-flex items-center gap-1.5"><span className="inline-block w-4 h-0.5 rounded-full" style={{ backgroundColor: 'rgb(250 250 247 / 0.42)' }} />Before</span>
                <span className="inline-flex items-center gap-1.5"><span className="inline-block w-4 h-0.5 rounded-full bg-[rgb(var(--accent))]" />With the SEO engine</span>
              </div>
            </div>

            <div ref={chartRef} className="w-full flex-1">
              {chartWidth > 0 && (
                <GrowthChart key={tab.id} tab={tab} width={chartWidth} play={inView} reduced={!!reduced} />
              )}
            </div>

            <div className="flex items-center justify-between gap-4 mt-3 pt-3 border-t font-mono text-[10.5px] tracking-[0.04em]" style={{ borderColor: rule, color: dim }}>
              <span>Hover or tap the curve to read each month</span>
              <span className="hidden sm:inline">{tab.chart.caption.startsWith('Daily') ? 'Traced from GSC' : 'Shape, not monthly actuals'}</span>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="flex flex-wrap items-center justify-between gap-x-7 gap-y-4 mt-12 lg:mt-14 pt-7 border-t" style={{ borderColor: rule }}>
          <Link
            href="#proof"
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[15px] font-medium transition-colors bg-[rgb(var(--bg))] text-[rgb(var(--ink))] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--ink))]"
            data-testid="proof-cta"
          >
            Read the case studies <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="text-[12px] leading-relaxed max-w-[52ch]" style={{ color: dim }}>
            Click curves traced from Google Search Console. Revenue curves show shape, not monthly actuals.
          </span>
        </div>
      </div>
    </section>
  );
}
