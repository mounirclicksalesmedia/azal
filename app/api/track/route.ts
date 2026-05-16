import { NextResponse } from 'next/server';
import { createHash } from 'crypto';

export const runtime = 'nodejs';

type EventName = 'page_view' | 'form_submit' | 'whatsapp_click' | 'call_click';

type TrackInput = {
  event: EventName;
  event_id?: string;
  url?: string;
  user_agent?: string;
  email?: string;
  phone?: string;
  name?: string;
};

const TT_BASE = process.env.NEXT_PUBLIC_AZAL_TIKTOK_PIXEL_BASE!;
const TT_WA = process.env.NEXT_PUBLIC_AZAL_TIKTOK_PIXEL_WHATSAPP!;
const TT_CALL = process.env.NEXT_PUBLIC_AZAL_TIKTOK_PIXEL_CALL!;
const TT_TOKEN_BASE = process.env.AZAL_TIKTOK_TOKEN_BASE!;
const TT_TOKEN_WA = process.env.AZAL_TIKTOK_TOKEN_WHATSAPP!;
const TT_TOKEN_CALL = process.env.AZAL_TIKTOK_TOKEN_CALL!;
const LI_PARTNER = process.env.NEXT_PUBLIC_AZAL_LINKEDIN_PARTNER_ID!;
const LI_FORM = process.env.NEXT_PUBLIC_AZAL_LINKEDIN_CONV_FORM!;
const LI_WA = process.env.NEXT_PUBLIC_AZAL_LINKEDIN_CONV_WHATSAPP!;
const LI_CALL = process.env.NEXT_PUBLIC_AZAL_LINKEDIN_CONV_CALL!;
const LI_TOKEN = process.env.AZAL_LINKEDIN_TOKEN!;
const SNAP_ID = process.env.NEXT_PUBLIC_AZAL_SNAP_PIXEL_ID!;
const SNAP_TOKEN = process.env.AZAL_SNAP_TOKEN!;

function sha256(value?: string) {
  if (!value) return undefined;
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

function clientIp(req: Request) {
  const xf = req.headers.get('x-forwarded-for');
  if (xf) return xf.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? undefined;
}

async function sendTikTok(opts: {
  pixel: string;
  token: string;
  ttEvent: string;
  input: TrackInput;
  ip?: string;
}) {
  const body = {
    event_source: 'web',
    event_source_id: opts.pixel,
    data: [
      {
        event: opts.ttEvent,
        event_time: Math.floor(Date.now() / 1000),
        event_id: opts.input.event_id,
        user: {
          email: sha256(opts.input.email),
          phone: sha256(opts.input.phone),
          ip: opts.ip,
          user_agent: opts.input.user_agent,
        },
        page: { url: opts.input.url },
      },
    ],
  };
  return fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Token': opts.token,
    },
    body: JSON.stringify(body),
  });
}

async function sendSnap(opts: { snapEvent: string; input: TrackInput; ip?: string }) {
  const body = {
    data: [
      {
        event_name: opts.snapEvent,
        action_source: 'website',
        event_source_url: opts.input.url,
        event_time: Math.floor(Date.now() / 1000),
        user_data: {
          em: opts.input.email ? [sha256(opts.input.email)] : undefined,
          ph: opts.input.phone ? [sha256(opts.input.phone)] : undefined,
          user_agent: opts.input.user_agent,
          client_ip_address: opts.ip,
        },
        custom_data: { event_id: opts.input.event_id },
      },
    ],
  };
  return fetch(
    `https://tr.snapchat.com/v3/${SNAP_ID}/events?access_token=${encodeURIComponent(SNAP_TOKEN)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  );
}

async function sendLinkedIn(opts: { convId: string; input: TrackInput }) {
  const userIds: { idType: string; idValue: string }[] = [];
  if (opts.input.email) userIds.push({ idType: 'SHA256_EMAIL', idValue: sha256(opts.input.email)! });

  const body = {
    conversion: `urn:lla:llaPartnerConversion:${opts.convId}`,
    conversionHappenedAt: Date.now(),
    user: { userIds },
  };
  return fetch('https://api.linkedin.com/rest/conversionEvents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${LI_TOKEN}`,
      'LinkedIn-Version': '202401',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body),
  });
}

export async function POST(req: Request) {
  let input: TrackInput;
  try {
    input = (await req.json()) as TrackInput;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!input?.event) return NextResponse.json({ ok: false }, { status: 400 });

  const ip = clientIp(req);
  const tasks: Promise<unknown>[] = [];

  if (input.event === 'page_view') {
    tasks.push(sendTikTok({ pixel: TT_BASE, token: TT_TOKEN_BASE, ttEvent: 'Pageview', input, ip }));
    tasks.push(sendSnap({ snapEvent: 'PAGE_VIEW', input, ip }));
  } else if (input.event === 'form_submit') {
    tasks.push(sendTikTok({ pixel: TT_BASE, token: TT_TOKEN_BASE, ttEvent: 'CompleteRegistration', input, ip }));
    tasks.push(sendSnap({ snapEvent: 'SIGN_UP', input, ip }));
    if (input.email) tasks.push(sendLinkedIn({ convId: LI_FORM, input }));
  } else if (input.event === 'whatsapp_click') {
    tasks.push(sendTikTok({ pixel: TT_WA, token: TT_TOKEN_WA, ttEvent: 'Contact', input, ip }));
    tasks.push(sendSnap({ snapEvent: 'CUSTOM_EVENT_1', input, ip }));
    if (input.email) tasks.push(sendLinkedIn({ convId: LI_WA, input }));
  } else if (input.event === 'call_click') {
    tasks.push(sendTikTok({ pixel: TT_CALL, token: TT_TOKEN_CALL, ttEvent: 'Contact', input, ip }));
    tasks.push(sendSnap({ snapEvent: 'CUSTOM_EVENT_2', input, ip }));
    if (input.email) tasks.push(sendLinkedIn({ convId: LI_CALL, input }));
  } else {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const results = await Promise.allSettled(tasks);
  const failed = results
    .map((r, i) => ({ r, i }))
    .filter(({ r }) => r.status === 'rejected' || (r.status === 'fulfilled' && r.value instanceof Response && !r.value.ok));
  if (failed.length) {
    console.warn('azal track partial failure', failed.length, 'of', results.length);
  }
  return NextResponse.json({ ok: true });
}
