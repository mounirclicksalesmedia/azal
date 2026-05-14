import type { Dictionary } from '../dictionaries';
import AshaMap from './AshaMap';
import Pill from './Pill';
import Reveal from './Reveal';

type Props = { dict: Dictionary };

const MAPS_QUERY = encodeURIComponent('Asha Hittin Riyadh Imam Saud bin Faisal');

export default function Location({ dict }: Props) {
  const l = dict.location;
  return (
    <section className="asha-location" id="location">
      <div className="asha-container">
        <Reveal className="asha-section-head" stagger>
          <div data-reveal-child>
            <span className="asha-eyebrow">
              <span className="dot" />
              {l.eyebrow}
            </span>
            <h2 className="asha-display asha-h-lg" style={{ marginTop: 24 }}>
              <span className="gold">{l.titleGold}</span> {l.titleLine1}
              <br />
              {l.titleLine2} <span>{l.titleEmph}</span> {l.titleLine3}
              <span className="muted">.</span>
            </h2>
          </div>
          <div className="right-col" data-reveal-child>
            <p className="asha-body-lead">
              {l.lead} <span className="dim">{l.leadDim}</span>
            </p>
          </div>
        </Reveal>

        <Reveal className="asha-loc-grid" stagger>
          <div className="asha-loc-info" data-reveal-child>
            {l.rows.map((r) => (
              <div className="asha-info-row" key={r.k}>
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

            <div className="asha-hours">
              <span className="dot" />
              <div>
                <div className="ttl">{l.hours.ttl}</div>
                <div className="tt">{l.hours.tt}</div>
              </div>
              <span className="tag">{l.hours.tag}</span>
            </div>

            <Pill
              href={`https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`}
              style={{ alignSelf: 'flex-start' }}
            >
              {l.mapsCta}
            </Pill>
          </div>

          <div className="asha-map-wrap is-live" data-reveal-child>
            <AshaMap badge={l.mapBadge} pinTtl={l.mapPin.ttl} pinSub={l.mapPin.sub} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
