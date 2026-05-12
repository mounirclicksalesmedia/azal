'use client';

import { useEffect } from 'react';

export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let removeListener: (() => void) | undefined;
    let lenisInstance: { destroy: () => void } | undefined;

    const start = async () => {
      const { default: Lenis } = await import('lenis');
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.4,
        wheelMultiplier: 1,
        lerp: 0.1,
      });
      lenisInstance = lenis;

      const tick = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      const onAnchorClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement | null;
        const link = target?.closest('a[href^="#"]') as HTMLAnchorElement | null;
        if (!link) return;
        const id = link.getAttribute('href');
        if (!id || id === '#') return;
        const el = document.querySelector(id) as HTMLElement | null;
        if (!el) return;
        e.preventDefault();
        lenis.scrollTo(el, { offset: -8, duration: 1.4 });
      };
      document.addEventListener('click', onAnchorClick);
      removeListener = () => document.removeEventListener('click', onAnchorClick);
    };

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const idle = w.requestIdleCallback
      ? w.requestIdleCallback(start, { timeout: 1500 })
      : window.setTimeout(start, 600);

    return () => {
      if (w.cancelIdleCallback) {
        w.cancelIdleCallback(idle);
      } else {
        window.clearTimeout(idle);
      }
      removeListener?.();
      cancelAnimationFrame(raf);
      lenisInstance?.destroy();
    };
  }, []);

  return null;
}
