'use client';

import { useEffect, useRef, useState } from 'react';
import type { Dictionary } from '../dictionaries';

type Props = { dict: Dictionary };

type Attribution = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  landing_page: string | null;
  referrer: string | null;
};

const STORAGE_KEY = 'azal:attribution';

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

  // First-touch wins: persist the first attribution we see for this session.
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

export default function BookForm({ dict }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const attribution = useRef<Attribution | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    attribution.current = readAttribution();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const lang =
      (typeof document !== 'undefined' && document.documentElement.lang) || 'en';

    const attr = attribution.current ?? readAttribution();

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: 'azal',
          full_name: String(data.get('full-name') ?? '').trim(),
          phone: String(data.get('phone') ?? '').trim(),
          email: String(data.get('email') ?? '').trim(),
          booking_date: String(data.get('booking-date') ?? '') || null,
          language: lang === 'ar' ? 'ar' : 'en',
          source: 'website',
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
      try {
        const w = window as Window & {
          azalTrack?: (e: string, p?: { email?: string; phone?: string; name?: string }) => void;
        };
        w.azalTrack?.('form_submit', {
          email: String(data.get('email') ?? '').trim(),
          phone: String(data.get('phone') ?? '').trim(),
          name: String(data.get('full-name') ?? '').trim(),
        });
      } catch {}
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="booking-form grid grid-cols-1 gap-5 sm:grid-cols-2"
      noValidate
      aria-live="polite"
    >
      <div className="field sm:col-span-2">
        <input
          id="full-name"
          name="full-name"
          required
          placeholder=" "
          autoComplete="name"
        />
        <label htmlFor="full-name">{dict.cta.fullName}</label>
      </div>
      <div className="field">
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder=" "
          autoComplete="tel"
          inputMode="tel"
          dir="ltr"
        />
        <label htmlFor="phone">{dict.cta.phone}</label>
      </div>
      <div className="field">
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder=" "
          autoComplete="email"
          dir="ltr"
        />
        <label htmlFor="email">{dict.cta.email}</label>
      </div>
      <div className="field sm:col-span-2">
        <input
          id="booking-date"
          name="booking-date"
          type="date"
          required
          min={today}
          className="has-value"
          dir="ltr"
        />
        <label htmlFor="booking-date">{dict.cta.bookingDate}</label>
      </div>
      <div className="sm:col-span-2 mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-h-[1.25rem] text-sm text-[var(--ink)]/55">
          {error ? error : submitted ? dict.cta.thanks : ''}
        </p>
        <button
          type="submit"
          className="btn btn-outline-dark booking-submit"
          disabled={busy || submitted}
          style={{ opacity: busy ? 0.7 : 1 }}
        >
          {busy ? '…' : dict.cta.submit}
        </button>
      </div>
    </form>
  );
}
