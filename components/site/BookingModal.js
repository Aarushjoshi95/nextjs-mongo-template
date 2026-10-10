'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export const CAL_LINK = 'https://cal.com/aarush';

// ---------- Context ----------
const BookingContext = createContext({ open: false, openBooking: () => {}, closeBooking: () => {} });

export function BookingProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openBooking = useCallback(() => setOpen(true), []);
  const closeBooking = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ open, openBooking, closeBooking }), [open, openBooking, closeBooking]);
  return (
    <BookingContext.Provider value={value}>
      {children}
      <BookingDialog open={open} onOpenChange={setOpen} />
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}

// Any CTA on the site that should open the pop-up form.
export function BookButton({ children, className = 'btn-primary', onClick, ...rest }) {
  const { openBooking } = useBooking();
  return (
    <button
      type="button"
      className={className}
      onClick={(e) => { onClick?.(e); openBooking(); }}
      data-testid="book-discovery-call-button"
      {...rest}
    >
      {children}
    </button>
  );
}

// ---------- Form data ----------
const COUNTRIES = ['India', 'United States', 'United Kingdom', 'United Arab Emirates', 'Singapore', 'Australia', 'Canada', 'Germany', 'Netherlands', 'France', 'Saudi Arabia', 'Indonesia', 'Philippines', 'Malaysia', 'Nigeria', 'South Africa', 'Brazil', 'Other'];

const COUNTRY_CODES = [
  { code: '+91', label: 'IN +91' }, { code: '+1', label: 'US/CA +1' }, { code: '+44', label: 'UK +44' }, { code: '+971', label: 'AE +971' },
  { code: '+65', label: 'SG +65' }, { code: '+61', label: 'AU +61' }, { code: '+49', label: 'DE +49' }, { code: '+31', label: 'NL +31' },
  { code: '+33', label: 'FR +33' }, { code: '+966', label: 'SA +966' }, { code: '+62', label: 'ID +62' }, { code: '+63', label: 'PH +63' },
  { code: '+60', label: 'MY +60' }, { code: '+234', label: 'NG +234' }, { code: '+27', label: 'ZA +27' }, { code: '+55', label: 'BR +55' },
];

const SOURCES = ['Google search', 'ChatGPT or another AI assistant', 'LinkedIn', 'Referral from a founder or friend', 'An event or webinar', 'Newsletter', 'Other'];

const WHAT_YOU_GET = [
  { h: 'A read on where you stand', b: 'Your top buying prompts, run live across ChatGPT, Claude, Gemini and Perplexity.' },
  { h: 'Who gets named instead of you', b: 'The competitors and third-party sources the models lean on in your category.' },
  { h: 'The gap, in plain numbers', b: 'Mention rate, citation rate and share of voice per engine. No deck, no pitch.' },
  { h: 'What to fix first', b: 'An ordered list of the highest-leverage changes, whether or not we work together.' },
];

const initialForm = { firstName: '', lastName: '', email: '', company: '', country: 'India', countryCode: '+91', phone: '', source: '', message: '', website_url: '' };

const fieldLabel = 'block font-mono text-[11px] uppercase tracking-[0.12em] text-[rgb(var(--muted))] mb-1.5';
const fieldInput = 'w-full bg-transparent border-0 border-b border-[rgb(var(--line))] focus:border-[rgb(var(--ink))] focus:outline-none focus:ring-0 py-2 text-[15px] placeholder:text-[rgb(var(--muted))]/60 rounded-none transition-colors';
const fieldError = 'text-[12px] text-red-600 mt-1';

function validate(f) {
  const e = {};
  if (!f.firstName.trim()) e.firstName = 'Required';
  if (!f.lastName.trim()) e.lastName = 'Required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Enter a valid email';
  if (!f.countryCode) e.countryCode = 'Required';
  if (!/^\d{6,15}$/.test(f.phone.replace(/[\s\-().]/g, ''))) e.phone = 'Enter 6–15 digits';
  if (!f.source) e.source = 'Please pick one';
  return e;
}

