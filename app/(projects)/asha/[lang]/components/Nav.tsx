'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { Dictionary } from '../dictionaries';
import Pill from './Pill';

type Props = { dict: Dictionary };

export default function Nav({ dict }: Props) {
  const [open, setOpen] = useState(false);

  // close on Esc, and lock body scroll while the sheet is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className={`asha-nav${open ? ' is-open' : ''}`}>
      <div className="asha-container asha-nav-inner">
        <a href="#top" className="asha-brand" aria-label="Rawajeh Holding">
          <Image
            src="/brand/logo/black_logo.svg"
            alt="Rawajeh Holding"
            width={209}
            height={158}
            priority
            className="asha-brand-logo"
          />
        </a>

        <nav className="asha-nav-links" aria-label="Primary">
          {dict.nav.items.map((it) => (
            <a key={it.href} href={it.href}>
              <span className="num">{it.num}</span>
              {it.label}
            </a>
          ))}
        </nav>

        <div className="asha-nav-actions">
          <div className="asha-nav-cta">
            <Pill href="#booking" variant="solid">
              {dict.nav.cta}
            </Pill>
          </div>

          <button
            type="button"
            className={`asha-nav-burger${open ? ' is-open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="asha-mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        id="asha-mobile-menu"
        className={`asha-mobile-menu${open ? ' is-open' : ''}`}
        aria-hidden={!open}
      >
        <nav className="asha-mobile-menu__inner" aria-label="Mobile">
          {dict.nav.items.map((it, i) => (
            <a
              key={it.href}
              href={it.href}
              className="asha-mobile-menu__link"
              style={{ transitionDelay: `${0.06 + i * 0.05}s` }}
              onClick={() => setOpen(false)}
            >
              <span className="num">{it.num}</span>
              <span className="label">{it.label}</span>
              <svg
                className="arrow"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          ))}
          <a
            href="#booking"
            className="asha-mobile-menu__cta"
            onClick={() => setOpen(false)}
          >
            <span>{dict.nav.cta}</span>
            <span className="knob" aria-hidden>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </a>
        </nav>
      </div>
    </header>
  );
}
