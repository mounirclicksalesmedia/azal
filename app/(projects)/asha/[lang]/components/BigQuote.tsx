import type { Dictionary } from '../dictionaries';
import BigQuoteCarousel from './BigQuoteCarousel';
import Pill from './Pill';
import Reveal from './Reveal';
import { ArrowLeft, ArrowRight } from './Icons';

type Props = { dict: Dictionary };

export default function BigQuote({ dict }: Props) {
  return (
    <section className="asha-bigquote">
      <div className="asha-container">
        <Reveal>
          <p className="asha-display asha-h-md q" style={{ fontWeight: 500 }}>
            {dict.bigQuote.parts.map((p, i) => (
              <span
                key={i}
                className={
                  p.tone === 'dim' ? 'dim' : p.tone === 'gold' ? 'gold' : undefined
                }
              >
                {p.text}
              </span>
            ))}
          </p>
        </Reveal>
      </div>

      <BigQuoteCarousel dict={dict} />

      <div className="asha-container">
        <Reveal className="asha-bigquote-row" stagger>
          <div className="asha-arrows" data-reveal-child>
            <button className="asha-arrow-btn" aria-label="Prev">
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="asha-arrow-btn" aria-label="Next">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
          <div data-reveal-child>
            <Pill href="#features">{dict.bigQuote.cta}</Pill>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
