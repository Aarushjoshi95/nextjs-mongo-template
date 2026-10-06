import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[rgb(var(--line))] bg-[rgb(var(--surface))]">
      <div className="container-max py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <span className="w-9 h-9 rounded-full bg-[rgb(var(--ink))] text-[rgb(var(--bg))] flex items-center justify-center font-semibold text-lg" style={{fontFamily:'Inter Tight'}}>A</span>
              <span className="text-[15px] font-semibold">Aarush</span>
            </Link>
            <p className="text-[14px] text-[rgb(var(--muted))] leading-relaxed mb-4 max-w-[280px]">SEO that reports to revenue, not rankings. Organic growth advisory for founders and growth teams.</p>
            <span className="pill pill-published"><span className="pulse-dot" />Open to projects</span>
          </div>
          <div>
            <h4 className="text-[13px] uppercase tracking-[0.12em] text-[rgb(var(--muted))] mb-4">Services</h4>
            <ul className="space-y-2 text-[14px]">
              <li><Link href="/services/organic-growth-strategy" className="hover:text-[rgb(var(--accent))]">Organic Growth Strategy</Link></li>
              <li><Link href="/services/technical-seo" className="hover:text-[rgb(var(--accent))]">Technical SEO</Link></li>
              <li><Link href="/services/geo-ai-visibility" className="hover:text-[rgb(var(--accent))]">GEO / AI Visibility</Link></li>
              <li><Link href="/services/seo-automation" className="hover:text-[rgb(var(--accent))]">SEO Automation</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[13px] uppercase tracking-[0.12em] text-[rgb(var(--muted))] mb-4">Resources</h4>
            <ul className="space-y-2 text-[14px]">
              <li><Link href="/case-studies" className="hover:text-[rgb(var(--accent))]">Case Studies</Link></li>
              <li><Link href="/tools" className="hover:text-[rgb(var(--accent))]">Free Tools</Link></li>
              <li><Link href="/blog" className="hover:text-[rgb(var(--accent))]">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[13px] uppercase tracking-[0.12em] text-[rgb(var(--muted))] mb-4">Company</h4>
            <ul className="space-y-2 text-[14px]">
              <li><Link href="/about" className="hover:text-[rgb(var(--accent))]">About</Link></li>
              <li><Link href="/hire-me" className="hover:text-[rgb(var(--accent))]">Hire me</Link></li>
              <li><Link href="/contact" className="hover:text-[rgb(var(--accent))]">Contact</Link></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noreferrer noopener" className="hover:text-[rgb(var(--accent))]">LinkedIn</a></li>
              <li><a href="https://x.com" target="_blank" rel="noreferrer noopener" className="hover:text-[rgb(var(--accent))]">X</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-14 pt-6 border-t border-[rgb(var(--line))] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[13px] text-[rgb(var(--muted))]">
          <span>© {year} Aarush</span>
          <span>Bengaluru, India · Working globally</span>
        </div>
      </div>
    </footer>
  );
}
