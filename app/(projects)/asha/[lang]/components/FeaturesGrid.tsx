'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Dictionary } from '../dictionaries';
import { FeatureIcon, type IconName } from './Icons';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type Item = Dictionary['features']['items'][number];

function FeatCard({ item }: { item: Item }) {
  const sizeTokens = item.size.split(' ');
  const sizeClass = sizeTokens.includes('xl')
    ? 'xl'
    : sizeTokens.includes('lg')
    ? 'lg'
    : 'sm';
  const isText = sizeTokens.includes('text');

  return (
    <div className={`asha-feat ${sizeClass}${isText ? ' is-text' : ''}`}>
      <span className="asha-feat-glow" aria-hidden="true" />
      {!isText && 'icon' in item && item.icon ? (
        <div className="glyph">
          <FeatureIcon name={item.icon as IconName} className="w-4 h-4" />
        </div>
      ) : null}
      <div className="asha-feat-inner">
        <div className="idx">{item.idx}</div>

        {isText ? (
          <div className="big">
            {item.bigPre} <span className="gold">{item.bigGold}</span>
          </div>
        ) : (
          <div className="big">
            {item.big}
            {item.unit ? <span className="unit">{item.unit}</span> : null}
          </div>
        )}

        <div className="lab">{item.lab}</div>
      </div>
    </div>
  );
}

export default function FeaturesGrid({ items }: { items: Item[] }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const root = gridRef.current;
      if (!root || !contextSafe) return;

      const cards = Array.from(root.querySelectorAll<HTMLElement>('.asha-feat'));
      if (cards.length === 0) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduced) {
        gsap.set(cards, { opacity: 1, y: 0, scale: 1, rotationX: 0 });
        return;
      }

      gsap.from(cards, {
        opacity: 0,
        y: 56,
        scale: 0.94,
        rotationX: -10,
        transformPerspective: 1100,
        transformOrigin: '50% 100%',
        duration: 1.05,
        ease: 'expo.out',
        stagger: {
          each: 0.07,
          from: 'start',
          grid: 'auto',
        },
        scrollTrigger: {
          trigger: root,
          start: 'top 82%',
          once: true,
        },
      });

      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      if (!fine) return;

      const cleanups: Array<() => void> = [];

      cards.forEach((card) => {
        const rotX = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' });
        const rotY = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' });
        const transY = gsap.quickTo(card, 'y', { duration: 0.5, ease: 'power3.out' });
        const scale = gsap.quickTo(card, 'scale', { duration: 0.5, ease: 'power3.out' });

        const onMove = contextSafe((event: PointerEvent) => {
          const rect = card.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width;
          const py = (event.clientY - rect.top) / rect.height;
          rotX((py - 0.5) * -6);
          rotY((px - 0.5) * 8);
          transY(-6);
          scale(1.015);
          card.style.setProperty('--mx', `${px * 100}%`);
          card.style.setProperty('--my', `${py * 100}%`);
        });

        const onLeave = contextSafe(() => {
          rotX(0);
          rotY(0);
          transY(0);
          scale(1);
        });

        card.addEventListener('pointermove', onMove);
        card.addEventListener('pointerleave', onLeave);

        cleanups.push(() => {
          card.removeEventListener('pointermove', onMove);
          card.removeEventListener('pointerleave', onLeave);
        });
      });

      return () => {
        cleanups.forEach((fn) => fn());
      };
    },
    { scope: gridRef },
  );

  return (
    <div className="asha-feat-grid" ref={gridRef}>
      {items.map((item) => (
        <FeatCard key={item.idx} item={item} />
      ))}
    </div>
  );
}
