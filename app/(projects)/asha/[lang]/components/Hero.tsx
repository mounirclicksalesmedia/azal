'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useReducedMotion } from 'framer-motion';
import type { Dictionary } from '../dictionaries';
import Pill from './Pill';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type Props = { dict: Dictionary };

export default function Hero({ dict }: Props) {
  const scope = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion || !scope.current) return;

      // Cinematic scroll parallax — video drifts up + scales while we scroll
      // through the hero. Scrub ties progress to scroll position 1:1.
      gsap.to('[data-h-video]', {
        yPercent: 18,
        scale: 1.12,
        ease: 'none',
        scrollTrigger: {
          trigger: scope.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });

      // Overlay deepens as we scroll — keeps text readable as video shifts.
      gsap.to('[data-h-overlay]', {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: scope.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.4,
        },
      });

      // Watermark drifts the opposite direction for depth.
      gsap.to('[data-h-watermark]', {
        yPercent: -32,
        ease: 'none',
        scrollTrigger: {
          trigger: scope.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      });

      // Content lifts and fades as the user scrolls past the hero.
      gsap.to('[data-h-content]', {
        yPercent: -14,
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: {
          trigger: scope.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      });

      // Scroll cue fades out almost immediately as you start scrolling.
      gsap.to('[data-h-cue]', {
        opacity: 0,
        y: 24,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: scope.current,
          start: 'top top',
          end: '15% top',
          scrub: true,
        },
      });
    },
    { scope, dependencies: [prefersReducedMotion] },
  );

  // Framer Motion entry choreography (initial reveal, not scroll-tied).
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.09,
        delayChildren: prefersReducedMotion ? 0 : 0.25,
      },
    },
  };
  const rise = {
    hidden: { y: prefersReducedMotion ? 0 : 36, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] as const },
    },
  };
  const fade = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 1.2, ease: 'easeOut' as const } },
  };

  return (
    <section className="asha-hero" id="top" ref={scope}>
      <div className="asha-hero-media" aria-hidden>
        <video
          ref={videoRef}
          className="asha-hero-video"
          data-h-video
          src="/asha/herovideo.mp4"
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="asha-hero-vignette" />
        <div className="asha-hero-overlay" data-h-overlay />
        <div className="asha-hero-grain" />
      </div>

      <div className="asha-hero-watermark" aria-hidden data-h-watermark>
        {dict.hero.watermark}
      </div>

      <motion.div
        className="asha-container asha-hero-stage"
        data-h-content
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.span className="asha-eyebrow on-dark" variants={rise}>
          <span className="dot" />
          {dict.hero.eyebrow}
        </motion.span>

        <h1 className="asha-display asha-h-xl asha-hero-title on-dark">
          <motion.span className="row1" variants={rise}>
            {dict.hero.row1}
            <span className="gold">.</span>
          </motion.span>
          <motion.span className="row2" variants={rise}>
            {dict.hero.row2}
          </motion.span>
          <motion.span className="row3" variants={rise}>
            {dict.hero.row3}
          </motion.span>
        </h1>

        <motion.div className="asha-hero-meta on-dark" variants={fade}>
          {dict.hero.meta.map((m) => (
            <motion.div className="asha-meta-item" key={m.k} variants={rise}>
              <div className="k">{m.k}</div>
              <div className="v">{m.v}</div>
            </motion.div>
          ))}
          <motion.div className="asha-meta-item cta" variants={rise}>
            <Pill href="#booking" variant="on-dark">
              {dict.hero.cta}
            </Pill>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="asha-hero-cue"
        data-h-cue
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1.1 }}
        aria-hidden
      >
        <span className="line" />
        <span className="label">SCROLL</span>
      </motion.div>
    </section>
  );
}
