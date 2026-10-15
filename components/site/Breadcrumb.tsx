import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import JsonLd from '@/components/site/JsonLd';
import { jsonLd, breadcrumbSchema } from '@/lib/seo';

type Crumb = { name: string; url: string };

// Visible breadcrumb trail plus its BreadcrumbList JSON-LD, built from the same items.
// The last item is the current page. `className` is for outer spacing only.
export default function Breadcrumb({ items, className = '' }: { items: Crumb[]; className?: string }) {
  return (
    <>
      <JsonLd data={jsonLd(breadcrumbSchema(items))} />
      <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12.5px] text-muted ${className}`.trim()}>
        {items.map((it, i) =>
          i < items.length - 1 ? (
            <span key={it.url} className="contents">
              <Link href={it.url} className="whitespace-nowrap hover:text-ink">{it.name}</Link>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          ) : (
            <span key={it.url} className="text-ink" aria-current="page">{it.name}</span>
          ),
        )}
      </nav>
    </>
  );
}
