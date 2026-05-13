'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Dictionary } from '../dictionaries';
import Pill from './Pill';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type Props = { dict: Dictionary };

export default function Hero({ dict }: Props) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced || !scope.current) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('[data-h-eyebrow]', { y: 14, opacity: 0, duration: 0.6 })
        .from(
          '[data-h-row]',
          { y: 36, opacity: 0, duration: 0.85, stagger: 0.08 },
          '-=0.35',
        )
        .from(
          '[data-h-meta]',
          { y: 18, opacity: 0, duration: 0.6, stagger: 0.06 },
          '-=0.4',
        )
        .from(
          '[data-h-photo]',
          { y: 40, opacity: 0, duration: 0.95 },
          '-=0.6',
        )
        .from(
          '[data-h-chip]',
          { y: 12, opacity: 0, duration: 0.45, stagger: 0.07 },
          '-=0.55',
        )
        .from(
          '[data-h-stat]',
          { y: 18, opacity: 0, duration: 0.5, stagger: 0.08 },
          '-=0.5',
        );

      // Watermark parallax — drift slightly with scroll.
      gsap.to('[data-h-watermark]', {
        yPercent: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: scope.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
    },
    { scope },
  );

  return (
    <section className="arsh-hero" id="top" ref={scope}>
      <div className="arsh-hero-watermark" aria-hidden data-h-watermark>
        {dict.hero.watermark}
      </div>

      <div className="arsh-container arsh-hero-grid">
        <div>
          <span className="arsh-eyebrow" data-h-eyebrow>
            <span className="dot" />
            {dict.hero.eyebrow}
          </span>

          <h1 className="arsh-display arsh-h-xl arsh-hero-title">
            <span className="row1" data-h-row>
              {dict.hero.row1}
              <span className="gold">.</span>
            </span>
            <span className="row2" data-h-row>
              {dict.hero.row2}
            </span>
            <span className="row3" data-h-row>
              {dict.hero.row3}
            </span>
          </h1>

          <div className="arsh-hero-meta">
            {dict.hero.meta.map((m) => (
              <div className="arsh-meta-item" key={m.k} data-h-meta>
                <div className="k">{m.k}</div>
                <div className="v">{m.v}</div>
              </div>
            ))}
            <div className="arsh-meta-item cta" data-h-meta>
              <Pill href="#booking">{dict.hero.cta}</Pill>
            </div>
          </div>
        </div>

        <div className="arsh-hero-right">
          <div className="arsh-hero-photo" data-h-photo>
            <div className="windows" />
            <div className="photo-label">{dict.hero.photoLabel}</div>
            <div className="arsh-feature-chips">
              {dict.hero.chips.map((c) => (
                <span className="arsh-chip-glass" key={c} data-h-chip>
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className="arsh-hero-stats">
            {dict.hero.stats.map((s) => (
              <div className="arsh-stat-card" key={s.lab} data-h-stat>
                <div className="n">
                  {s.n}
                  {s.unit ? (
                    <span
                      style={{
                        fontSize: 14,
                        color: 'var(--gold)',
                        marginInlineStart: 6,
                        verticalAlign: 8,
                      }}
                    >
                      {s.unit}
                    </span>
                  ) : null}
                </div>
                <div className="lab">{s.lab}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
