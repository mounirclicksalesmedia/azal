import type { Dictionary } from '../dictionaries';
import FeaturesGrid from './FeaturesGrid';
import Reveal from './Reveal';

type Props = { dict: Dictionary };

export default function Features({ dict }: Props) {
  const f = dict.features;
  return (
    <section className="asha-features asha-section-pad" id="features">
      <div className="asha-container">
        <Reveal className="asha-section-head" stagger>
          <div data-reveal-child>
            <span className="asha-eyebrow on-dark">
              <span className="dot" />
              {f.eyebrow}
            </span>
            <h2 className="asha-display asha-h-lg" style={{ marginTop: 24 }}>
              {f.titleLine1}
              <br />
              <span className="gold">{f.titleGold}</span> {f.titleLine2}
              <span style={{ color: 'rgba(253,245,228,0.4)' }}>.</span>
            </h2>
          </div>
          <div className="right-col" data-reveal-child>
            <p className="asha-body-lead">
              <strong>{f.leadBoldA}</strong> {f.leadBoldB && <>و<strong>{f.leadBoldB}</strong></>}
              {' '}ضمن <strong>{f.leadBoldC}</strong> من المساحات التأجيرية،{' '}
              <span className="dim">{f.leadDim}</span>
            </p>
          </div>
        </Reveal>

        <FeaturesGrid items={f.items} />
      </div>
    </section>
  );
}
