'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { Dictionary } from '../dictionaries';
import Reveal from './Reveal';

const PAGE_SIZE = 12;
const SHOTS = Array.from({ length: 36 }, (_, i) => ({
  src: `/azal/gallery/gallery-${String(i + 1).padStart(2, '0')}.jpg`,
}));

export default function Gallery({
  dict,
  dir,
}: {
  dict: Dictionary;
  dir: 'rtl' | 'ltr';
}) {
  const [page, setPage] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeShot = activeIndex === null ? null : SHOTS[activeIndex];
  const pageCount = Math.ceil(SHOTS.length / PAGE_SIZE);
  const pageStart = page * PAGE_SIZE;
  const visibleShots = SHOTS.slice(pageStart, pageStart + PAGE_SIZE);
  const previousLabel = dir === 'rtl' ? 'السابق' : 'Previous';
  const nextLabel = dir === 'rtl' ? 'التالي' : 'Next';

  const close = () => setActiveIndex(null);
  const showPrevious = () =>
    setActiveIndex((current) =>
      current === null ? current : (current - 1 + SHOTS.length) % SHOTS.length
    );
  const showNext = () =>
    setActiveIndex((current) => (current === null ? current : (current + 1) % SHOTS.length));

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') showPrevious();
      if (event.key === 'ArrowRight') showNext();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeIndex]);

  const goToPage = (nextPage: number) => {
    setPage((nextPage + pageCount) % pageCount);
  };

  return (
    <section id="gallery" className="section">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-col items-start gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="eyebrow">{dict.nav.gallery}</span>
              <h2
                className="font-display mt-5 max-w-3xl"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3.6rem)',
                  lineHeight: 1.05,
                  fontWeight: 300,
                }}
              >
                {dict.about.title}
              </h2>
            </div>
            <p className="max-w-md text-sm text-[var(--ink)]/62" style={{ lineHeight: 1.8 }}>
              {dict.about.body}
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          {visibleShots.map((shot, i) => {
            const shotIndex = pageStart + i;
            return (
            <Reveal
              key={shot.src}
              as="figure"
              className="gallery-tile group"
              delay={(i % 4) * 0.04}
            >
              <button
                type="button"
                className="relative block h-full w-full overflow-hidden text-start"
                onClick={() => setActiveIndex(shotIndex)}
                aria-label={`${dict.nav.gallery} ${String(shotIndex + 1).padStart(2, '0')}`}
              >
                <Image
                  src={shot.src}
                  alt={`${dict.nav.gallery} ${String(shotIndex + 1).padStart(2, '0')}`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.055]"
                />
                <span className="absolute inset-0 bg-[rgba(11,8,6,0.08)] transition-colors duration-500 group-hover:bg-[rgba(11,8,6,0.24)]" />
                <span className="absolute inset-x-4 bottom-4 flex items-center justify-between text-[var(--cream)] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="text-xs tabular-nums">
                    {String(shotIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="gallery-open-icon" aria-hidden>
                    <ExpandIcon />
                  </span>
                </span>
              </button>
            </Reveal>
            );
          })}
        </div>

        <Reveal key={`gallery-page-${page}`} className="mt-10">
          <div className="gallery-pager" aria-label="Gallery pages" dir="ltr">
            <button
              type="button"
              className="gallery-pager-button"
              onClick={() => goToPage(page - 1)}
              aria-label="Previous page"
            >
              <ChevronIcon direction="left" />
              <span dir={dir}>{previousLabel}</span>
            </button>

            <div className="gallery-page-track">
              <div className="gallery-page-chips">
                {Array.from({ length: pageCount }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`gallery-page-number ${page === i ? 'active' : ''}`}
                    onClick={() => goToPage(i)}
                    aria-label={`Page ${i + 1}`}
                    aria-current={page === i ? 'page' : undefined}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="gallery-pager-button"
              onClick={() => goToPage(page + 1)}
              aria-label="Next page"
            >
              <span dir={dir}>{nextLabel}</span>
              <ChevronIcon direction="right" />
            </button>
          </div>
        </Reveal>
      </div>

      {activeShot && activeIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(11,8,6,0.92)] px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label={dict.nav.gallery}
          onClick={close}
        >
          <button
            type="button"
            className="lightbox-control absolute top-4 end-4 z-20"
            onClick={close}
            aria-label="Close gallery"
          >
            <CloseIcon />
          </button>

          <button
            type="button"
            className="lightbox-control absolute left-4 top-1/2 z-20 -translate-y-1/2"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            aria-label="Previous image"
          >
            <ChevronIcon direction="left" />
          </button>

          <figure
            className="relative h-full max-h-[86svh] w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={activeShot.src}
              alt={`${dict.nav.gallery} ${String(activeIndex + 1).padStart(2, '0')}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
            <figcaption className="absolute inset-x-0 -bottom-10 text-center text-sm text-[var(--cream)]/72 tabular-nums">
              {String(activeIndex + 1).padStart(2, '0')} / {String(SHOTS.length).padStart(2, '0')}
            </figcaption>
          </figure>

          <button
            type="button"
            className="lightbox-control absolute right-4 top-1/2 z-20 -translate-y-1/2"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            aria-label="Next image"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      )}
    </section>
  );
}

function ExpandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M6 3H3v3M10 3h3v3M6 13H3v-3M10 13h3v-3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M4 4l10 10M14 4L4 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      style={{ transform: direction === 'left' ? 'scaleX(-1)' : undefined }}
    >
      <path
        d="M7 4l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
