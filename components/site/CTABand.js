import { ArrowRight } from 'lucide-react';
import { BookButton } from '@/components/site/BookingModal';

export default function CTABand({ question = "Want this kind of thinking on your site?", sub = "A 30-minute discovery call. No decks, no fluff — just whether we're a fit.", cta = 'Book a discovery call' }) {
  return (
    <section className="section-y border-t border-line">
      <div className="container-max">
        <div className="max-w-3xl">
          <span className="eyebrow mb-6">Next step</span>
          <h2 className="text-[clamp(32px,5vw,52px)] font-semibold leading-[1.1] tracking-tight mb-4">{question}</h2>
          <p className="text-muted text-[18px] mb-8 max-w-2xl">{sub}</p>
          <BookButton className="btn-primary text-base" data-testid="cta-band-book-button">{cta}<ArrowRight className="w-4 h-4" /></BookButton>
        </div>
      </div>
    </section>
  );
}
