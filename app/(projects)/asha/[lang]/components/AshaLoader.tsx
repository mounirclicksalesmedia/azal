'use client';

import { useEffect, useRef, useState } from 'react';

const DRAW_MS = 1700;
const MIN_HOLD_MS = 400;
const FADE_MS = 700;
const MAX_WAIT_MS = 4200;

type Props = {
  brand: { mark: string; name: string; subname: string };
};

export default function AshaLoader({ brand }: Props) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const overlay = overlayRef.current;
    const svg = svgRef.current;
    if (!overlay || !svg) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;
    root.classList.add('asha-loading');

    // Prepare stroke animation — set dasharray/offset on every drawable shape.
    const shapes = Array.from(
      svg.querySelectorAll<SVGGeometryElement>('path, polyline, polygon, rect, circle, line'),
    );
    if (!reduceMotion) {
      shapes.forEach((s) => {
        const len = typeof s.getTotalLength === 'function' ? s.getTotalLength() : 0;
        if (!len || !isFinite(len)) {
          s.style.strokeDasharray = 'none';
          s.style.strokeDashoffset = '0';
          return;
        }
        s.style.strokeDasharray = `${len}`;
        s.style.strokeDashoffset = `${len}`;
      });
    }

    // Start drawing on next frame so the initial offset is committed.
    const raf = window.requestAnimationFrame(() => {
      svg.classList.add('is-drawing');
    });

    const start = performance.now();

    // Watch for the hero video to be ready so we hide as soon as it can paint
    // its first frame — but never sooner than the minimum animation window.
    let resolved = false;
    const settle = () => {
      if (resolved) return;
      resolved = true;
      const elapsed = performance.now() - start;
      const minBeforeFade = reduceMotion ? 400 : DRAW_MS + MIN_HOLD_MS;
      const wait = Math.max(0, minBeforeFade - elapsed);
      window.setTimeout(() => {
        overlay.style.transition = `opacity ${FADE_MS}ms ease`;
        overlay.style.opacity = '0';
        window.setTimeout(() => {
          root.classList.remove('asha-loading');
          root.classList.add('asha-loaded');
          setHidden(true);
        }, FADE_MS);
      }, wait);
    };

    const videoSelector = 'video[data-h-video]';
    let video = document.querySelector<HTMLVideoElement>(videoSelector);
    const onReady = () => settle();
    const attachVideo = (v: HTMLVideoElement) => {
      // readyState >=2 → HAVE_CURRENT_DATA (first frame paintable)
      if (v.readyState >= 2) {
        settle();
        return;
      }
      v.addEventListener('loadeddata', onReady, { once: true });
      v.addEventListener('canplay', onReady, { once: true });
      v.addEventListener('error', onReady, { once: true });
    };

    if (video) {
      attachVideo(video);
    } else {
      // Hero mounts client-side after this layout effect can fire; poll briefly.
      const poll = window.setInterval(() => {
        video = document.querySelector<HTMLVideoElement>(videoSelector);
        if (video) {
          window.clearInterval(poll);
          attachVideo(video);
        }
      }, 60);
      window.setTimeout(() => window.clearInterval(poll), 2000);
    }

    // Hard cap — never hold the page hostage if the video stalls.
    const maxTimer = window.setTimeout(settle, MAX_WAIT_MS);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(maxTimer);
      if (video) {
        video.removeEventListener('loadeddata', onReady);
        video.removeEventListener('canplay', onReady);
        video.removeEventListener('error', onReady);
      }
      root.classList.remove('asha-loading');
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={overlayRef}
      className="asha-loader"
      role="status"
      aria-label="Loading"
    >
      <div className="asha-loader__inner">
        <svg
          ref={svgRef}
          className="asha-loader__mark"
          viewBox="0 0 140 140"
          width="120"
          height="120"
          aria-hidden="true"
        >
          {/* Soft square frame */}
          <rect
            x="14"
            y="14"
            width="112"
            height="112"
            rx="18"
            ry="18"
            className="frame"
          />
          {/* Stylised "A" letterform inside */}
          <polyline points="48,102 70,36 92,102" className="letter" />
          <line x1="58" y1="78" x2="82" y2="78" className="letter" />
        </svg>

        <div className="asha-loader__word">
          <div className="ar" aria-hidden>
            {brand.name}
          </div>
          <div className="en">{brand.subname}</div>
        </div>

        <div className="asha-loader__bar" aria-hidden>
          <span />
        </div>
      </div>
    </div>
  );
}
