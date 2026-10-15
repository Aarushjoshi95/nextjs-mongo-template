'use client';

import { useState } from 'react';
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { inputCls } from '@/components/tools/ui';

const EXAMPLES = [
  { brand: 'Scaler', prompt: 'best online data science course in India for working professionals' },
  { brand: 'Kama Ayurveda', prompt: 'which luxury ayurvedic skincare brand should I buy in India?' },
  { brand: 'Emeritus', prompt: 'best executive education programs online for senior managers' },
];

const STANCE_LABEL = {
  not_mentioned: 'Not mentioned',
  mentioned_in_passing: 'Mentioned in passing',
  listed_as_option: 'Listed as an option',
  recommended: 'Recommended',
};

function highlight(text, brand) {
  if (!text) return null;
  if (!brand) return text;
  const esc = brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${esc})`, 'ig'));
  return parts.map((p, i) =>
    p.toLowerCase() === brand.toLowerCase()
      ? <mark key={i} className="bg-accent/15 text-accent font-medium px-1 py-0.5 rounded">{p}</mark>
      : <span key={i}>{p}</span>,
  );
}

export default function VisibilityChecker({ compact = false }) {
  const [brand, setBrand] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const run = async (e) => {
    e?.preventDefault?.();
    setError('');
    setResult(null);
    if (brand.trim().length < 2 || prompt.trim().length < 8) {
      setError('Add your brand name and the question a buyer would actually ask.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/visibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand: brand.trim(), buyerPrompt: prompt.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'The check failed. Try again in a moment.');
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const useExample = (ex) => { setBrand(ex.brand); setPrompt(ex.prompt); setResult(null); setError(''); };

  return (
    <div data-testid="visibility-checker">
      <form onSubmit={run} className={`grid gap-3 ${compact ? '' : 'sm:grid-cols-[1fr_2fr_auto]'}`}>
        <label className="block">
          <span className="block text-[12px] font-medium mb-1.5">Your brand</span>
          <input value={brand} onChange={(e) => setBrand(e.target.value)} maxLength={120} placeholder="e.g. Scaler" className={`${inputCls} font-sans`} data-testid="vc-brand" />
        </label>
        <label className="block">
          <span className="block text-[12px] font-medium mb-1.5">What a buyer asks the AI</span>
          <input value={prompt} onChange={(e) => setPrompt(e.target.value)} maxLength={800} placeholder="e.g. best online data science course in India" className={`${inputCls} font-sans`} data-testid="vc-prompt" />
        </label>
        <button type="submit" disabled={loading} className={`btn-primary h-10 ${compact ? 'w-full justify-center' : 'self-end'} disabled:opacity-60`} data-testid="vc-submit">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Asking Gemini…</> : <>Check visibility<ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <span className="text-[11px] text-muted">Try:</span>
        {EXAMPLES.map((ex) => (
          <button key={ex.brand} type="button" onClick={() => useExample(ex)} className="pill text-[11px] hover:border-ink/40 transition" data-testid={`vc-example-${ex.brand.toLowerCase().replace(/\s+/g, '-')}`}>{ex.brand}</button>
        ))}
      </div>

      {error ? <p className="mt-4 text-[13.5px] text-red-600" data-testid="vc-error">{error}</p> : null}

      {loading ? (
        <div className="mt-5 border-t border-line pt-5 space-y-2 animate-pulse" data-testid="vc-loading">
          <div className="h-3 rounded bg-line w-11/12" />
          <div className="h-3 rounded bg-line w-9/12" />
          <div className="h-3 rounded bg-line w-10/12" />
          <p className="text-[11.5px] text-muted pt-2">Asking Gemini as a buyer would, then scoring the answer… usually 5–15 seconds.</p>
        </div>
      ) : null}

      {result ? (
        <div className="mt-5 border-t border-line pt-5" data-testid="vc-result">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`pill text-[11px] ${result.mentioned ? 'pill-published' : ''}`} data-testid="vc-mentioned">
              <span className={`inline-block w-2 h-2 rounded-full ${result.mentioned ? 'bg-positive' : 'bg-muted/40'}`} />
              {result.mentioned ? 'Named in the answer' : 'Not mentioned'}
            </span>
            {result.aiScored ? (
              <>
                <span className="pill text-[11px]" data-testid="vc-stance">{STANCE_LABEL[result.stance] || result.stance}</span>
                <span className="pill text-[11px]" data-testid="vc-shortlist">Shortlist odds {Math.round((result.shortlistProbability || 0) * 100)}%</span>
                <span className="pill text-[11px] font-mono" data-testid="vc-score">Visibility {result.visibilityScore}/100</span>
              </>
            ) : null}
            <span className="ml-auto text-[11px] font-mono text-muted">Gemini 2.5 Flash</span>
          </div>
          <div className="text-[12px] font-mono text-muted mb-3 break-words">prompt › {result.buyerPrompt}</div>
          <div className={`text-[14.5px] leading-relaxed whitespace-pre-wrap ${compact ? 'max-h-56 overflow-y-auto pr-1' : ''}`} data-testid="vc-answer">{highlight(result.answer, result.brand)}</div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-muted">{result.competitors?.length ? 'Named instead / alongside:' : 'No competitors named'}</span>
            {(result.competitors || []).map((c) => <span key={c} className="pill text-[11px]" data-testid="vc-competitor">{c}</span>)}
          </div>
          {!result.mentioned ? (
            <p className="mt-4 text-[13px] text-ink flex gap-2"><Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />This is the gap. The brands above are being shortlisted for your buyer’s question and you are not. The audit maps this across 100–300 prompts and four engines.</p>
          ) : null}
        </div>
      ) : null}

      <p className="text-[11px] text-muted mt-5 pt-4 border-t border-line">One live Gemini answer, scored for mention, stance and shortlist odds. Answers vary run to run — treat it as an observation, not a ranking. Limited to 10 checks per 10 minutes.</p>
    </div>
  );
}
