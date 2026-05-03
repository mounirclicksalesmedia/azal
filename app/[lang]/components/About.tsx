import Image from 'next/image';
import type { Dictionary } from '../dictionaries';
import Reveal from './Reveal';

export default function About({ dict }: { dict: Dictionary }) {
  return (
    <section id="about" className="section relative">
      <div className="container-x grid lg:grid-cols-12 gap-12">
        <Reveal as="div" className="lg:col-span-5">
          <Image
            src="/brand/azal-logo-black.png"
            alt="Azal"
            width={1167}
            height={835}
            className="mb-8 h-20 w-auto object-contain opacity-90"
          />
          <span className="eyebrow">{dict.about.kicker}</span>
          <h2
            className="font-display mt-5"
            style={{ fontSize: 'clamp(2.4rem, 4.6vw, 4.4rem)', lineHeight: 1.02, fontWeight: 300 }}
          >
            {dict.about.title}
          </h2>
          <div className="divider-line mt-8" />
        </Reveal>

        <Reveal as="div" className="lg:col-span-7" delay={0.1}>
          <p
            className="text-[var(--ink)]/80"
            style={{ fontSize: 'clamp(1rem, 1.15vw, 1.15rem)', lineHeight: 1.85 }}
          >
            {dict.about.body}
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6 lg:gap-10">
            {[dict.about.stat1, dict.about.stat2, dict.about.stat3].map((s, i) => (
              <div key={i} className="border-t pt-5" style={{ borderColor: 'var(--line)' }}>
                <div
                  className="font-display"
                  style={{
                    fontSize: 'clamp(2.2rem, 3.6vw, 3.4rem)',
                    fontWeight: 300,
                    color: 'var(--bronze-700)',
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div className="mt-2 text-sm text-[var(--ink)]/65">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
