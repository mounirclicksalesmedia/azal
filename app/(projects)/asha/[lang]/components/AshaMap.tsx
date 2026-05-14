'use client';

import { useEffect, useRef, useState } from 'react';
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

type Props = {
  badge: string;
  pinTtl: string;
  pinSub: string;
};

export default function AshaMap({ badge, pinTtl, pinSub }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MLMap | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current || failed) return;

    ensureRtlPlugin();

    let map: MLMap;
    try {
      map = new maplibregl.Map({
        container,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [PROJECT_LNG, PROJECT_LAT],
        zoom: 14.4,
        pitch: 0,
        bearing: 0,
        attributionControl: { compact: true },
      });
    } catch (error) {
      console.warn('[AshaMap]', error);
      window.requestAnimationFrame(() => setFailed(true));
      return;
    }

    map.setPadding({ top: 120, bottom: 30, left: 20, right: 20 });
    mapRef.current = map;

    map.on('error', (e) => {
      console.warn('[AshaMap]', e.error?.message ?? e);
    });

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }),
      'top-right',
    );

    const markerEl = document.createElement('div');
    markerEl.className = 'asha-marker';
    markerEl.dir = 'ltr';
    markerEl.innerHTML = `
      <div class="asha-marker__card">
        <span class="asha-marker__dot"></span>
        <div class="asha-marker__txt">
          <div class="asha-marker__ttl"></div>
          <div class="asha-marker__sub"></div>
        </div>
      </div>
      <div class="asha-marker__stack">
        <span class="asha-marker__ring asha-marker__ring--1"></span>
        <span class="asha-marker__ring asha-marker__ring--2"></span>
        <span class="asha-marker__ring asha-marker__ring--3"></span>
        <span class="asha-marker__pin">
          <svg viewBox="0 0 36 48" width="34" height="46" aria-hidden="true">
            <path d="M18 47 C 6 30, 1 22, 1 14 A 17 17 0 0 1 35 14 C 35 22, 30 30, 18 47 Z"
                  fill="#34271D" stroke="#B8915E" stroke-width="1.2"/>
            <circle cx="18" cy="15" r="6.5" fill="#FDF5E4"/>
            <circle cx="18" cy="15" r="3.2" fill="#B8915E"/>
          </svg>
        </span>
      </div>
    `;

    // inject the dictionary-driven strings safely
    const ttlNode = markerEl.querySelector('.asha-marker__ttl');
    const subNode = markerEl.querySelector('.asha-marker__sub');
    if (ttlNode) ttlNode.textContent = pinTtl;
    if (subNode) subNode.textContent = pinSub;

    new maplibregl.Marker({ element: markerEl, anchor: 'bottom' })
      .setLngLat([PROJECT_LNG, PROJECT_LAT])
      .addTo(map);

    map.on('load', () => {
      map.resize();
      map.easeTo({
        zoom: 15.6,
        pitch: 52,
        bearing: -22,
        duration: 2800,
        padding: { top: 120, bottom: 30, left: 20, right: 20 },
      });
      // a little entrance: drop-in animation on the marker
      window.requestAnimationFrame(() => {
        markerEl.classList.add('is-in');
      });
    });

    const ro = new ResizeObserver(() => mapRef.current?.resize());
    ro.observe(container);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, [failed, pinTtl, pinSub]);

  return (
    <>
      <div
        ref={containerRef}
        aria-label={badge}
        data-lenis-prevent
        className="asha-map-canvas"
      />
      {failed && (
        <div className="asha-map-fallback" aria-hidden>
          <span className="asha-map-fallback__pin">
            <svg viewBox="0 0 36 48" width="36" height="48">
              <path
                d="M18 47 C 6 30, 1 22, 1 14 A 17 17 0 0 1 35 14 C 35 22, 30 30, 18 47 Z"
                fill="#34271D"
                stroke="#B8915E"
                strokeWidth="1.2"
              />
              <circle cx="18" cy="15" r="6.5" fill="#FDF5E4" />
              <circle cx="18" cy="15" r="3.2" fill="#B8915E" />
            </svg>
          </span>
          <span className="asha-map-fallback__label">{badge}</span>
        </div>
      )}
      <div className="asha-map-badge">
        <span className="asha-map-badge__dot" />
        <span>{badge}</span>
      </div>
      <div className="asha-map-geo" dir="ltr">
        {PROJECT_LAT.toFixed(4)}° N · {PROJECT_LNG.toFixed(4)}° E
      </div>
    </>
  );
}
