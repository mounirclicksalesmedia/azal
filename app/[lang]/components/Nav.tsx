'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Dictionary, Locale } from '../dictionaries';

type NavProps = {
  dict: Dictionary;
  lang: Locale;
};

export default function Nav({ dict, lang }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const otherLang: Locale = lang === 'ar' ? 'en' : 'ar';

  const items = [
    { href: '#about', label: dict.nav.about },
    { href: '#features', label: dict.nav.features },
    { href: '#gallery', label: dict.nav.gallery },
    { href: '#location', label: dict.nav.location },
    { href: '#book', label: dict.nav.contact },
  ];

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-500"
      style={{
        background: scrolled
          ? 'rgba(253, 250, 244, 0.92)'
          : 'linear-gradient(180deg, rgba(11,8,6,0.46), rgba(11,8,6,0))',
        color: scrolled ? 'var(--bronze-900)' : 'var(--cream)',
        backdropFilter: scrolled ? 'blur(18px) saturate(140%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(52,39,29,0.08)' : '1px solid transparent',
        boxShadow: scrolled ? '0 18px 44px rgba(52,39,29,0.08)' : 'none',
      }}
    >
      <div className="container-x flex items-center justify-between" style={{ height: 88 }}>
        <Link
          href={`/${lang}`}
          className="flex items-center"
          aria-label="Azal — Rawajeh Holding"
        >
          <Image
            src={scrolled ? '/brand/logo/black_logo.svg' : '/brand/logo/white_logo.svg'}
            alt="Rawajeh Holding"
            width={209}
            height={158}
            priority
            className="h-14 w-auto object-contain sm:h-16"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-9 text-sm" aria-label="Primary">
          {items.map((it) => (
            <a
              key={it.href}
              href={it.href}
              className="under-link text-current opacity-80 transition-opacity hover:opacity-100"
            >
              {it.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={`/${otherLang}`}
            className="hidden sm:inline-flex btn"
            style={{
              height: 40,
              paddingInline: '1.1rem',
              fontSize: '0.85rem',
              color: scrolled ? 'var(--bronze-900)' : 'var(--cream)',
              border: scrolled
                ? '1px solid rgba(52,39,29,0.18)'
                : '1px solid rgba(253,245,228,0.38)',
              background: scrolled ? 'rgba(255,255,255,0.28)' : 'rgba(253,245,228,0.07)',
            }}
            aria-label="Switch language"
          >
            {dict.nav.language}
          </Link>
          <a
            href="/downloads/azal-profile.pdf"
            download
            className="hidden lg:inline-flex btn btn-primary"
            style={{
              height: 40,
              paddingInline: '1.2rem',
              fontSize: '0.85rem',
              background: scrolled ? 'var(--bronze-900)' : 'var(--cream)',
              color: scrolled ? 'var(--cream)' : 'var(--bronze-900)',
              borderColor: scrolled ? 'var(--bronze-900)' : 'var(--cream)',
            }}
          >
            {dict.nav.downloadProfile}
          </a>
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-full border w-10 h-10 text-current"
            style={{
              borderColor: scrolled ? 'rgba(52,39,29,0.2)' : 'rgba(253,245,228,0.3)',
            }}
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <span className="sr-only">Menu</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              {open ? (
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              ) : (
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div
          className="md:hidden border-t"
          style={{ borderColor: 'rgba(253,245,228,0.1)', background: 'rgba(11,8,6,0.92)' }}
        >
          <div className="container-x py-6 flex flex-col gap-4">
            {items.map((it) => (
              <a
                key={it.href}
                href={it.href}
                onClick={() => setOpen(false)}
                className="text-[var(--cream)]/90 text-lg"
              >
                {it.label}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              <Link href={`/${otherLang}`} className="btn btn-ghost" style={{ height: 44 }}>
                {dict.nav.language}
              </Link>
              <a
                href="/downloads/azal-profile.pdf"
                download
                className="btn btn-primary"
                style={{ height: 44, background: 'var(--cream)', color: 'var(--bronze-900)', borderColor: 'var(--cream)' }}
              >
                {dict.nav.downloadProfile}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
