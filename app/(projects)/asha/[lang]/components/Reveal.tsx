'use client';

import { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type Props = {
  children: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  /** Stagger the immediate children with [data-reveal-child]. */
  stagger?: boolean;
  /** Delay before the reveal starts. */
  delay?: number;
  /** From-y distance in px. Default 24. */
  y?: number;
};

export default function Reveal({
  children,
  as = 'div',
  className,
  stagger = false,
  delay = 0,
  y = 24,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        gsap.set(ref.current, { autoAlpha: 1 });
        return;
      }

      const targets = stagger
        ? Array.from(ref.current.querySelectorAll('[data-reveal-child]'))
        : ref.current;

      gsap.set(ref.current, { autoAlpha: 1 });
      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 0.9,
        ease: 'power3.out',
        delay,
        stagger: stagger ? 0.08 : 0,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          once: true,
        },
      });
    },
    { scope: ref },
  );

  const Tag = as as unknown as React.ElementType;
  return (
    <Tag
      ref={ref as unknown as React.Ref<HTMLElement>}
      className={className}
      style={{ visibility: 'hidden' }}
      data-reveal
    >
      {children}
    </Tag>
  );
}
