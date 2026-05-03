import type { Dictionary } from '../dictionaries';
import Reveal from './Reveal';
import MapView from './MapView';

const MAPS_QUERY = encodeURIComponent('Al Malqa, Anas bin Malik Road, Riyadh');

export default function Location({ dict }: { dict: Dictionary }) {
  return (
    <section id="location" className="section relative">
      <div className="container-x grid lg:grid-cols-12 gap-10 items-stretch">
        <Reveal as="div" className="lg:col-span-5">
          <span className="eyebrow">{dict.location.kicker}</span>
          <h2
            className="font-display mt-5"
            style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.8rem)', lineHeight: 1.04, fontWeight: 300 }}
          >
            {dict.location.title}
          </h2>
          <p className="mt-6 text-[var(--ink)]/75" style={{ lineHeight: 1.85 }}>
            {dict.location.body}
          </p>
          <div className="mt-8 flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 22s7-7.2 7-12a7 7 0 10-14 0c0 4.8 7 12 7 12z"
                stroke="var(--bronze-700)"
                strokeWidth="1.3"
              />
              <circle cx="12" cy="10" r="2.4" stroke="var(--bronze-700)" strokeWidth="1.3" />
            </svg>
            <span className="text-[var(--ink)]/85">{dict.location.address}</span>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-dark mt-8"
          >
            {dict.location.openMap}
          </a>
        </Reveal>

        <Reveal as="div" className="lg:col-span-7" delay={0.1}>
          <MapView label={dict.location.address} />
        </Reveal>
      </div>
    </section>
  );
}
