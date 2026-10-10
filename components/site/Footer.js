import Link from 'next/link';
import { BookButton } from '@/components/site/BookingModal';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="about" className="border-t border-[rgb(var(--line))] bg-[rgb(var(--surface))]">
      <div className="container-max py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-1">
            <Link href="/#top" className="flex items-center gap-3 mb-4">
              <span className="w-9 h-9 rounded-full bg-[rgb(var(--ink))] text-[rgb(var(--bg))] flex items-center justify-center font-semibold text-lg" style={{fontFamily:'Inter Tight'}}>A</span>
              <span className="flex flex-col leading-tight">
                <span className="text-[15px] font-semibold">Aarush</span>
                <span className="text-[11px] text-[rgb(var(--muted))] -mt-0.5">AI Search Visibility</span>
              </span>
            </Link>
            <p className="text-[14px] text-[rgb(var(--muted))] leading-relaxed mb-4 max-w-[320px]">AEO, GEO and organic growth for brands that want to be the answer, measured against leads and revenue.</p>
            <span className="pill pill-published"><span className="pulse-dot" />Open to projects</span>
          </div>
          <div>
            <h4 className="text-[13px] uppercase tracking-[0.12em] text-[rgb(var(--muted))] mb-4">Work</h4>
            <ul className="space-y-2 text-[14px]">
              <li><Link href="/#offers" className="hover:text-[rgb(var(--accent))]">AI Visibility Audit</Link></li>
              <li><Link href="/#offers" className="hover:text-[rgb(var(--accent))]">GEO Programme</Link></li>
              <li><Link href="/#offers" className="hover:text-[rgb(var(--accent))]">Growth Advisory</Link></li>
              <li><Link href="/#proof" className="hover:text-[rgb(var(--accent))]">Case studies</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[13px] uppercase tracking-[0.12em] text-[rgb(var(--muted))] mb-4">Contact</h4>
            <ul className="space-y-2 text-[14px]">
              <li><a href="mailto:hello@aarush.consulting" className="hover:text-[rgb(var(--accent))]">hello@aarush.consulting</a></li>
              <li><a href="https://www.linkedin.com" target="_blank" rel="noreferrer noopener" className="hover:text-[rgb(var(--accent))]">LinkedIn</a></li>
              <li><BookButton className="hover:text-[rgb(var(--accent))]">Book a discovery call</BookButton></li>
            </ul>
          </div>
        </div>
        <div className="mt-14 pt-6 border-t border-[rgb(var(--line))] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[13px] text-[rgb(var(--muted))]">
          <span>© {year} Aarush · Bengaluru, India · Working globally</span>
          <span className="flex gap-5"><a href="#" className="hover:text-[rgb(var(--ink))]">Privacy</a><a href="#" className="hover:text-[rgb(var(--ink))]">Terms</a></span>
        </div>
      </div>
    </footer>
  );
}
