'use client';

import type { Dictionary } from '../dictionaries';
import Reveal from './Reveal';
import BookForm from './BookForm';
import WhatsappIcon from './WhatsappIcon';

type AzalEvent = 'form_submit' | 'whatsapp_click' | 'call_click';
function fireAzal(event: AzalEvent) {
  try {
    const w = window as Window & { azalTrack?: (e: AzalEvent) => void };
    w.azalTrack?.(event);
  } catch {}
}

const PHONE = '+966 50 225 0056';
const PHONE_TEL = '+966502250056';
const WHATSAPP_URL =
  'https://api.whatsapp.com/send/?phone=966573778850&text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C+%D8%A3%D9%88%D8%AF+%D9%85%D8%B9%D8%B1%D9%81%D8%A9+%D8%AA%D9%81%D8%A7%D8%B5%D9%8A%D9%84+%D8%A3%D9%83%D8%AB%D8%B1+%D8%B9%D9%86+%D9%85%D8%B4%D8%B1%D9%88%D8%B9+%D8%A3%D8%B2%D9%84+-+%D8%A3%D9%86%D8%B3+%D8%A8%D9%86+%D9%85%D8%A7%D9%84%D9%83%D8%8C+%D8%AD%D9%8A+%D8%A7%D9%84%D9%85%D9%84%D9%82%D8%A7&type=phone_number&app_absent=0';
const WHATSAPP_DISPLAY = '+966 57 377 8850';
const EMAIL = 'Commercial@wasf.com.sa';

export default function Contact({ dict }: { dict: Dictionary }) {
  return (
    <section
      id="book"
      className="contact-section section relative"
    >
      <div className="container-x contact-shell">
        <Reveal as="div" className="contact-panel">
          <span className="eyebrow">{dict.contact.kicker}</span>
          <h2
            className="font-display contact-title"
          >
            {dict.cta.title}
          </h2>
          <p className="contact-copy">
            {dict.cta.subtitle}
          </p>

          <div className="contact-methods">
            <ContactRow
              label={dict.contact.whatsapp}
              value={WHATSAPP_DISPLAY}
              href={WHATSAPP_URL}
              icon={<WhatsappIcon />}
              tone="whatsapp"
              onClick={() => fireAzal('whatsapp_click')}
            />
            <ContactRow
              label={dict.contact.phone}
              value={PHONE}
              href={`tel:${PHONE_TEL}`}
              onClick={() => fireAzal('call_click')}
              icon={
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 4h4l2 5-3 2a12 12 0 006 6l2-3 5 2v4a2 2 0 01-2 2A18 18 0 013 6a2 2 0 012-2z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
            <ContactRow
              label={dict.contact.email}
              value={EMAIL}
              href={`mailto:${EMAIL}`}
              valueDir="ltr"
              icon={
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 6h18v12H3zM3 6l9 7 9-7"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
          </div>
        </Reveal>

        <Reveal as="div" className="contact-form-panel" delay={0.1}>
          <div className="booking-card">
            <div className="booking-card-head">
              <span>{dict.nav.contact}</span>
              <h3>{dict.cta.submit}</h3>
            </div>
            <BookForm dict={dict} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ContactRow({
  label,
  value,
  href,
  icon,
  tone = 'default',
  valueDir = 'ltr',
  onClick,
}: {
  label: string;
  value: string;
  href: string;
  icon: React.ReactNode;
  tone?: 'default' | 'whatsapp';
  valueDir?: 'ltr' | 'rtl' | 'auto';
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
      className="contact-row"
      data-tone={tone}
      onClick={onClick}
    >
      <span
        className="contact-row-icon"
        aria-hidden
      >
        {icon}
      </span>
      <span className="contact-row-body">
        <span className="contact-row-label">
          {label}
        </span>
        <bdi dir={valueDir} className="contact-row-value">{value}</bdi>
      </span>
    </a>
  );
}
