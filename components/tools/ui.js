'use client';

import { useEffect, useState } from 'react';
import { Check, Copy, Download, Link2 } from 'lucide-react';
import { CURRENCIES, encodeState, decodeState } from '@/lib/tools/calc';

// --- Currency ----------------------------------------------------------------
export function useCurrency(defaultCode = 'INR') {
  const [currency, setCurrency] = useState(defaultCode);
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('aj-currency');
      if (saved && CURRENCIES[saved]) setCurrency(saved);
    } catch {}
  }, []);
  const update = (c) => {
    setCurrency(c);
    try { window.localStorage.setItem('aj-currency', c); } catch {}
  };
  return [currency, update];
}

export function CurrencyToggle({ value, onChange }) {
  return (
    <div className="inline-flex rounded-full border border-[rgb(var(--line))] bg-[rgb(var(--surface))] p-0.5" role="group" aria-label="Currency" data-testid="currency-toggle">
      {Object.values(CURRENCIES).map((c) => (
        <button
          key={c.code}
          type="button"
          onClick={() => onChange(c.code)}
          data-testid={`currency-${c.code.toLowerCase()}`}
          className={`px-3 py-1 text-[12px] font-mono rounded-full transition ${value === c.code ? 'bg-[rgb(var(--ink))] text-white' : 'text-[rgb(var(--muted))] hover:text-[rgb(var(--ink))]'}`}
          aria-pressed={value === c.code}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

// --- Inputs -------------------------------------------------------------------
export const inputCls =
  'w-full min-w-0 h-10 rounded-md border border-[rgb(var(--line))] bg-[rgb(var(--surface))] px-2.5 text-[13px] font-mono tabular-nums text-[rgb(var(--ink))] placeholder:text-[rgb(var(--muted))]/60 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]/40 focus:border-[rgb(var(--accent))] transition';

export function Field({ label, hint, suffix, prefix, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-[12px] font-medium text-[rgb(var(--ink))] mb-1.5">{label}</span>
      <span className="relative block">
        {prefix ? <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-[rgb(var(--muted))] font-mono pointer-events-none">{prefix}</span> : null}
        {children}
        {suffix ? <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[12px] text-[rgb(var(--muted))] font-mono pointer-events-none">{suffix}</span> : null}
      </span>
      {hint ? <span className="block text-[11.5px] text-[rgb(var(--muted))] mt-1.5 leading-snug">{hint}</span> : null}
    </label>
  );
}

export function NumberInput({ value, onChange, min = 0, max, step = 'any', className = '', prefix, suffix, ...rest }) {
  return (
    <input
      type="number"
      inputMode="decimal"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputCls} ${prefix ? 'pl-6' : ''} ${suffix ? 'pr-7' : ''} ${className}`}
      {...rest}
    />
  );
}

export function TextInput({ value, onChange, className = '', ...rest }) {
  return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={`${inputCls} font-sans ${className}`} {...rest} />;
}

// --- Output -------------------------------------------------------------------
export function Stat({ label, value, sub, accent = false, tone, testId }) {
  const color = tone === 'neg' ? 'text-red-600' : tone === 'pos' ? 'text-[rgb(var(--positive))]' : accent ? 'text-[rgb(var(--accent))]' : 'text-[rgb(var(--ink))]';
  return (
    <div className={`rounded-lg border p-4 ${accent ? 'border-[rgb(var(--accent))]/30 bg-[rgb(var(--accent))]/[0.04]' : 'border-[rgb(var(--line))] bg-[rgb(var(--surface))]'}`} data-testid={testId}>
      <div className="text-[11px] uppercase tracking-[0.08em] text-[rgb(var(--muted))] mb-2">{label}</div>
      <div className={`font-mono text-[clamp(20px,2.2vw,28px)] font-medium leading-none tabular-nums ${color}`}>{value}</div>
      {sub ? <div className="text-[12px] text-[rgb(var(--muted))] mt-2 leading-snug">{sub}</div> : null}
    </div>
  );
}

export function Panel({ title, eyebrow, children, className = '', actions }) {
  return (
    <section className={`card-surface min-w-0 p-5 sm:p-7 ${className}`}>
      {(title || eyebrow || actions) && (
        <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
          <div>
            {eyebrow ? <span className="text-[11px] uppercase tracking-[0.12em] font-mono text-[rgb(var(--muted))] block mb-1.5">{eyebrow}</span> : null}
            {title ? <h2 className="text-[20px] font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{title}</h2> : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}

export function SmallButton({ children, onClick, icon: Icon, variant = 'ghost', className = '', ...rest }) {
  const base = 'inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12.5px] font-medium transition disabled:opacity-50';
  const styles = variant === 'solid'
    ? 'bg-[rgb(var(--ink))] text-white hover:bg-[rgb(var(--accent))]'
    : 'border border-[rgb(var(--line))] bg-[rgb(var(--surface))] text-[rgb(var(--ink))] hover:border-[rgb(var(--ink))]/40';
  return (
    <button type="button" onClick={onClick} className={`${base} ${styles} ${className}`} {...rest}>
      {Icon ? <Icon className="w-3.5 h-3.5" /> : null}
      {children}
    </button>
  );
}

// --- Share / copy / export --------------------------------------------------
export function useUrlState(key, state, setState, isReady) {
  // On first mount, hydrate from ?s= if present.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get('s');
      const decoded = decodeState(raw);
      if (decoded && decoded.__k === key) {
        const { __k, ...rest } = decoded;
        setState((prev) => ({ ...prev, ...rest }));
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shareUrl = () => {
    const s = encodeState({ __k: key, ...state });
    const url = new URL(window.location.href);
    url.searchParams.set('s', s);
    return url.toString();
  };
  return { shareUrl };
}

export function CopyButton({ getText, label = 'Copy', copiedLabel = 'Copied', icon = Copy, ...rest }) {
  const [done, setDone] = useState(false);
  return (
    <SmallButton
      icon={done ? Check : icon}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(getText());
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        } catch {}
      }}
      {...rest}
    >
      {done ? copiedLabel : label}
    </SmallButton>
  );
}

export function ShareButton({ getUrl }) {
  return <CopyButton getText={getUrl} label="Copy share link" copiedLabel="Link copied" icon={Link2} data-testid="share-link-button" />;
}

export function ExportButton({ onClick, label = 'Export CSV' }) {
  return <SmallButton icon={Download} onClick={onClick} data-testid="export-csv-button">{label}</SmallButton>;
}

export function Callout({ children, tone = 'info', testId }) {
  const cls = tone === 'warn'
    ? 'border-amber-300/60 bg-amber-50 text-amber-900'
    : 'border-[rgb(var(--accent))]/25 bg-[rgb(var(--accent))]/[0.04] text-[rgb(var(--ink))]';
  return <div className={`rounded-lg border p-4 text-[14px] leading-relaxed ${cls}`} data-testid={testId}>{children}</div>;
}
