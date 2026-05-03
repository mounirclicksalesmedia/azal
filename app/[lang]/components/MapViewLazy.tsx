'use client';

import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div
      className="azal-map relative rounded-2xl overflow-hidden border"
      style={{ borderColor: 'var(--line)', aspectRatio: '4/3' }}
      aria-hidden
    />
  ),
});

export default function MapViewLazy({ label }: { label: string }) {
  return <MapView label={label} />;
}
