import type { Dictionary } from '../dictionaries';
import { ArrowOut } from './Icons';
import Reveal from './Reveal';

type Props = { dict: Dictionary };

export default function Contact({ dict }: Props) {
  const c = dict.contact;
  return (
    <section className="asha-contact" id="contact">
      <div className="asha-container">
        <Reveal className="asha-section-head" stagger>
          <div data-reveal-child>
            <span className="asha-eyebrow">
              <span className="dot" />
              {c.eyebrow}
            </span>
            <h2 className="asha-display asha-h-lg" style={{ marginTop: 24 }}>
              {c.titleLine1}
              <br />
              {c.titleLine2} <span className="gold">{c.titleGold}</span>
              <span className="muted">.</span>
            </h2>
          </div>
          <div className="right-col" data-reveal-child>
            <p className="asha-body-lead">
              {c.lead} <span className="dim">{c.leadDim}</span>
            </p>
          </div>
        </Reveal>

        <div className="asha-contact-grid">
          <Reveal stagger>
            <div className="asha-cards">
              {c.cards.map((card) => (
                <a className="asha-cc" href={card.href} key={card.k} data-reveal-child>
                  <span className="k">{card.k}</span>
                  <span className="v">{card.v}</span>
                  <span className="arrow">
                    {card.arrow}
                    <ArrowOut className="w-3.5 h-3.5" />
                  </span>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="asha-quote-block">
              <div className="label">{c.quote.label}</div>
              <p className="qt">
                {c.quote.textA} <span className="gold">{c.quote.textGold}</span>
                {c.quote.textB}
              </p>
              <div className="by">
                <span className="seal">{c.quote.seal}</span>
                <span>{c.quote.by}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
