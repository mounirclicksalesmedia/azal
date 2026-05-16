'use client';

import Script from 'next/script';
import { useEffect } from 'react';

const TT_BASE = process.env.NEXT_PUBLIC_AZAL_TIKTOK_PIXEL_BASE!;
const TT_WA = process.env.NEXT_PUBLIC_AZAL_TIKTOK_PIXEL_WHATSAPP!;
const TT_CALL = process.env.NEXT_PUBLIC_AZAL_TIKTOK_PIXEL_CALL!;
const LI_PARTNER = process.env.NEXT_PUBLIC_AZAL_LINKEDIN_PARTNER_ID!;
const LI_FORM = process.env.NEXT_PUBLIC_AZAL_LINKEDIN_CONV_FORM!;
const LI_WA = process.env.NEXT_PUBLIC_AZAL_LINKEDIN_CONV_WHATSAPP!;
const LI_CALL = process.env.NEXT_PUBLIC_AZAL_LINKEDIN_CONV_CALL!;
const SNAP_ID = process.env.NEXT_PUBLIC_AZAL_SNAP_PIXEL_ID!;
const X_ID = process.env.NEXT_PUBLIC_AZAL_X_PIXEL_ID!;

type WindowWithPixels = Window & {
  ttq?: { load: (id: string) => void; page: () => void; instance: (id: string) => { track: (e: string, p?: Record<string, unknown>) => void } };
  lintrk?: (action: string, payload?: { conversion_id: number }) => void;
  snaptr?: (...args: unknown[]) => void;
  twq?: (...args: unknown[]) => void;
  azalTrack?: AzalTracker;
};

export type AzalEvent = 'form_submit' | 'whatsapp_click' | 'call_click';

type AzalTracker = (event: AzalEvent, payload?: { email?: string; phone?: string; name?: string }) => void;

function newEventId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function Pixels() {
  useEffect(() => {
    const w = window as WindowWithPixels;

    // TikTok — load all three pixels and fire base PageView on the main one
    if (w.ttq) {
      try {
        w.ttq.load(TT_BASE);
        w.ttq.load(TT_WA);
        w.ttq.load(TT_CALL);
        w.ttq.page();
      } catch {}
    }

    // Snap — base init + PAGE_VIEW
    if (w.snaptr) {
      try {
        w.snaptr('init', SNAP_ID);
        w.snaptr('track', 'PAGE_VIEW');
      } catch {}
    }

    // X — base config already fired by inline script; nothing else needed here.
    // LinkedIn insight tag auto-fires page load.

    // Send server-side PageView via Conversions API
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'page_view',
        event_id: newEventId(),
        url: window.location.href,
        user_agent: navigator.userAgent,
      }),
      keepalive: true,
    }).catch(() => {});

    // Expose a tracker on window for components
    const tracker: AzalTracker = (event, payload) => {
      const eventId = newEventId();

      try {
        if (event === 'form_submit') {
          w.ttq?.instance(TT_BASE).track('CompleteRegistration', { event_id: eventId });
          w.lintrk?.('track', { conversion_id: Number(LI_FORM) });
          w.snaptr?.('track', 'SIGN_UP', { event_id: eventId });
          w.twq?.('event', 'tw-' + X_ID + '-form', { conversion_id: eventId });
        } else if (event === 'whatsapp_click') {
          w.ttq?.instance(TT_WA).track('Contact', { event_id: eventId });
          w.lintrk?.('track', { conversion_id: Number(LI_WA) });
          w.snaptr?.('track', 'CUSTOM_EVENT_1', { event_id: eventId, content_category: ['whatsapp'] });
          w.twq?.('event', 'tw-' + X_ID + '-whatsapp', { conversion_id: eventId });
        } else if (event === 'call_click') {
          w.ttq?.instance(TT_CALL).track('Contact', { event_id: eventId });
          w.lintrk?.('track', { conversion_id: Number(LI_CALL) });
          w.snaptr?.('track', 'CUSTOM_EVENT_2', { event_id: eventId, content_category: ['call'] });
          w.twq?.('event', 'tw-' + X_ID + '-call', { conversion_id: eventId });
        }
      } catch {}

      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event,
          event_id: eventId,
          url: window.location.href,
          user_agent: navigator.userAgent,
          email: payload?.email,
          phone: payload?.phone,
          name: payload?.name,
        }),
        keepalive: true,
      }).catch(() => {});
    };

    w.azalTrack = tracker;
    return () => {
      if (w.azalTrack === tracker) delete w.azalTrack;
    };
  }, []);

  return (
    <>
      {/* TikTok base */}
      <Script id="tiktok-base" strategy="afterInteractive">{`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
}(window, document, 'ttq');
      `}</Script>

      {/* LinkedIn Insight */}
      <Script id="linkedin-insight" strategy="afterInteractive">{`
_linkedin_partner_id = "${LI_PARTNER}";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);
(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s);})(window.lintrk);
      `}</Script>

      {/* Snap Pixel */}
      <Script id="snap-pixel" strategy="afterInteractive">{`
(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s='script';r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u);})(window,document,'https://sc-static.net/scevent.min.js');
      `}</Script>

      {/* X (Twitter) base */}
      <Script id="x-base" strategy="afterInteractive">{`
!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
twq('config','${X_ID}');
      `}</Script>

      {/* LinkedIn noscript fallback */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://px.ads.linkedin.com/collect/?pid=${LI_PARTNER}&fmt=gif`}
        />
      </noscript>
    </>
  );
}
