import Image from 'next/image';
import type { Dictionary } from '../dictionaries';
import Reveal from './Reveal';

const ICONS = [
  'office-transparent',
  'zones-transparent',
  'retail-transparent',
  'cafe-transparent',
  'hall-transparent',
  'mosque-transparent',
  'events-transparent',
  'green-transparent',
  'parking-transparent',
  'ev-transparent',
  'maintenance-transparent',
  'security-transparent',
];

export default function Features({ dict }: { dict: Dictionary }) {
  return (
    <section
      id="features"
      className="section relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(206,187,171,0.18) 100%)',
      }}
    >
      <div className="container-x">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <Reveal as="div" className="lg:col-span-6">
            <span className="eyebrow">{dict.features.kicker}</span>
            <h2
              className="font-display mt-5"
              style={{
                fontSize: 'clamp(2.2rem, 4.4vw, 4rem)',
                lineHeight: 1.02,
                fontWeight: 300,
              }}
            >
              {dict.features.title}
            </h2>
            <p className="mt-6 max-w-xl text-[var(--ink)]/70" style={{ lineHeight: 1.85 }}>
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

        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {dict.features.items.map((item, i) => {
            const iconName = ICONS[i] ?? ICONS[0];
            return (
              <Reveal key={i} as="article" className="feature-card" delay={(i % 4) * 0.06}>
                <div className="flex items-start justify-between gap-4">
                  <span className="num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="feature-icon-shell" aria-hidden>
                    <Image
                      src={`/features/icons/${iconName}.webp`}
                      alt=""
                      width={256}
                      height={256}
                      className="h-full w-full object-contain"
                    />
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-medium">{item.title}</h3>
                <p className="mt-2 text-sm text-[var(--ink)]/65">{item.desc}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
