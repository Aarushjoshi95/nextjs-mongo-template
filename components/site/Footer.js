import Link from 'next/link';
import { BookButton } from '@/components/site/BookingModal';
import { site } from '@/config/site';
import { footerNav, legalNav, visible } from '@/config/nav';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-max py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-1">
            <Link href="/#top" className="flex items-center gap-3 mb-4">
              <span className="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center font-semibold text-lg" style={{ fontFamily: 'var(--font-display)' }}>{site.name[0]}</span>
              <span className="flex flex-col leading-tight">
                <span className="text-[15px] font-semibold">{site.name}</span>
                <span className="text-[11px] text-muted -mt-0.5">{site.tagline}</span>
              </span>
            </Link>
            <p className="text-[14px] text-muted leading-relaxed mb-4 max-w-[320px]">{site.footerBlurb}</p>
            <span className="pill pill-published"><span className="pulse-dot" />Open to projects</span>
          </div>
          <div>
            {footerNav.map((group, i) => (
              <div key={group.title}>
                <h4 className={`text-[13px] uppercase tracking-[0.12em] text-muted mb-4 ${i > 0 ? 'mt-8' : ''}`}>{group.title}</h4>
                <ul className="space-y-2 text-[14px]">
                  {visible(group.links).map((l) => (
                    <li key={l.label}><Link href={l.href} className="hover:text-accent">{l.label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div>
            <h4 className="text-[13px] uppercase tracking-[0.12em] text-muted mb-4">Contact</h4>
            <ul className="space-y-2 text-[14px]">
              <li><a href={`mailto:${site.email}`} className="hover:text-accent">{site.email}</a></li>
              <li><a href={site.linkedin} target="_blank" rel="noreferrer noopener" className="hover:text-accent">LinkedIn</a></li>
              <li><BookButton className="hover:text-accent">Book a discovery call</BookButton></li>
            </ul>
          </div>
        </div>
        <div className="mt-14 pt-6 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[13px] text-muted">
          <span>© {year} {site.name} · {site.location} · Working globally</span>
          <span className="flex gap-5">{visible(legalNav).map((l) => <Link key={l.href} href={l.href} className="hover:text-ink">{l.label}</Link>)}</span>
        </div>
      </div>
    </footer>
  );
}
