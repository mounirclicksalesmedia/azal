import type { Dictionary } from '../dictionaries';
import Pill from './Pill';
import Reveal from './Reveal';

type Props = { dict: Dictionary };

export default function About({ dict }: Props) {
  const a = dict.about;
  return (
    <section className="arsh-about arsh-section-pad" id="about">
      <div className="arsh-container">
        <Reveal className="arsh-section-head" stagger>
          <div data-reveal-child>
            <span className="arsh-eyebrow">
              <span className="dot" />
              {a.eyebrow}
            </span>
            <h2 className="arsh-display arsh-h-lg" style={{ marginTop: 24 }}>
              {a.titleLine1}
              <br />
              <span className="gold">{a.titleGold}</span> {a.titleLine2}
              <span className="muted">.</span>
            </h2>
          </div>
          <div className="right-col" data-reveal-child>
            <p className="arsh-body-lead">
              <strong>{a.lead.boldA}</strong>
              {a.lead.textA}
              <strong>{a.lead.boldB}</strong>
              {a.lead.textB}{' '}
              <span className="dim">{a.lead.dim}</span>
            </p>
            <Pill href="#booking" style={{ alignSelf: 'flex-start' }}>
              {a.ctaSecondary}
            </Pill>
          </div>
        </Reveal>

        <Reveal className="arsh-about-grid" stagger>
          <div className="arsh-about-card" data-reveal-child>
            <div>
              <h3>
                {a.cardTitleA} <span className="gold">{a.cardTitleGold}</span>
                {a.cardTitleB}
              </h3>
              <p>{a.cardBody}</p>
            </div>
            <div className="tags">
              {a.tags.map((t) => (
                <span className="arsh-tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="arsh-about-photo" data-reveal-child>
            <div className="bldg" />
            <div className="placeholder-tag">{a.photoLabel}</div>
            <div className="chips">
              {a.photoChips.map((c) => (
                <span className="arsh-chip-glass" key={c}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
