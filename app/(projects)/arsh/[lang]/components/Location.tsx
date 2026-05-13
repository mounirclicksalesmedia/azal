import type { Dictionary } from '../dictionaries';
import Pill from './Pill';
import Reveal from './Reveal';
import { FeatureIcon } from './Icons';

type Props = { dict: Dictionary };

export default function Location({ dict }: Props) {
  const l = dict.location;
  return (
    <section className="arsh-location" id="location">
      <div className="arsh-container">
        <Reveal className="arsh-section-head" stagger>
          <div data-reveal-child>
            <span className="arsh-eyebrow">
              <span className="dot" />
              {l.eyebrow}
            </span>
            <h2 className="arsh-display arsh-h-lg" style={{ marginTop: 24 }}>
              <span className="gold">{l.titleGold}</span> {l.titleLine1}
              <br />
              {l.titleLine2} <span>{l.titleEmph}</span> {l.titleLine3}
              <span className="muted">.</span>
            </h2>
          </div>
          <div className="right-col" data-reveal-child>
            <p className="arsh-body-lead">
              {l.lead} <span className="dim">{l.leadDim}</span>
            </p>
          </div>
        </Reveal>

        <Reveal className="arsh-loc-grid" stagger>
          <div className="arsh-loc-info" data-reveal-child>
            {l.rows.map((r) => (
              <div className="arsh-info-row" key={r.k}>
                <div>
                  <div className="k">{r.k}</div>
                  <div className="label">{r.label}</div>
                  <div className="sub">{r.sub}</div>
                </div>
                <div className="v">
                  {r.v}
                  {r.vSmall ? <div className="small">{r.vSmall}</div> : null}
                </div>
              </div>
            ))}

            <div className="arsh-hours">
              <span className="dot" />
              <div>
                <div className="ttl">{l.hours.ttl}</div>
                <div className="tt">{l.hours.tt}</div>
              </div>
              <span className="tag">{l.hours.tag}</span>
            </div>

            <Pill href="#" style={{ alignSelf: 'flex-start' }}>
              {l.mapsCta}
            </Pill>
          </div>

          <div className="arsh-map-wrap" data-reveal-child>
            <div className="arsh-map-badge">
              <FeatureIcon name="pin" className="w-3 h-3" />
              {l.mapBadge}
            </div>
            <div className="arsh-map-pin">
              <div className="pulse" />
              <div className="card">
                <div className="ttl">{l.mapPin.ttl}</div>
                <div className="sub">{l.mapPin.sub}</div>
              </div>
            </div>
            <div className="arsh-map-controls">
              <button aria-label="Zoom in">+</button>
              <button aria-label="Zoom out">−</button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
