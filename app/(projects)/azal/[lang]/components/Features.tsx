import Image from 'next/image';
import type { Dictionary } from '../dictionaries';
import Reveal from './Reveal';

const ICONS = [
  'Offices',
  'Business_zones',
  'Retail_showrooms',
  'Restaurants_cafes',
  'hall',
  'Prayer_rooms',
  'events',
  'Green_spaces',
  'parking',
  'EV_charging_stations',
  'cleaning',
  'security',
];

export default function Features({ dict }: { dict: Dictionary }) {
  return (
    <section
      id="features"
      className="section feature-section relative overflow-hidden"
    >
      <div className="container-x">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <Reveal as="div" className="lg:col-span-6">
            <span className="eyebrow">{dict.features.kicker}</span>
            <h2
              className="font-display section-title mt-5"
            >
              {dict.features.title}
            </h2>
            <p className="body-copy mt-6 max-w-xl">
              {dict.features.subtitle}
            </p>
          </Reveal>

          <Reveal as="div" className="lg:col-span-6" delay={0.1}>
            <div className="feature-photo">
              <Image
                src="/azal/features/feature-17.png"
                alt={dict.features.title}
                width={2066}
                height={2066}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {dict.features.items.map((item, i) => {
            const iconName = ICONS[i] ?? ICONS[0];
            return (
              <Reveal key={i} as="article" className="feature-card" delay={(i % 4) * 0.06}>
                <div className="flex items-start justify-between gap-4">
                  <span className="num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="feature-icon-shell" aria-hidden>
                    <Image
                      src={`/icons/${iconName}.png`}
                      alt=""
                      width={256}
                      height={256}
                      className="h-full w-full object-contain"
                    />
                  </span>
                </div>
                <h3 className="feature-card-title">{item.title}</h3>
                <p className="feature-card-copy">{item.desc}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
