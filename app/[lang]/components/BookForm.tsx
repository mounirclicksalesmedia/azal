'use client';

import { useState } from 'react';
import type { Dictionary } from '../dictionaries';

type Props = { dict: Dictionary };

export default function BookForm({ dict }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    // Stub: in production, post to /api/book or a CRM endpoint.
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setBusy(false);
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
          {submitted ? dict.cta.thanks : ''}
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
