'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type Props = {
  src: string;
  photoLabel: string;
  chips: string[];
};

export default function MasterplanVideo({ src, photoLabel, chips }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !videoRef.current) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        gsap.set(videoRef.current, { yPercent: 0, scale: 1 });
        return;
      }

      gsap.fromTo(
        videoRef.current,
        { yPercent: -10, scale: 1.18 },
        {
          yPercent: 10,
          scale: 1.06,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        },
      );

      gsap.from('.asha-about-photo__chip, .asha-about-photo__tag', {
        opacity: 0,
        y: 16,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <div className="asha-about-photo" ref={containerRef} data-reveal-child>
      <video
        ref={videoRef}
        className="asha-about-video"
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className="placeholder-tag asha-about-photo__tag">{photoLabel}</div>
      <div className="chips">
        {chips.map((c) => (
          <span className="asha-chip-glass asha-about-photo__chip" key={c}>
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
