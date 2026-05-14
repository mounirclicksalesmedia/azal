'use client';

import { useState, useTransition } from 'react';
import type { Project } from '@/lib/supabase/types';
import { createUtmLink } from '../actions';

type Props = { project: Project };

const DEFAULT_DESTINATION: Record<Project, string> = {
  azal: '/azal/ar',
  asha: '/asha/ar',
};

export default function UtmCreateForm({ project }: Props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createUtmLink(fd);
      if (res?.error) {
        setError(res.error);
        return;
      }
      (e.target as HTMLFormElement).reset();
      setOpen(false);
    });
  };

  if (!open) {
    return (
      <div className="dash-utm-toolbar">
        <button
          type="button"
          className="dash-btn dash-btn-primary"
          onClick={() => setOpen(true)}
        >
          + New UTM link
        </button>
      </div>
    );
  }

  return (
    <form className="dash-utm-form-grid" onSubmit={onSubmit}>
      <input type="hidden" name="project" value={project} />

      <label>
        Channel name
        <input
          name="name"
          required
          placeholder="Azal — Instagram"
          className="dash-input"
        />
      </label>

      <label>
        Slug
        <input
          name="slug"
          required
          placeholder="instagram"
          pattern="[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
          className="dash-input"
        />
      </label>

      <label>
        utm_source
        <input name="source" required placeholder="instagram" className="dash-input" />
      </label>

      <label>
        utm_medium
        <input name="medium" required placeholder="social" className="dash-input" />
      </label>

      <label>
        utm_campaign
        <input name="campaign" required placeholder="azal_launch" className="dash-input" />
      </label>

      <label>
        utm_term <span style={{ opacity: 0.55 }}>(optional)</span>
        <input name="term" className="dash-input" />
      </label>

      <label>
        utm_content <span style={{ opacity: 0.55 }}>(optional)</span>
        <input name="content" className="dash-input" />
      </label>

      <label style={{ gridColumn: '1 / -1' }}>
        Destination URL or path
        <input
          name="destination"
          required
          defaultValue={DEFAULT_DESTINATION[project]}
          className="dash-input"
        />
      </label>

      <div
        style={{
          gridColumn: '1 / -1',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <button type="submit" className="dash-btn dash-btn-primary" disabled={pending}>
          {pending ? 'Saving…' : 'Save link'}
        </button>
        <button
          type="button"
          className="dash-btn"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
        >
          Cancel
        </button>
        {error ? (
          <span style={{ color: '#b0413e', fontSize: '0.82rem' }}>{error}</span>
        ) : null}
      </div>
    </form>
  );
}
