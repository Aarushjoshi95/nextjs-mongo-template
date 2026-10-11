'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
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
    pts.push({ t: +t.toFixed(3), v: Math.max(0, v) });
  }
  pts[pts.length - 1].v = end;
  return pts;
}

const fmtRevenue = (v) => `$${Math.round(v)}K`;
const axisRevenue = (v) => (v === 0 ? '$0' : `$${v}K`);
const fmtClicksDay = (v) => (v >= 1 ? `${v.toFixed(1)}K/day` : `${Math.round(v * 1000)}/day`);
const fmtK = (v) => `${Math.round(v)}K`;
const axisK = (v) => (v === 0 ? '0' : `${v}K`);

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
      source: 'Shape, not monthly actuals',
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
      fmt: fmtClicksDay,
      fmtAxis: axisK,
      endLabel: '15K+/day',
      dots: false,
      source: 'Traced from GSC',
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
      source: 'Shape, not monthly actuals',
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
      fmt: fmtClicksDay,
      fmtAxis: axisK,
      endLabel: '24K/day',
      dots: false,
      source: 'Traced from GSC',
      series: buildSeries({ before: 3, after: 8, step: 0.125, base: 0.15, end: 24, curve: 2.4, noise: 0.14, beforeNoise: 0.35, seed: 41 }),
    },
  },
  {
    id: 'beauty-blog-clicks',
    chapter: 'Client',
    client: 'Beauty D2C',
    pill: 'Beauty brand · Blog clicks',
    sector: 'India’s leading beauty brand',
    slug: 'd2c-beauty-brand-157-percent-growth',
    metric: { value: 158, prefix: '+', suffix: '%' },
    body: 'blog clicks quarter over quarter (78.7K → 203K) from a product-led SEO engine built on content, technical and link velocity — leads up 25–80%.',
    before: { label: 'Blog clicks · quarter', value: '78.7K' },
    after: { label: 'Blog clicks · quarter', value: '203K' },
    chart: {
      caption: 'Monthly blog clicks · Google Search Console',
      window: '6 months',
      yTicks: [0, 25, 50, 75],
      xEvery: 2,
      fmt: fmtK,
      fmtAxis: axisK,
      endLabel: '68K/mo',
      dots: false,
      source: 'Traced from GSC, /blogs/',
      series: buildSeries({ before: 3, after: 6, step: 0.25, base: 26, end: 68, curve: 1.5, noise: 0.07, beforeNoise: 0.06, seed: 59 }),
    },
  },
  {
    id: 'luxury-nonbrand',
    chapter: 'Client',
    client: 'Luxury D2C',
    pill: 'Luxury D2C · Non-brand traffic',
    sector: 'India’s leading luxury D2C brand',
    slug: 'luxury-d2c-48-percent-growth-6-months',
    metric: { value: 53, prefix: '+', suffix: '%' },
    body: 'non-brand traffic (260K → 397K/mo) by moving money pages from positions 30–40 into the top 5 — direct attributable revenue up 30% a month.',
    before: { label: 'Non-brand · before', value: '260K/mo' },
    after: { label: 'Non-brand · after', value: '397K/mo' },
    chart: {
      caption: 'Monthly non-brand sessions',
      window: '6 months',
      yTicks: [0, 150, 300, 450],
      xEvery: 2,
      fmt: fmtK,
      fmtAxis: axisK,
      endLabel: '397K/mo',
      dots: true,
      source: 'GA + GSC, shape indexed to reported totals',
      series: buildSeries({ before: 3, after: 6, step: 0.5, base: 260, end: 397, curve: 1.35, noise: 0.025, beforeNoise: 0.02, seed: 73 }),
    },
  },
  {
    id: 'publisher-discover',
    chapter: 'Client',
    client: 'Lifestyle publisher',
    pill: 'Publisher · Google Discover',
    sector: 'Lifestyle publisher, DR < 25',
    slug: 'google-discover-1m-traffic-3-months',
    metric: { value: 164, prefix: '', suffix: 'K' },
    body: 'Discover clicks in 3 months (2.2M impressions) on a sub-DR-25 site — AMP Web Stories, an automated trend engine and a stack built for speed.',
    before: { label: 'Discover · before', value: '~0' },
    after: { label: 'Discover · 3 mo', value: '164K' },
    chart: {
      caption: 'Cumulative Discover clicks · top 10 articles',
      window: '3 months',
      yTicks: [0, 60, 120, 180],
      xEvery: 1,
      fmt: fmtK,
      fmtAxis: axisK,
      endLabel: '164K',
      dots: false,
      source: 'Traced from GSC Discover report',
      series: buildSeries({ before: 1, after: 3, step: 0.125, base: 0.4, end: 164, curve: 2.1, noise: 0.05, beforeNoise: 0.4, seed: 97 }),
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

function useElementSize() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => setSize({ width: el.clientWidth, height: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size.width, size.height];
}

/* ------------------------------------------------------------------ */
/*  Theme tokens (all derived from globals.css variables)              */
/* ------------------------------------------------------------------ */
const INK = 'rgb(var(--ink))';
const PAPER = 'rgb(var(--bg))';
const SURFACE = 'rgb(var(--surface))';
const ACCENT = 'rgb(var(--accent))';
const MUTED = 'rgb(var(--muted))';
const LINE = 'rgb(var(--line))';
const EASE = [0.22, 1, 0.36, 1];

/* ------------------------------------------------------------------ */
/*  Chart                                                              */
/* ------------------------------------------------------------------ */
function GrowthChart({ tab, width, availHeight = 0, play, reduced }) {
  const [hover, setHover] = useState(null);
  const { series, yTicks, xEvery, fmt, fmtAxis, endLabel, dots } = tab.chart;

  const compact = width < 560;
  const height = Math.max(compact ? 240 : 330, Math.floor(availHeight));
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
  const fmtT = (t) => Math.round(t * 10) / 10;

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
            <stop offset="0%" style={{ stopColor: ACCENT, stopOpacity: 0.26 }} />
            <stop offset="100%" style={{ stopColor: ACCENT, stopOpacity: 0 }} />
          </linearGradient>
        </defs>

        {/* pre-engagement shading */}
        <rect x={m.left} y={m.top} width={beforeW} height={geo.ih} style={{ fill: 'rgb(var(--ink) / 0.03)' }} />
        {beforeW > 70 && (
          <text x={m.left + beforeW / 2} y={m.top + 14} textAnchor="middle" className="font-mono" fontSize="10" letterSpacing="0.1em" style={{ fill: 'rgb(var(--muted) / 0.7)' }}>
            BEFORE
          </text>
        )}

        {/* grid + y labels */}
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={m.left} x2={width - m.right} y1={geo.y(v)} y2={geo.y(v)} style={{ stroke: v === 0 ? 'rgb(var(--ink) / 0.18)' : LINE }} strokeDasharray={v === 0 ? '0' : '2 4'} />
            <text x={m.left - 10} y={geo.y(v) + 4} textAnchor="end" className="font-mono" fontSize="11" style={{ fill: MUTED }}>
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
            style={{ fill: tk.t === 0 ? INK : MUTED }}
            fontWeight={tk.t === 0 ? 500 : 400}
          >
            {tk.label}
          </text>
        ))}

        {/* kick-off divider */}
        <line x1={geo.x(0)} x2={geo.x(0)} y1={m.top} y2={geo.baseY} style={{ stroke: 'rgb(var(--ink) / 0.22)' }} strokeDasharray="3 4" />

        {/* before line */}
        <motion.path
          d={geo.beforePath}
          fill="none"
          style={{ stroke: 'rgb(var(--muted) / 0.6)' }}
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
            style={{ fill: SURFACE, stroke: ACCENT }}
            strokeWidth="1.75"
            initial={{ opacity: 0 }}
            animate={play ? { opacity: 1 } : {}}
            transition={{ duration: 0.25, delay: reduced ? 0 : 0.45 + ((i + 1) / arr.length) * drawDur * 0.92 }}
          />
        ))}

        {/* kick-off brand marker (mirrors the header logo) */}
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
          <circle cx={geo.start.x} cy={geo.start.y} r="13" style={{ fill: INK }} />
          <text x={geo.start.x} y={geo.start.y + 4.5} textAnchor="middle" fontSize="13" fontWeight="600" style={{ fill: PAPER, fontFamily: 'Inter Tight, Inter, sans-serif' }}>
            A
          </text>
        </motion.g>

        {/* end label */}
        <motion.g
          initial={{ opacity: 0, y: 6 }}
          animate={play ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: reduced ? 0 : 0.45 + drawDur }}
        >
          <circle cx={geo.last.x} cy={geo.last.y} r="4.5" style={{ fill: ACCENT, stroke: SURFACE }} strokeWidth="2" />
          <text x={geo.last.x - 12} y={geo.last.y - 10} textAnchor="end" className="font-mono" fontSize="12.5" fontWeight="500" style={{ fill: INK }}>
            {endLabel}
          </text>
        </motion.g>

        {/* hover crosshair */}
        {hp && (
          <g style={{ pointerEvents: 'none' }}>
            <line x1={hp.x} x2={hp.x} y1={m.top} y2={geo.baseY} style={{ stroke: 'rgb(var(--ink) / 0.35)' }} strokeDasharray="2 3" />
            <circle cx={hp.x} cy={hp.y} r="9" style={{ fill: hp.t > 0 ? ACCENT : MUTED }} opacity="0.16" />
            <circle cx={hp.x} cy={hp.y} r="4.5" style={{ fill: hp.t > 0 ? ACCENT : MUTED, stroke: SURFACE }} strokeWidth="2" />
          </g>
        )}
      </svg>

      {/* tooltip (inverse, like the site's primary button) */}
      {hp && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg px-3 py-2 shadow-lg"
          style={{
            left: tipRight ? hp.x - 12 : hp.x + 12,
            top: Math.max(0, hp.y - 50),
            transform: tipRight ? 'translateX(-100%)' : 'none',
            backgroundColor: INK,
            color: PAPER,
          }}
          data-testid="proof-chart-tooltip"
        >
          <div className="text-[10.5px] uppercase tracking-[0.1em] font-mono" style={{ color: 'rgb(var(--bg) / 0.6)' }}>
            {hp.t > 0 ? `+${fmtT(hp.t)} mo` : hp.t === 0 ? 'Kick-off' : `${fmtT(hp.t)} mo · before`}
          </div>
          <div className="font-mono text-[15px] font-medium leading-tight mt-0.5" style={{ color: hp.t > 0 ? 'color-mix(in srgb, rgb(var(--accent)) 55%, white)' : PAPER }}>
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
const ROTATE_MS = 6500;

export default function ProofResults() {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true); // turns off for good once a visitor picks a tab
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [cycle, setCycle] = useState(0); // restarts the pill progress bar
  const [chartRef, chartWidth, chartAvailH] = useElementSize();
  const sectionRef = useRef(null);
  const stripRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-15% 0px -15% 0px' });
  const reduced = useReducedMotion();
  const tab = TABS[active];

  const metricVal = useCountUp(tab.metric.value, { start: inView, reduced });

  const rotating = autoplay && inView && !hovering && !hidden && !reduced;

  // pause when the browser tab is in the background
  useEffect(() => {
    const onVis = () => setHidden(document.visibilityState === 'hidden');
    onVis();
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // advance every ROTATE_MS while rotating
  useEffect(() => {
    if (!rotating) return undefined;
    const id = setTimeout(() => {
      setActive((a) => (a + 1) % TABS.length);
      setCycle((c) => c + 1);
    }, ROTATE_MS);
    return () => clearTimeout(id);
  }, [rotating, active, cycle]);

  // keep the active pill visible inside the carousel strip
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const pill = strip.querySelectorAll('[role="tab"]')[active];
    if (!pill) return;
    const target = pill.offsetLeft - (strip.clientWidth - pill.offsetWidth) / 2;
    strip.scrollTo({ left: Math.max(0, target), behavior: reduced ? 'auto' : 'smooth' });
  }, [active, reduced]);

  const pickTab = (i) => {
    setAutoplay(false);
    setActive((i + TABS.length) % TABS.length);
  };

  const onTabKey = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = e.key === 'ArrowRight' ? (active + 1) % TABS.length : (active - 1 + TABS.length) % TABS.length;
    pickTab(next);
    e.currentTarget.parentElement?.querySelectorAll('[role="tab"]')[next]?.focus();
  };

  const iconBtn = 'shrink-0 w-9 h-9 inline-flex items-center justify-center rounded-full border border-[rgb(var(--line))] bg-[rgb(var(--surface))] text-[rgb(var(--ink))] hover:border-[rgb(var(--ink))] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))] focus-visible:ring-offset-2';

  return (
    <section
      id="results"
      ref={sectionRef}
      className="relative overflow-clip section-y border-t border-[rgb(var(--line))]"
      data-testid="proof-results-section"
    >
      {/* soft accent glow, same treatment as the booking modal */}
      <div aria-hidden className="pointer-events-none absolute -top-40 right-[-10%] w-[560px] h-[560px] rounded-full bg-[rgb(var(--accent))]/[0.06] blur-3xl" />

      <div className="container-max relative">
        {/* heading */}
        <div className="max-w-3xl">
          <span className="eyebrow mb-6">Receipts, not theory</span>
          <h2 className="text-[clamp(32px,5vw,56px)] font-semibold leading-[1.07] tracking-tight">
            Proof, not just <span className="text-[rgb(var(--accent))]">theory</span>.
          </h2>
          <p className="text-[rgb(var(--muted))] text-[17px] mt-5 max-w-2xl">
            Seven chapters, in-house and client-side. Each one tied to a number the business could count — revenue, non-brand traffic or a channel built from zero.
          </p>
        </div>

        {/* interactive area: hovering / focusing anything inside pauses the auto-rotation */}
        <div
          onPointerEnter={() => setHovering(true)}
          onPointerLeave={() => setHovering(false)}
          onFocusCapture={() => setHovering(true)}
          onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHovering(false); }}
          data-testid="proof-interactive"
          data-rotating={rotating ? 'true' : 'false'}
        >
          {/* carousel strip */}
          <div className="mt-10 lg:mt-12 flex items-center gap-2">
            <button type="button" onClick={() => pickTab(active - 1)} aria-label="Previous result" className={`${iconBtn} hidden sm:inline-flex`} data-testid="proof-prev">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div
              ref={stripRef}
              role="tablist"
              aria-label="Growth metrics"
              className="flex gap-2 overflow-x-auto pb-1 pr-4 min-w-0 flex-1 [mask-image:linear-gradient(to_right,black_92%,transparent)]"
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
                    onClick={() => pickTab(i)}
                    onKeyDown={onTabKey}
                    data-testid={`proof-tab-${t.id}`}
                    className={`relative overflow-hidden shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-medium transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))] focus-visible:ring-offset-2 ${
                      isActive
                        ? 'bg-[rgb(var(--ink))] border-[rgb(var(--ink))] text-[rgb(var(--bg))]'
                        : 'bg-[rgb(var(--surface))] border-[rgb(var(--line))] text-[rgb(var(--muted))] hover:border-[rgb(var(--ink))] hover:text-[rgb(var(--ink))]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[rgb(var(--accent))]' : 'bg-[rgb(var(--line))]'}`} />
                    {t.pill}
                    {isActive && autoplay && !reduced && (
                      <span
                        key={`${active}-${cycle}`}
                        aria-hidden
                        className="absolute left-0 bottom-0 h-[2px] bg-[rgb(var(--accent))]"
                        style={{ animation: `proof-progress ${ROTATE_MS}ms linear forwards`, animationPlayState: rotating ? 'running' : 'paused' }}
                        data-testid="proof-tab-progress"
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <button type="button" onClick={() => pickTab(active + 1)} aria-label="Next result" className={`${iconBtn} hidden sm:inline-flex`} data-testid="proof-next">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setAutoplay((v) => !v)}
              aria-pressed={!autoplay}
              aria-label={autoplay ? 'Pause auto-rotation' : 'Resume auto-rotation'}
              title={autoplay ? 'Pause auto-rotation' : 'Resume auto-rotation'}
              data-testid="proof-autoplay-toggle"
              className={iconBtn}
            >
              {autoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 translate-x-px" />}
            </button>
          </div>

          {/* position + counter */}
          <div className="mt-3 flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[rgb(var(--muted))]" data-testid="proof-counter">
              {String(active + 1).padStart(2, '0')} / {String(TABS.length).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-1.5" aria-hidden>
              {TABS.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  tabIndex={-1}
                  onClick={() => pickTab(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'w-6 bg-[rgb(var(--ink))]' : 'w-1.5 bg-[rgb(var(--line))] hover:bg-[rgb(var(--muted))]'}`}
                />
              ))}
            </div>
          </div>

          {/* content */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* stat panel */}
            <motion.div
              key={`stat-${tab.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
              className="lg:col-span-4 card-surface p-7 sm:p-8 flex flex-col"
              data-testid="proof-stat-panel"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className={`pill ${tab.chapter === 'Client' ? 'pill-coming' : ''}`}>
                  {tab.chapter} · {tab.client}
                </span>
                <span className="text-[12px] text-[rgb(var(--muted))]">{tab.sector}</span>
              </div>

              <div
                className="font-mono text-[clamp(50px,5.6vw,72px)] font-medium leading-none tracking-[-0.04em] mt-7 text-[rgb(var(--accent))]"
                data-testid="proof-metric"
              >
                {tab.metric.prefix}{Math.round(metricVal)}{tab.metric.suffix}
              </div>

              <p className="text-[15px] leading-relaxed mt-5 text-[rgb(var(--muted))]">
                {tab.body}
              </p>

              <div className="grid grid-cols-2 gap-3 mt-auto pt-7">
                <div className="rounded-md border border-[rgb(var(--line))] p-4">
                  <div className="text-[11px] uppercase tracking-wider text-[rgb(var(--muted))] leading-tight mb-1">{tab.before.label}</div>
                  <div className="font-mono text-[18px]">{tab.before.value}</div>
                </div>
                <div className="rounded-md border border-[rgb(var(--accent))]/30 bg-[rgb(var(--accent))]/[0.05] p-4">
                  <div className="text-[11px] uppercase tracking-wider text-[rgb(var(--accent))] leading-tight mb-1">{tab.after.label}</div>
                  <div className="font-mono text-[18px] text-[rgb(var(--accent))]">{tab.after.value}</div>
                </div>
              </div>

              {tab.slug && (
                <Link href={`/case-studies/${tab.slug}`} className="link-underline mt-6 text-[14px] self-start" data-testid="proof-case-link">
                  Read the full case study <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </motion.div>

            {/* chart panel */}
            <div className="lg:col-span-8 card-surface p-4 sm:p-6 flex flex-col">
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 mb-3">
                <div className="text-[13px] font-medium">
                  {tab.chart.caption}
                  <span className="font-mono text-[11px] ml-2 uppercase tracking-[0.08em] text-[rgb(var(--muted))]">{tab.chart.window}</span>
                </div>
                <div className="flex items-center gap-4 text-[11.5px] text-[rgb(var(--muted))]">
                  <span className="inline-flex items-center gap-1.5"><span className="inline-block w-4 h-0.5 rounded-full bg-[rgb(var(--muted))]/60" />Before</span>
                  <span className="inline-flex items-center gap-1.5"><span className="inline-block w-4 h-0.5 rounded-full bg-[rgb(var(--accent))]" />With the SEO engine</span>
                </div>
              </div>

              <div ref={chartRef} className="w-full flex-1">
                {chartWidth > 0 && (
                  <GrowthChart key={tab.id} tab={tab} width={chartWidth} availHeight={chartAvailH} play={inView} reduced={!!reduced} />
                )}
              </div>

              <div className="flex items-center justify-between gap-4 mt-3 pt-3 border-t border-[rgb(var(--line))] font-mono text-[10.5px] tracking-[0.04em] text-[rgb(var(--muted))]">
                <span>Hover or tap the curve to read each month</span>
                <span className="hidden sm:inline">{tab.chart.source}</span>
              </div>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="flex flex-wrap items-center justify-between gap-x-7 gap-y-4 mt-12 lg:mt-14 pt-7 border-t border-[rgb(var(--line))]">
          <Link href="#proof" className="btn-primary" data-testid="proof-cta">
            Read the case studies <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="text-[12px] leading-relaxed max-w-[52ch] text-[rgb(var(--muted))]">
            Click curves traced from Google Search Console. Revenue curves show shape, not monthly actuals.
          </span>
        </div>
      </div>
    </section>
  );
}
