import { Fragment } from 'react';
import { site, type SiteToken } from '@/config/site';

/** Fills {token} from `vars`, else from the config/site field of that name. */
export function fill(text: string, vars: Record<string, string | number> = {}): string {
  return text.replace(/\{(\w+)\}/g, (m, k: string) => String(vars[k] ?? site[k as SiteToken] ?? m));
}

/** Renders content copy: {tokens} filled, ==text== in the accent colour, **text** emphasised. */
export default function Inline({ text, vars }: { text: string; vars?: Record<string, string | number> }) {
  const parts = fill(text, vars).split(/(==[^=]+==|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (/^==[^=]+==$/.test(p)) return <span key={i} className="text-accent">{p.slice(2, -2)}</span>;
        if (/^\*\*[^*]+\*\*$/.test(p)) return <span key={i} className="text-ink font-medium">{p.slice(2, -2)}</span>;
        return p ? <Fragment key={i}>{p}</Fragment> : null;
      })}
    </>
  );
}
