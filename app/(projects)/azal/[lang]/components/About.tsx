import Image from 'next/image';
import type { Dictionary } from '../dictionaries';
import Reveal from './Reveal';

export default function About({ dict }: { dict: Dictionary }) {
  return (
    <section id="about" className="section editorial-section about-section relative">
      <div className="container-x about-layout">
        <Reveal as="figure" className="about-image-frame" delay={0.08}>
          <Image
            src="/azal/hero/hero-3.jpg"
            alt={dict.about.title}
            fill
            sizes="(max-width: 1024px) 100vw, 46vw"
            className="object-cover"
          />
        </Reveal>

        <Reveal as="div" className="about-content">
          <Image
            src="/brand/azal-logo-black.png"
            alt="Azal"
            width={1167}
            height={835}
            className="about-logo h-14 w-auto object-contain sm:h-16"
          />
          <span className="eyebrow">{dict.about.kicker}</span>
          <h2 className="font-display section-title about-title">
            {dict.about.title}
          </h2>
          <div className="about-copy">
            <p className="body-lead">
              {dict.about.body}
            </p>

            <div className="about-stats">
              {[dict.about.stat1, dict.about.stat2, dict.about.stat3].map((s) => (
                <div key={s.label} className="about-stat">
                  <div className="font-display about-stat-value">
                    {s.value}
                  </div>
                  <div className="about-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
