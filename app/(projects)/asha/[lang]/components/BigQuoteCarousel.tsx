import Image from 'next/image';
import type { Dictionary } from '../dictionaries';

type Props = { dict: Dictionary };

const galleryImages = [
  '/gallery/g-1.jpg',
  '/gallery/g-2.jpg',
  '/gallery/g-3.jpg',
  '/gallery/g-4.jpg',
];

type Cell =
  | { kind: 'image'; image: string; kicker: string; title: string }
  | { kind: 'cta'; kicker: string; title: string; button: string };

function ArrowGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function Spark({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
      <path d="M5.5 5.5l2.1 2.1" />
      <path d="M16.4 16.4l2.1 2.1" />
      <path d="M5.5 18.5l2.1-2.1" />
      <path d="M16.4 7.6l2.1-2.1" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}

export default function BigQuoteCarousel({ dict }: Props) {
  const carousel = dict.bigQuote.carousel;
  const items = carousel.items;
  const ctaCard = carousel.ctaCard;
  const cardCta = carousel.cardCta;

  const sequence: Cell[] = [];
  items.forEach((it, i) => {
    sequence.push({
      kind: 'image',
      image: galleryImages[i % galleryImages.length],
      kicker: it.kicker,
      title: it.title,
    });
    if (i === 0) {
      sequence.push({
        kind: 'cta',
        kicker: ctaCard.kicker,
        title: ctaCard.title,
        button: ctaCard.button,
      });
    }
  });

  const renderRow = (keyPrefix: string) => (
    <div className="asha-bq-row" aria-hidden={keyPrefix === 'b' ? true : undefined}>
      {sequence.map((c, idx) => (
        <div key={`${keyPrefix}-${idx}`} className="asha-bq-cell">
          {c.kind === 'cta' ? (
            <div className="asha-bq-card is-cta">
              <div className="asha-bq-card-head">
                <Spark size={18} />
                <span className="asha-bq-card-kicker">{c.kicker}</span>
              </div>
              <div className="asha-bq-cta-ring" aria-hidden>
                <ArrowGlyph size={28} />
              </div>
              <div className="asha-bq-card-title is-cta-title">{c.title}</div>
              <a href="#booking" className="asha-bq-card-cta-pill">
                <span>{c.button}</span>
                <ArrowGlyph size={16} />
              </a>
            </div>
          ) : (
            <div className="asha-bq-card">
              <Image
                src={c.image}
                alt=""
                fill
                sizes="(max-width: 640px) 260px, 300px"
                className="asha-bq-card-img"
                aria-hidden
              />
              <div className="asha-bq-card-veil" />
              <div className="asha-bq-card-head on-dark">
                <Spark size={18} />
                <span className="asha-bq-card-kicker">{c.kicker}</span>
              </div>
              <div className="asha-bq-card-title">{c.title}</div>
              <a
                href="#booking"
                className="asha-bq-card-cta"
                aria-label={cardCta}
                title={cardCta}
              >
                <ArrowGlyph size={18} />
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="asha-bq-carousel" aria-label="Project highlights" dir="ltr">
      <div className="asha-bq-carousel-track">
        {renderRow('a')}
        {renderRow('b')}
      </div>
    </div>
  );
}
