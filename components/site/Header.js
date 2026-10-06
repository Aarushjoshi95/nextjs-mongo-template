'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const nav = [
  { label: 'Services', href: '/services', dropdown: [
    { label: 'Organic Growth Strategy', href: '/services/organic-growth-strategy' },
    { label: 'Technical SEO', href: '/services/technical-seo' },
    { label: 'GEO / AI Visibility', href: '/services/geo-ai-visibility' },
    { label: 'SEO Automation', href: '/services/seo-automation' },
  ]},
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Tools', href: '/tools' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

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
          <Link href="/" className="flex items-center gap-3 group" aria-label="Aarush home">
            <span className="w-9 h-9 rounded-full bg-[rgb(var(--ink))] text-[rgb(var(--bg))] flex items-center justify-center font-semibold text-lg" style={{fontFamily:'Inter Tight'}}>A</span>
            <span className="flex flex-col leading-tight">
              <span className="text-[15px] font-semibold tracking-tight">Aarush</span>
              <span className="text-[11px] text-[rgb(var(--muted))] -mt-0.5">Organic Growth Advisor</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Primary">
            {nav.map((item) => (
              item.dropdown ? (
                <div key={item.label} className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
                  <button className="flex items-center gap-1 text-[14px] text-[rgb(var(--ink))] hover:text-[rgb(var(--accent))] transition-colors" aria-haspopup="true" aria-expanded={servicesOpen}>
                    {item.label}<ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {servicesOpen && (
                    <div className="absolute top-full left-0 pt-2">
                      <div className="card-surface p-2 min-w-[240px] shadow-lg">
                        {item.dropdown.map((d) => (
                          <Link key={d.href} href={d.href} className="block px-3 py-2 text-[14px] rounded-md hover:bg-[rgb(var(--line))]/50">{d.label}</Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link key={item.href} href={item.href} className="text-[14px] text-[rgb(var(--ink))] hover:text-[rgb(var(--accent))] transition-colors">{item.label}</Link>
              )
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/hire-me" className="hidden sm:inline-flex btn-primary text-sm">Book a call</Link>
            <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-[rgb(var(--line))] bg-[rgb(var(--bg))]">
            <nav className="container-max py-4 flex flex-col gap-1" aria-label="Mobile">
              {nav.map((item) => (
                <div key={item.label}>
                  <Link href={item.href} onClick={() => setMobileOpen(false)} className="block py-2 text-[15px]">{item.label}</Link>
                  {item.dropdown && (
                    <div className="pl-4 flex flex-col gap-1 pb-2">
                      {item.dropdown.map((d) => (
                        <Link key={d.href} href={d.href} onClick={() => setMobileOpen(false)} className="block py-1 text-[14px] text-[rgb(var(--muted))]">{d.label}</Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link href="/hire-me" onClick={() => setMobileOpen(false)} className="btn-primary mt-3">Book a call</Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
