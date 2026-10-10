'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BookButton } from '@/components/site/BookingModal';

const nav = [
  { label: 'AI visibility services', href: '/#offers' },
  { label: 'Case studies', href: '/#proof' },
  { label: 'How it works', href: '/#how' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'About', href: '/#about' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-black focus:text-white focus:px-3 focus:py-2 focus:rounded">Skip to content</a>
      <header className={`sticky top-0 z-40 transition-all duration-200 ${scrolled ? 'backdrop-blur-md bg-[rgb(var(--bg))]/80 border-b border-[rgb(var(--line))]' : 'bg-transparent'}`}>
        <div className="container-max flex items-center justify-between h-16 lg:h-20">
          <Link href="/#top" className="flex items-center gap-3 group" aria-label="Aarush home">
            <span className="w-9 h-9 rounded-full bg-[rgb(var(--ink))] text-[rgb(var(--bg))] flex items-center justify-center font-semibold text-lg" style={{fontFamily:'Inter Tight'}}>A</span>
            <span className="flex flex-col leading-tight">
              <span className="text-[15px] font-semibold tracking-tight">Aarush</span>
              <span className="text-[11px] text-[rgb(var(--muted))] -mt-0.5">AI Search Visibility</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-[14px] text-[rgb(var(--ink))] hover:text-[rgb(var(--accent))] transition-colors">{item.label}</Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <BookButton className="hidden sm:inline-flex btn-primary text-sm" data-testid="header-book-button">Book a discovery call</BookButton>
            <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-[rgb(var(--line))] bg-[rgb(var(--bg))]">
            <nav className="container-max py-4 flex flex-col gap-1" aria-label="Mobile">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="block py-2 text-[15px]">{item.label}</Link>
              ))}
              <BookButton onClick={() => setMobileOpen(false)} className="btn-primary mt-3" data-testid="mobile-book-button">Book a discovery call</BookButton>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
