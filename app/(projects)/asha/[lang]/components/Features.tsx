import type { Dictionary } from '../dictionaries';
import { FeatureIcon, type IconName } from './Icons';
import Reveal from './Reveal';

type Props = { dict: Dictionary };

type Item = Dictionary['features']['items'][number];

function FeatCard({ item }: { item: Item }) {
  const sizeTokens = item.size.split(' ');
  const sizeClass = sizeTokens.includes('lg')
    ? 'lg'
    : sizeTokens.includes('xl')
    ? 'xl'
    : 'sm';
  const isText = sizeTokens.includes('text');

  return (
    <div
      className={`asha-feat ${sizeClass}${isText ? ' is-text' : ''}`}
      data-reveal-child
    >
      <div className="idx">{item.idx}</div>

      {!isText && 'icon' in item && item.icon ? (
        <div className="glyph">
          <FeatureIcon name={item.icon as IconName} className="w-4 h-4" />
        </div>
      ) : null}

      {isText ? (
        <div className="big">
          {item.bigPre} <span className="gold">{item.bigGold}</span>
        </div>
      ) : (
        <div className="big">
          {item.big}
          {item.unit ? <span className="unit">{item.unit}</span> : null}
        </div>
      )}

      <div className="lab">{item.lab}</div>
    </div>
  );
}

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

        <Reveal className="asha-feat-grid" stagger y={20}>
          {f.items.map((item) => (
            <FeatCard key={item.idx} item={item} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
