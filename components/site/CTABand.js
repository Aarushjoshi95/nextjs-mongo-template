import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTABand({ question = "Want this kind of thinking on your site?", sub = "A 30-minute discovery call. No decks, no fluff \u2014 just whether we're a fit.", cta = 'Book a discovery call', href = '/hire-me' }) {
  return (
    <section className="section-y border-t border-line">
      <div className="container-max">
        <div className="max-w-3xl">
          <span className="eyebrow mb-6">Next step</span>
          <h2 className="text-[clamp(32px,5vw,52px)] font-semibold leading-[1.1] tracking-tight mb-4">{question}</h2>
          <p className="text-muted text-[18px] mb-8 max-w-2xl">{sub}</p>
          <Link href={href} className="btn-primary text-base">{cta}<ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </section>
  );
}
