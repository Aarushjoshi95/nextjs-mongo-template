import Link from 'next/link';
import { BookButton } from '@/components/site/BookingModal';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="about" className="border-t border-line bg-surface">
      <div className="container-max py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-1">
            <Link href="/#top" className="flex items-center gap-3 mb-4">
              <span className="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center font-semibold text-lg" style={{ fontFamily: 'var(--font-display)' }}>A</span>
              <span className="flex flex-col leading-tight">
                <span className="text-[15px] font-semibold">Aarush</span>
                <span className="text-[11px] text-muted -mt-0.5">AI Search Visibility</span>
              </span>
            </Link>
            <p className="text-[14px] text-muted leading-relaxed mb-4 max-w-[320px]">AEO, GEO and organic growth for brands that want to be the answer, measured against leads and revenue.</p>
            <span className="pill pill-published"><span className="pulse-dot" />Open to projects</span>
          </div>
          <div>
            <h4 className="text-[13px] uppercase tracking-[0.12em] text-muted mb-4">Work</h4>
            <ul className="space-y-2 text-[14px]">
              <li><Link href="/#offers" className="hover:text-accent">AI Visibility Audit</Link></li>
              <li><Link href="/#offers" className="hover:text-accent">GEO Programme</Link></li>
              <li><Link href="/#offers" className="hover:text-accent">Growth Advisory</Link></li>
              <li><Link href="/#proof" className="hover:text-accent">Case studies</Link></li>
            </ul>
            <h4 className="text-[13px] uppercase tracking-[0.12em] text-muted mb-4 mt-8">Free tools</h4>
            <ul className="space-y-2 text-[14px]">
              <li><Link href="/tools/ai-visibility-checker" className="hover:text-accent">AI Visibility Checker</Link></li>
              <li><Link href="/tools/revenue-impact-calculator" className="hover:text-accent">Revenue Impact Calculator</Link></li>
              <li><Link href="/tools/traffic-drop-loss-calculator" className="hover:text-accent">Traffic Drop Loss Calculator</Link></li>
              <li><Link href="/tools/ctr-position-opportunity-calculator" className="hover:text-accent">CTR / Position Opportunity</Link></li>
              <li><Link href="/tools" className="hover:text-accent">All tools</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[13px] uppercase tracking-[0.12em] text-muted mb-4">Contact</h4>
            <ul className="space-y-2 text-[14px]">
              <li><a href="mailto:hello@aarush.consulting" className="hover:text-accent">hello@aarush.consulting</a></li>
              <li><a href="https://www.linkedin.com" target="_blank" rel="noreferrer noopener" className="hover:text-accent">LinkedIn</a></li>
              <li><BookButton className="hover:text-accent">Book a discovery call</BookButton></li>
            </ul>
          </div>
        </div>
        <div className="mt-14 pt-6 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[13px] text-muted">
          <span>© {year} Aarush · Bengaluru, India · Working globally</span>
          <span className="flex gap-5"><a href="#" className="hover:text-ink">Privacy</a><a href="#" className="hover:text-ink">Terms</a></span>
        </div>
      </div>
    </footer>
  );
}