// ---------- Dialog ----------
export function BookingDialog({ open, onOpenChange }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (!open) {
      // Reset after the close animation so a re-open starts clean.
      const t = setTimeout(() => { setStatus('idle'); setErrors({}); setServerError(''); setForm(initialForm); }, 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  const set = (k) => (e) => {
    const v = e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((er) => { const n = { ...er }; delete n[k]; return n; });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate(form);
    if (Object.keys(v).length) { setErrors(v); return; }
    setStatus('submitting');
    setServerError('');
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data?.errors) setErrors(data.errors);
        setServerError(data?.error === 'Validation failed' ? 'Please check the highlighted fields.' : (data?.error || 'Something went wrong. Please try again.'));
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch {
      setServerError('Network error. Please try again.');
      setStatus('error');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1040px] w-[calc(100vw-2rem)] p-0 gap-0 overflow-hidden rounded-2xl border-[rgb(var(--line))] bg-[rgb(var(--surface))] max-h-[calc(100vh-2rem)] overflow-y-auto" data-testid="booking-dialog">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          {/* LEFT — pitch */}
          <div className="relative p-7 sm:p-9 lg:p-11 bg-[rgb(var(--bg))] border-b lg:border-b-0 lg:border-r border-[rgb(var(--line))] overflow-hidden">
            <div aria-hidden className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[rgb(var(--accent))]/[0.08] blur-3xl" />
            <div aria-hidden className="absolute bottom-0 -left-20 w-60 h-60 rounded-full bg-[rgb(var(--accent))]/[0.06] blur-3xl" />
            <div className="relative">
              <span className="eyebrow mb-6">Discovery call · 30 minutes</span>
              <DialogTitle className="text-[clamp(28px,3.4vw,40px)] font-semibold leading-[1.05] tracking-[-0.02em]">
                Ask, and find out if AI <span className="text-[rgb(var(--accent))]">recommends</span> you.
              </DialogTitle>
              <DialogDescription className="text-[15px] text-[rgb(var(--muted))] leading-relaxed mt-5 max-w-md">
                I will reach out within one working day to understand who you sell to and what you have already tried, so the call is specific to your category, not a template.
              </DialogDescription>
              <div className="hidden lg:block mt-10">
                <div className="text-[13px] font-semibold tracking-tight mb-5">What you get in the 30 minutes</div>
                <ul className="divide-y divide-[rgb(var(--line))]">
                  {WHAT_YOU_GET.map((w, i) => (
                    <li key={i} className="py-3.5 flex gap-3">
                      <span className="font-mono text-[12px] text-[rgb(var(--accent))] mt-0.5">0{i + 1}</span>
                      <div>
                        <div className="text-[13px] font-semibold uppercase tracking-[0.04em]">{w.h}</div>
                        <div className="text-[13px] text-[rgb(var(--muted))] mt-1 leading-relaxed">{w.b}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT — form */}
          <div className="p-7 sm:p-9 lg:p-11">
            {status === 'success' ? (
              <div className="h-full flex flex-col justify-center min-h-[420px]" data-testid="booking-success">
                <span className="w-12 h-12 rounded-full bg-[rgb(var(--positive))]/15 text-[rgb(var(--positive))] flex items-center justify-center mb-6"><Check className="w-6 h-6" /></span>
                <h3 className="text-[28px] font-semibold tracking-tight leading-tight">Thanks, {form.firstName}. You are on my list.</h3>
                <p className="text-[rgb(var(--muted))] text-[15px] leading-relaxed mt-4 max-w-md">I will reach out at <span className="text-[rgb(var(--ink))] font-medium">{form.email}</span> within one working day. Before we talk, I will run your top buying prompts across the four engines.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={CAL_LINK} target="_blank" rel="noreferrer noopener" className="btn-primary" data-testid="booking-pick-slot">Pick a slot now<ArrowUpRight className="w-4 h-4" /></a>
                  <button type="button" className="btn-ghost" onClick={() => onOpenChange(false)}>Close</button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate data-testid="booking-form">
                <h3 className="text-[24px] font-semibold tracking-tight">Book your discovery call.</h3>
                <div className="flex flex-wrap gap-2 mt-3 mb-8">
                  {['Not a deck', 'Not a pitch', 'Not a generic audit report'].map((t) => (
                    <span key={t} className="pill text-[11px] uppercase tracking-[0.08em] font-mono border-[rgb(var(--accent))]/30 text-[rgb(var(--accent))] bg-[rgb(var(--accent))]/[0.05]">{t}</span>
                  ))}
                </div>

                {/* honeypot */}
                <input type="text" name="website_url" value={form.website_url} onChange={set('website_url')} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-6">
                  <div>
                    <label htmlFor="bk-first" className={fieldLabel}>First name*</label>
                    <input id="bk-first" name="firstName" value={form.firstName} onChange={set('firstName')} className={fieldInput} placeholder="Aditi" autoComplete="given-name" data-testid="booking-first-name" />
                    {errors.firstName && <p className={fieldError}>{errors.firstName}</p>}
                  </div>
                  <div>
                    <label htmlFor="bk-last" className={fieldLabel}>Last name*</label>
                    <input id="bk-last" name="lastName" value={form.lastName} onChange={set('lastName')} className={fieldInput} placeholder="Sharma" autoComplete="family-name" data-testid="booking-last-name" />
                    {errors.lastName && <p className={fieldError}>{errors.lastName}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="bk-email" className={fieldLabel}>Work email*</label>
                    <input id="bk-email" name="email" type="email" value={form.email} onChange={set('email')} className={fieldInput} placeholder="you@company.com" autoComplete="email" data-testid="booking-email" />
                    {errors.email && <p className={fieldError}>{errors.email}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="bk-company" className={fieldLabel}>Company or website</label>
                    <input id="bk-company" name="company" value={form.company} onChange={set('company')} className={fieldInput} placeholder="acme.com" autoComplete="organization" data-testid="booking-company" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="bk-country" className={fieldLabel}>Country</label>
                    <select id="bk-country" name="country" value={form.country} onChange={set('country')} className={fieldInput} data-testid="booking-country">
                      {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2 grid grid-cols-[120px_1fr] gap-4">
                    <div>
                      <label htmlFor="bk-code" className={fieldLabel}>Code*</label>
                      <select id="bk-code" name="countryCode" value={form.countryCode} onChange={set('countryCode')} className={fieldInput} data-testid="booking-country-code">
                        {COUNTRY_CODES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
                      </select>
                      {errors.countryCode && <p className={fieldError}>{errors.countryCode}</p>}
                    </div>
                    <div>
                      <label htmlFor="bk-phone" className={fieldLabel}>Contact number*</label>
                      <input id="bk-phone" name="phone" type="tel" inputMode="numeric" value={form.phone} onChange={set('phone')} className={fieldInput} placeholder="98765 43210" autoComplete="tel-national" data-testid="booking-phone" />
                      {errors.phone && <p className={fieldError}>{errors.phone}</p>}
                    </div>
                    <p className="col-span-2 text-[12px] text-[rgb(var(--muted))] -mt-2">I call first to understand your setup, so the prompt set is built around your business and not a template.</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="bk-source" className={fieldLabel}>How did you hear about me?*</label>
                    <select id="bk-source" name="source" value={form.source} onChange={set('source')} className={`${fieldInput} ${!form.source ? 'text-[rgb(var(--muted))]/70' : ''}`} data-testid="booking-source">
                      <option value="">Select one</option>
                      {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.source && <p className={fieldError}>{errors.source}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="bk-message" className={fieldLabel}>The one question you want answered <span className="normal-case tracking-normal">(optional)</span></label>
                    <textarea id="bk-message" name="message" rows={2} value={form.message} onChange={set('message')} className={`${fieldInput} resize-none`} placeholder="e.g. Why does ChatGPT recommend our competitor for ‘best X for Y’?" data-testid="booking-message" />
                    {errors.message && <p className={fieldError}>{errors.message}</p>}
                  </div>
                </div>

                {serverError && <p className="text-[13px] text-red-600 mt-5" data-testid="booking-server-error">{serverError}</p>}

                <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full mt-8 disabled:opacity-60 disabled:cursor-not-allowed" data-testid="booking-submit">
                  {status === 'submitting' ? <><Loader2 className="w-4 h-4 animate-spin" />Sending…</> : <>Request my discovery call<ArrowRight className="w-4 h-4" /></>}
                </button>
                <p className="text-center text-[12px] text-[rgb(var(--muted))] mt-4">
                  Prefer to skip the form? <a href={CAL_LINK} target="_blank" rel="noreferrer noopener" className="underline underline-offset-2 hover:text-[rgb(var(--ink))]" data-testid="booking-cal-link">Pick a slot on my calendar</a>.
                </p>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
