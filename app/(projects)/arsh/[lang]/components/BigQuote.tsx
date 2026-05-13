import type { Dictionary } from '../dictionaries';
import Pill from './Pill';
import Reveal from './Reveal';
import { ArrowLeft, ArrowRight } from './Icons';

type Props = { dict: Dictionary };

export default function BigQuote({ dict }: Props) {
  return (
    <section className="arsh-bigquote">
      <div className="arsh-container">
        <Reveal>
          <p className="arsh-display arsh-h-md q" style={{ fontWeight: 500 }}>
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

        <Reveal className="arsh-bigquote-row" stagger>
          <div className="arsh-arrows" data-reveal-child>
            <button className="arsh-arrow-btn" aria-label="Prev">
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="arsh-arrow-btn" aria-label="Next">
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
