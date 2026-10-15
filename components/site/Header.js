'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BookButton } from '@/components/site/BookingModal';
import { site } from '@/config/site';
import { headerNav, visible } from '@/config/nav';

const nav = visible(headerNav);

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
      <header className={`sticky top-0 z-40 transition-all duration-200 ${scrolled ? 'backdrop-blur-md bg-paper/80 border-b border-line' : 'bg-transparent'}`}>
        <div className="container-max flex items-center justify-between h-16 lg:h-20">
          <Link href="/#top" className="flex items-center gap-3 group" aria-label={`${site.name} home`}>
            <span className="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center font-semibold text-lg" style={{ fontFamily: 'var(--font-display)' }}>{site.name[0]}</span>
            <span className="flex flex-col leading-tight">
              <span className="text-[15px] font-semibold tracking-tight">{site.name}</span>
              <span className="text-[11px] text-muted -mt-0.5">{site.tagline}</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-[14px] text-ink hover:text-accent transition-colors">{item.label}</Link>
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
          <div className="lg:hidden border-t border-line bg-paper">
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
