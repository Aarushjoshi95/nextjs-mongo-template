// Pure helpers shared by the calculators. No React here.

export const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', locale: 'en-IN', label: 'INR ₹' },
  USD: { code: 'USD', symbol: '$', locale: 'en-US', label: 'USD $' },
};

export function fmtMoney(n, currency = 'INR', opts = {}) {
  const c = CURRENCIES[currency] || CURRENCIES.INR;
  const v = Number.isFinite(n) ? n : 0;
  const abs = Math.abs(v);
  const maximumFractionDigits = opts.compact ? 1 : abs < 100 ? 2 : 0;
  try {
    return new Intl.NumberFormat(c.locale, {
      style: 'currency',
      currency: c.code,
      maximumFractionDigits,
      minimumFractionDigits: 0,
      notation: opts.compact ? 'compact' : 'standard',
    }).format(v);
  } catch {
    return `${c.symbol}${Math.round(v).toLocaleString()}`;
  }
}

export function fmtNum(n, currency = 'INR', digits = 0) {
  const c = CURRENCIES[currency] || CURRENCIES.INR;
  const v = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat(c.locale, { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(v);
}

export function fmtPct(n, digits = 1) {
  const v = Number.isFinite(n) ? n : 0;
  return `${v.toFixed(digits)}%`;
}

export function num(v, fallback = 0) {
  if (v === '' || v === null || v === undefined) return fallback;
  const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/[,\s]/g, ''));
  return Number.isFinite(n) ? n : fallback;
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

// --- URL state -------------------------------------------------------------
// Encode calculator state into a short base64url string for shareable links.
export function encodeState(obj) {
  try {
    const json = JSON.stringify(obj);
    const b64 = typeof window !== 'undefined' ? window.btoa(unescape(encodeURIComponent(json))) : Buffer.from(json).toString('base64');
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch {
    return '';
  }
}

export function decodeState(str) {
  if (!str) return null;
  try {
    const b64 = str.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((str.length + 3) % 4);
    const json = typeof window !== 'undefined' ? decodeURIComponent(escape(window.atob(b64))) : Buffer.from(b64, 'base64').toString('utf8');
    const obj = JSON.parse(json);
    return obj && typeof obj === 'object' ? obj : null;
  } catch {
    return null;
  }
}

export function csvEscape(v) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(headers, rows) {
  return [headers.map(csvEscape).join(','), ...rows.map((r) => r.map(csvEscape).join(','))].join('\n');
}

export function downloadText(filename, text, mime = 'text/csv;charset=utf-8') {
  if (typeof window === 'undefined') return;
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// --- CTR curve -------------------------------------------------------------
// Blended organic CTR by position. Mid-point of several public 2024–25 studies
// (Advanced Web Ranking, First Page Sage, Backlinko). Editable in the tool.
export const DEFAULT_CTR_CURVE = [
  27.6, 15.8, 11.0, 8.4, 6.3, 4.9, 3.9, 3.3, 2.7, 2.4, // 1–10
  1.6, 1.4, 1.2, 1.1, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5, // 11–20
];

export function ctrForPosition(pos, curve = DEFAULT_CTR_CURVE) {
  const p = Math.round(num(pos, 0));
  if (p < 1) return 0;
  if (p <= curve.length) return curve[p - 1];
  if (p <= 30) return 0.35;
  if (p <= 50) return 0.15;
  return 0.05;
}

export function uid() {
  return Math.random().toString(36).slice(2, 9);
}
