import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * Builds a smooth SVG area + line path from an array of normalised y values (0..1).
 * Draws a hockey-stick growth curve with faint vertical bars underneath,
 * matching the "Proof, not just theory" reference layout.
 */
function Sparkline({ data, w = 260, h = 110 }) {
  const pad = 2;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;
  const n = data.length;
  const step = innerW / (n - 1);

  const points = data.map((v, i) => {
    const x = pad + i * step;
    const y = pad + innerH - v * innerH;
    return [x, y];
  });

  // Smooth cubic path through the points.
  const linePath = points.reduce((acc, [x, y], i) => {
    if (i === 0) return `M ${x.toFixed(1)} ${y.toFixed(1)}`;
    const [px, py] = points[i - 1];
    const cx = (px + x) / 2;
    return `${acc} C ${cx.toFixed(1)} ${py.toFixed(1)} ${cx.toFixed(1)} ${y.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }, '');

  const areaPath = `${linePath} L ${(pad + innerW).toFixed(1)} ${(pad + innerH).toFixed(1)} L ${pad} ${(pad + innerH).toFixed(1)} Z`;
  const gid = `spark-${Math.round(data[Math.floor(n / 2)] * 1000)}-${n}`;

  // faint vertical bars (like the reference), heights follow the curve
  const bars = data.map((v, i) => {
    const x = pad + i * step;
    const barH = v * innerH;
    return { x, y: pad + innerH - barH, barH };
  });

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" aria-hidden="true" className="block">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(245,166,35)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="rgb(245,166,35)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {bars.map((b, i) => (
        <rect key={i} x={b.x - 0.5} y={b.y} width="1" height={b.barH} fill="rgb(245,166,35)" opacity="0.1" />
      ))}
      <path d={areaPath} fill={`url(#${gid})`} />
      <path d={linePath} fill="none" stroke="rgb(245,166,35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const results = [
  {
    badge: 'In-House · Traya',
    metric: '$450K',
    body: 'attributable revenue built from $0 — D0 acquisition driven through SEO-led initiatives at a D2C hair-health brand',
    data: [0.03, 0.04, 0.05, 0.06, 0.08, 0.11, 0.15, 0.2, 0.27, 0.36, 0.48, 0.62, 0.78, 0.92, 1],
  },
  {
    badge: 'In-House · Traya',
    metric: '21×',
    body: 'non-brand organic traffic scaled in 2 years, starting from scratch — an SEO engine with 6×+ attributable ROI',
    data: [0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.1, 0.14, 0.19, 0.26, 0.37, 0.52, 0.7, 0.88, 1],
  },
  {
    badge: 'Client Engagement · EdTech',
    metric: '$700K+',
    body: 'revenue generated in just 8 months, from $0 — a client-facing SEO engagement with a K-12 EdTech brand',
    data: [0.04, 0.05, 0.07, 0.09, 0.12, 0.16, 0.22, 0.3, 0.4, 0.52, 0.65, 0.78, 0.88, 0.95, 1],
  },
  {
    badge: 'Client Engagement · EdTech',
    metric: '20%',
    body: 'of net business the organic channel came to contribute — from a standing start inside 8 months',
    data: [0.05, 0.06, 0.08, 0.1, 0.13, 0.17, 0.23, 0.3, 0.39, 0.5, 0.62, 0.74, 0.85, 0.94, 1],
  },
];

export default function ProofResults() {
  return (
    <section
      id="results"
      className="border-t border-b"
      style={{ backgroundColor: 'rgb(13 20 33)', borderColor: 'rgb(31 42 61)' }}
    >
      <div className="container-max section-y">
        <div className="max-w-3xl mb-12 lg:mb-16">
          <span
            className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.12em] font-medium"
            style={{ color: 'rgb(148 163 184)' }}
          >
            <span className="inline-block h-px w-6" style={{ backgroundColor: 'rgb(245 166 35)' }} />
            Receipts, not theory
          </span>
          <h2 className="text-[clamp(32px,5vw,60px)] font-semibold leading-[1.04] tracking-tight mt-5" style={{ color: 'rgb(248 250 252)' }}>
            Proof, not just theory.
          </h2>
          <p className="text-[17px] mt-5 leading-relaxed" style={{ color: 'rgb(148 163 184)' }}>
            Two chapters, both starting at zero. One in-house, one client-facing — each tied to revenue the business could count.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4">
          {results.map((r, i) => (
            <div
              key={i}
              className="flex flex-col py-8 lg:py-0 lg:px-8 lg:first:pl-0 lg:last:pr-0 border-t border-[rgb(31,42,61)] first:border-t-0 lg:border-t-0 lg:border-l lg:border-l-[rgb(31,42,61)] lg:first:border-l-0"
            >
              {/* badge */}
              <span
                className="self-start inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium"
                style={{ border: '1px solid rgb(51 65 85)', color: 'rgb(203 213 225)' }}
              >
                {r.badge}
              </span>

              {/* metric */}
              <div
                className="font-mono text-[clamp(44px,5vw,60px)] font-semibold leading-none tracking-tight mt-8"
                style={{ color: 'rgb(245 166 35)' }}
              >
                {r.metric}
              </div>

              {/* body */}
              <p className="text-[14px] leading-relaxed mt-5 mb-7 flex-1" style={{ color: 'rgb(148 163 184)' }}>
                {r.body}
              </p>

              {/* sparkline */}
              <div className="mt-auto -mx-1">
                <Sparkline data={r.data} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 lg:mt-16">
          <Link
            href="#proof"
            className="inline-flex items-center gap-2 text-[15px] font-medium underline underline-offset-4 decoration-1"
            style={{ color: 'rgb(248 250 252)' }}
          >
            See the client case studies
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
