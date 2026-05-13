'use client';

import { useState, useTransition } from 'react';
import { buildUtmUrl, type UtmLink } from '@/lib/supabase/types';
import { archiveUtmLink, restoreUtmLink } from '../actions';

type Props = {
  links: UtmLink[];
  leadCounts: Record<string, number>;
  origin: string;
  canEdit: boolean;
};

export default function UtmTable({ links, leadCounts, origin, canEdit }: Props) {
  if (links.length === 0) {
    return (
      <div className="dash-empty">
        No UTM links yet for this project — create one above.
      </div>
    );
  }

  return (
    <div className="dash-table-wrap">
      <table className="dash-table dash-table-spaced">
        <thead>
          <tr>
            <th>Channel</th>
            <th>Source / Medium</th>
            <th>Campaign</th>
            <th>Tagged URL</th>
            <th style={{ width: 70 }}>Leads</th>
            {canEdit ? <th style={{ width: 100 }}></th> : null}
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <Row
              key={link.id}
              link={link}
              url={buildUtmUrl(link, origin)}
              leads={leadCounts[link.id] ?? 0}
              canEdit={canEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row({
  link,
  url,
  leads,
  canEdit,
}: {
  link: UtmLink;
  url: string;
  leads: number;
  canEdit: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();
  const archived = link.archived_at !== null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  const toggleArchive = () => {
    const fd = new FormData();
    fd.set('id', link.id);
    startTransition(async () => {
      if (archived) await restoreUtmLink(fd);
      else await archiveUtmLink(fd);
    });
  };

  return (
    <tr className={archived ? 'dash-utm-archived' : undefined}>
      <td>
        <div className="dash-utm-channel">{link.name}</div>
        <div className="dash-mono" style={{ opacity: 0.6, fontSize: '0.78rem' }}>
          {link.slug}
        </div>
      </td>
      <td className="dash-mono">
        {link.source} / {link.medium}
      </td>
      <td className="dash-mono">{link.campaign}</td>
      <td>
        <div className="dash-utm-url" title={url}>
          {url}
        </div>
        <button
          type="button"
          className="dash-utm-copy"
          onClick={copy}
          data-copied={copied}
          style={{ marginTop: '0.4rem' }}
        >
          {copied ? 'Copied!' : 'Copy URL'}
        </button>
      </td>
      <td className="dash-mono">{leads}</td>
      {canEdit ? (
        <td>
          <button
            type="button"
            className="dash-btn"
            onClick={toggleArchive}
            disabled={pending}
          >
            {archived ? 'Restore' : 'Archive'}
          </button>
        </td>
      ) : null}
    </tr>
  );
}
