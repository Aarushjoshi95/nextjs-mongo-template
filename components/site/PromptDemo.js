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
        <div className="flex gap-1 p-1 bg-line/40 rounded-full">
          {engines.map((e, i) => (
            <button key={e} onClick={() => setEngine(i)} className={`text-[12px] px-3 py-1 rounded-full transition-colors ${engine === i ? 'bg-surface text-ink shadow-sm' : 'text-muted'}`}>{e}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[12px]">
          <button onClick={() => setAfter(false)} className={`px-3 py-1 rounded-full ${!after ? 'bg-ink text-paper' : 'text-muted'}`}>Before</button>
          <button onClick={() => setAfter(true)} className={`px-3 py-1 rounded-full ${after ? 'bg-ink text-paper' : 'text-muted'}`}>After 90 days</button>
        </div>
      </div>
      <div className="text-[12px] font-mono text-muted mb-4">prompt › best online program for working professionals to move into AI engineering?</div>
      <div className="text-[15px] leading-relaxed border-t border-line pt-4">
        {after ? (
          <>Strong options include <span className="bg-accent/15 text-accent font-medium px-1.5 py-0.5 rounded">YourBrand</span><sup className="text-accent">[1]</sup>, <strong>Competitor A</strong><sup>[2]</sup> and <strong>Competitor B</strong>. YourBrand is often cited for its mentor support and placement outcomes.</>
        ) : (
          <>Strong options include <strong>Competitor A</strong><sup>[1]</sup>, <strong>Competitor B</strong><sup>[2]</sup> and <strong>Competitor C</strong>. Competitor A is often recommended for its mentor support; Competitor B for its placement network.</>
        )}
      </div>
      <div className="flex items-center gap-2 mt-5 text-[12px] text-muted">
        <span className={`inline-block w-2 h-2 rounded-full ${after ? 'bg-positive' : 'bg-muted/40'}`} />
        {after ? 'Named + cited' : 'Not mentioned'}
      </div>
      <p className="text-[11px] text-muted mt-5 pt-4 border-t border-line">Illustrative. &ldquo;YourBrand&rdquo; stands in for your company.</p>
    </>
  );
}

export default function PromptDemo() {
  const [mode, setMode] = useState('live');
  return (
    <div className="card-surface p-6 lg:p-7" data-testid="prompt-demo">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex gap-1 p-1 bg-line/40 rounded-full" role="tablist">
          <button role="tab" aria-selected={mode === 'live'} onClick={() => setMode('live')} className={`text-[12px] px-3 py-1 rounded-full transition-colors flex items-center gap-1.5 ${mode === 'live' ? 'bg-surface text-ink shadow-sm' : 'text-muted'}`} data-testid="demo-tab-live">
            <span className="pulse-dot" />Live check
          </button>
          <button role="tab" aria-selected={mode === 'demo'} onClick={() => setMode('demo')} className={`text-[12px] px-3 py-1 rounded-full transition-colors ${mode === 'demo' ? 'bg-surface text-ink shadow-sm' : 'text-muted'}`} data-testid="demo-tab-illustration">Before / after</button>
        </div>
        {mode === 'live' ? <span className="text-[11px] font-mono text-muted">Gemini · free</span> : null}
      </div>
      {mode === 'live' ? <VisibilityChecker compact /> : <Illustration />}
    </div>
  );
}
