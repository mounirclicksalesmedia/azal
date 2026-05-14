'use client';

import { useEffect, useRef, useState } from 'react';
import type { Dictionary } from '../dictionaries';
import Pill from './Pill';
import Reveal from './Reveal';

type Props = { dict: Dictionary; lang: string };

type Attribution = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  landing_page: string | null;
  referrer: string | null;
};

const STORAGE_KEY = 'asha:attribution';

function readAttribution(): Attribution {
  const empty: Attribution = {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
    landing_page: null,
    referrer: null,
  };
  if (typeof window === 'undefined') return empty;

  const url = new URL(window.location.href);
  const fromUrl: Attribution = {
    utm_source: url.searchParams.get('utm_source'),
    utm_medium: url.searchParams.get('utm_medium'),
    utm_campaign: url.searchParams.get('utm_campaign'),
    utm_term: url.searchParams.get('utm_term'),
    utm_content: url.searchParams.get('utm_content'),
    landing_page: window.location.pathname + window.location.search,
    referrer: document.referrer || null,
  };

  try {
    const cached = sessionStorage.getItem(STORAGE_KEY);
    if (cached) return JSON.parse(cached) as Attribution;
    if (fromUrl.utm_source || fromUrl.referrer || fromUrl.landing_page) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
    }
  } catch {
    /* storage may be disabled */
  }
  return fromUrl;
}

export default function Booking({ dict, lang }: Props) {
  const b = dict.booking;
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const attribution = useRef<Attribution | null>(null);

  useEffect(() => {
    attribution.current = readAttribution();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const attr = attribution.current ?? readAttribution();

    try {
      const interest = String(data.get('interest') ?? '').trim();
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: 'asha',
          full_name: String(data.get('full-name') ?? '').trim(),
          phone: String(data.get('phone') ?? '').trim(),
          email: String(data.get('email') ?? '').trim(),
          language: lang === 'ar' ? 'ar' : 'en',
          source: 'website',
          notes: interest ? `Interest: ${interest}` : null,
          utm_source: attr.utm_source,
          utm_medium: attr.utm_medium,
          utm_campaign: attr.utm_campaign,
          utm_term: attr.utm_term,
          utm_content: attr.utm_content,
          landing_page: attr.landing_page,
          referrer: attr.referrer,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? 'Submission failed');
      }

      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="asha-booking" id="booking">
      <div className="asha-container asha-book-grid">
        <Reveal>
          <span className="asha-eyebrow on-dark">
            <span className="dot" />
            {b.eyebrow}
          </span>
          <h2 className="asha-display asha-h-lg" style={{ marginTop: 24 }}>
            {b.titleLine1}
            <br />
            {b.titleLine2} <span className="gold">{b.titleGold}</span>
            <span style={{ color: 'rgba(253,245,228,0.4)' }}>.</span>
          </h2>
          <p className="lead">{b.lead}</p>
          <div className="asha-badge-row">
            {b.chips.map((c) => (
              <span className="asha-chip-glass" key={c}>
                {c}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <form className="asha-form-card" onSubmit={onSubmit} noValidate aria-live="polite">
            <div className="asha-form-title">
              {submitted ? b.thanks : b.formTitle}
            </div>
            <div className="asha-form-sub">{b.formSub}</div>

            <label className="asha-field">
              <span className="lab">{b.fields.fullName.label}</span>
              <input
                type="text"
                name="full-name"
                placeholder={b.fields.fullName.placeholder}
                autoComplete="name"
                required
              />
            </label>
            <label className="asha-field">
              <span className="lab">{b.fields.phone.label}</span>
              <input
                type="tel"
                name="phone"
                placeholder={b.fields.phone.placeholder}
                autoComplete="tel"
                inputMode="tel"
                dir="ltr"
                required
              />
            </label>
            <label className="asha-field">
              <span className="lab">{b.fields.email.label}</span>
              <input
                type="email"
                name="email"
                placeholder={b.fields.email.placeholder}
                autoComplete="email"
                dir="ltr"
                required
              />
            </label>
            <label className="asha-field">
              <span className="lab">{b.fields.interest.label}</span>
              <input
                type="text"
                name="interest"
                placeholder={b.fields.interest.placeholder}
              />
            </label>

            <div className="asha-submit-row">
              <p className="asha-form-fine">
                {error ? error : b.fine}
              </p>
              <Pill type="submit" variant="solid">
                {busy ? '…' : b.submit}
              </Pill>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
