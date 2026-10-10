'use client';

import { useState } from 'react';
import VisibilityChecker from '@/components/tools/VisibilityChecker';

const engines = ['ChatGPT', 'Claude', 'Gemini', 'Perplexity'];

function Illustration() {
  const [after, setAfter] = useState(false);
  const [engine, setEngine] = useState(0);
  return (
    <>
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div className="flex gap-1 p-1 bg-[rgb(var(--line))]/40 rounded-full">
          {engines.map((e, i) => (
            <button key={e} onClick={() => setEngine(i)} className={`text-[12px] px-3 py-1 rounded-full transition-colors ${engine === i ? 'bg-[rgb(var(--surface))] text-[rgb(var(--ink))] shadow-sm' : 'text-[rgb(var(--muted))]'}`}>{e}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[12px]">
          <button onClick={() => setAfter(false)} className={`px-3 py-1 rounded-full ${!after ? 'bg-[rgb(var(--ink))] text-[rgb(var(--bg))]' : 'text-[rgb(var(--muted))]'}`}>Before</button>
          <button onClick={() => setAfter(true)} className={`px-3 py-1 rounded-full ${after ? 'bg-[rgb(var(--ink))] text-[rgb(var(--bg))]' : 'text-[rgb(var(--muted))]'}`}>After 90 days</button>
        </div>
      </div>
      <div className="text-[12px] font-mono text-[rgb(var(--muted))] mb-4">prompt › best online program for working professionals to move into AI engineering?</div>
      <div className="text-[15px] leading-relaxed border-t border-[rgb(var(--line))] pt-4">
        {after ? (
          <>Strong options include <span className="bg-[rgb(var(--accent))]/15 text-[rgb(var(--accent))] font-medium px-1.5 py-0.5 rounded">YourBrand</span><sup className="text-[rgb(var(--accent))]">[1]</sup>, <strong>Competitor A</strong><sup>[2]</sup> and <strong>Competitor B</strong>. YourBrand is often cited for its mentor support and placement outcomes.</>
        ) : (
          <>Strong options include <strong>Competitor A</strong><sup>[1]</sup>, <strong>Competitor B</strong><sup>[2]</sup> and <strong>Competitor C</strong>. Competitor A is often recommended for its mentor support; Competitor B for its placement network.</>
        )}
      </div>
      <div className="flex items-center gap-2 mt-5 text-[12px] text-[rgb(var(--muted))]">
        <span className={`inline-block w-2 h-2 rounded-full ${after ? 'bg-[rgb(var(--positive))]' : 'bg-[rgb(var(--muted))]/40'}`} />
        {after ? 'Named + cited' : 'Not mentioned'}
      </div>
      <p className="text-[11px] text-[rgb(var(--muted))] mt-5 pt-4 border-t border-[rgb(var(--line))]">Illustrative. &ldquo;YourBrand&rdquo; stands in for your company.</p>
    </>
  );
}

export default function PromptDemo() {
  const [mode, setMode] = useState('live');
  return (
    <div className="card-surface p-6 lg:p-7" data-testid="prompt-demo">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex gap-1 p-1 bg-[rgb(var(--line))]/40 rounded-full" role="tablist">
          <button role="tab" aria-selected={mode === 'live'} onClick={() => setMode('live')} className={`text-[12px] px-3 py-1 rounded-full transition-colors flex items-center gap-1.5 ${mode === 'live' ? 'bg-[rgb(var(--surface))] text-[rgb(var(--ink))] shadow-sm' : 'text-[rgb(var(--muted))]'}`} data-testid="demo-tab-live">
            <span className="pulse-dot" />Live check
          </button>
          <button role="tab" aria-selected={mode === 'demo'} onClick={() => setMode('demo')} className={`text-[12px] px-3 py-1 rounded-full transition-colors ${mode === 'demo' ? 'bg-[rgb(var(--surface))] text-[rgb(var(--ink))] shadow-sm' : 'text-[rgb(var(--muted))]'}`} data-testid="demo-tab-illustration">Before / after</button>
        </div>
        {mode === 'live' ? <span className="text-[11px] font-mono text-[rgb(var(--muted))]">Gemini · free</span> : null}
      </div>
      {mode === 'live' ? <VisibilityChecker compact /> : <Illustration />}
    </div>
  );
}
