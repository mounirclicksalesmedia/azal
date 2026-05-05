'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import type { Dictionary } from '../dictionaries';

type HeroProps = {
  dict: Dictionary;
  dir: 'rtl' | 'ltr';
};

const SLIDES = [
  '/azal/hero/hero-1.jpg',
  '/azal/hero/hero-2.jpg',
  '/azal/hero/hero-3.jpg',
  '/azal/hero/hero-4.jpg',
];

export default function Hero({ dict, dir }: HeroProps) {
  const textRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % SLIDES.length);
    }, 5600);

    const targets = textRef.current?.querySelectorAll<HTMLElement>('[data-reveal]');
    if (targets?.length) {
      gsap.fromTo(
        targets,
        { y: 34, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.05, stagger: 0.1, ease: 'power3.out' }
      );
    }

    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      className="relative isolate overflow-hidden grain"
      style={{ height: '100svh', minHeight: '720px' }}
      aria-label={dict.hero.titleLine1}
    >
      <div className="absolute inset-0">
        {SLIDES.map((src, i) => {
          // Render only slides that have already been shown — defers the
          // download of slides 2-4 until the user has seen the LCP image.
          if (i !== 0 && i > active) return null;
          return (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              priority={i === 0}
              fetchPriority={i === 0 ? 'high' : 'auto'}
              sizes="100vw"
              className={`object-cover transition-opacity duration-[1600ms] ease-out ${
                active === i ? 'opacity-100' : 'opacity-0'
              }`}
            />
          );
        })}
      </div>

      <div aria-hidden className="hero-grade absolute inset-0" />
      <div aria-hidden className="hero-texture absolute inset-0" />
      <div aria-hidden className="hero-hairlines absolute inset-0" />
      <div aria-hidden className="hero-top-line absolute inset-x-0 top-0 h-px" />

      <div className="relative z-10 h-full container-x flex items-center justify-center pt-[88px] pb-24 text-center">
        <div
          ref={textRef}
          className="hero-copy mx-auto flex max-w-5xl flex-col items-center text-[var(--cream)]"
        >
          <span data-reveal className="hero-eyebrow">
            {dict.hero.eyebrow}
          </span>
          <span data-reveal className="font-display hero-brand-text">
            {dict.hero.titleLine1}
          </span>
          <h1
            data-reveal
            className="font-display hero-title mt-6"
          >
            {dict.hero.titleLine2}
          </h1>
          <p
            data-reveal
            className="hero-subtitle mt-7 max-w-2xl"
          >
            {dict.hero.subtitle}
          </p>

          <div data-reveal className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href="#book"
              className="btn hero-book-link"
              style={{
                backgroundColor: '#8a603e',
                borderColor: '#8a603e',
                color: 'var(--cream)',
              }}
            >
              {dict.hero.ctaBook}
              <Arrow dir={dir} />
            </a>
            <a href="/downloads/azal-profile.pdf" download className="btn btn-ghost">
              {dict.hero.ctaDownload}
              <Download />
            </a>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-20 z-20 flex justify-center">
        <div className="flex items-center gap-3" aria-label="slides">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`dot ${active === i ? 'active' : ''}`}
              aria-label={`Slide ${i + 1}`}
              aria-current={active === i}
            />
          ))}
        </div>
      </div>

      <div className="scroll-cue">{dict.hero.scroll}</div>
    </section>
  );
}

function Arrow({ dir }: { dir: 'rtl' | 'ltr' }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      style={{ transform: dir === 'rtl' ? 'scaleX(-1)' : undefined }}
      aria-hidden
    >
      <path
        d="M1 7h12M8 2l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Download() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M7 1v8m0 0L4 6m3 3l3-3M2 12h10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
