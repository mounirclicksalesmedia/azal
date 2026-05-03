'use client';

import { useEffect, useRef } from 'react';
import maplibregl, { Map as MLMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const PROJECT_LNG = 46.6131;
const PROJECT_LAT = 24.7967;

let rtlPluginRequested = false;
function ensureRtlPlugin() {
  if (rtlPluginRequested) return;
  rtlPluginRequested = true;
  const status = maplibregl.getRTLTextPluginStatus?.();
  if (status === 'loaded' || status === 'loading') return;
  maplibregl
    .setRTLTextPlugin(
      'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.3.0/dist/mapbox-gl-rtl-text.js',
      true,
    )
    .catch(() => {
      rtlPluginRequested = false;
    });
}

export default function MapView({ label }: { label: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MLMap | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    ensureRtlPlugin();

    const map = new maplibregl.Map({
      container,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [PROJECT_LNG, PROJECT_LAT],
      zoom: 14.6,
      attributionControl: { compact: true },
    });
    map.setPadding({ top: 70, bottom: 20, left: 20, right: 20 });

    mapRef.current = map;

    map.on('error', (e) => {
      console.warn('[MapView]', e.error?.message ?? e);
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

    const markerEl = document.createElement('div');
    markerEl.className = 'azal-marker';
    markerEl.dir = 'ltr';
    markerEl.innerHTML = `
      <span class="azal-marker__ring azal-marker__ring--1"></span>
      <span class="azal-marker__ring azal-marker__ring--2"></span>
      <span class="azal-marker__ring azal-marker__ring--3"></span>
      <span class="azal-marker__pin">
        <svg viewBox="0 0 36 48" width="36" height="48" aria-hidden="true">
          <path d="M18 47 C 6 30, 1 22, 1 14 A 17 17 0 0 1 35 14 C 35 22, 30 30, 18 47 Z"
                fill="#34271D" stroke="#B8915E" stroke-width="1.2"/>
          <circle cx="18" cy="15" r="6.5" fill="#FDF5E4"/>
          <circle cx="18" cy="15" r="3.2" fill="#B8915E"/>
        </svg>
      </span>
    `;

    new maplibregl.Marker({ element: markerEl, anchor: 'bottom' })
      .setLngLat([PROJECT_LNG, PROJECT_LAT])
      .addTo(map);

    map.on('load', () => {
      map.resize();
      map.easeTo({
        zoom: 15.6,
        pitch: 50,
        bearing: -18,
        duration: 2600,
        padding: { top: 70, bottom: 20, left: 20, right: 20 },
      });
    });

    const ro = new ResizeObserver(() => {
      mapRef.current?.resize();
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      className="azal-map relative rounded-2xl overflow-hidden border"
      style={{ borderColor: 'var(--line)', aspectRatio: '4/3' }}
    >
      <div
        ref={containerRef}
        aria-label={label}
        data-lenis-prevent
        className="azal-map__canvas absolute inset-0 w-full h-full"
      />
      <div className="azal-map-tag" dir="ltr" aria-hidden>
        <span className="azal-map-tag__dot" />
        <span className="azal-map-tag__text">AZAL</span>
      </div>
      <div className="azal-map-badge">
        <span className="azal-map-badge__dot" />
        <span>{PROJECT_LAT.toFixed(4)}° N · {PROJECT_LNG.toFixed(4)}° E</span>
      </div>
    </div>
  );
}
