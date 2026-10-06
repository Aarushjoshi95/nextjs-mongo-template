'use client';

import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AnnouncementBar() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="bg-[rgb(var(--ink))] text-[rgb(var(--bg))] text-[13px]">
      <div className="container-max flex items-center justify-between py-2 gap-4">
        <Link href="/case-studies/traya-organic-zero-to-revenue" className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-1 min-w-0">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[rgb(var(--positive))] shrink-0" />
          <span className="truncate">New case study: Traya — 7.4× organic sessions with D0 revenue attribution</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </Link>
        <button onClick={() => setOpen(false)} aria-label="Dismiss" className="shrink-0 opacity-60 hover:opacity-100"><X className="w-4 h-4" /></button>
      </div>
    </div>
  );
}
