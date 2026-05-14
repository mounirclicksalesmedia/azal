import { ImageResponse } from 'next/og';
import { readFileSync } from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };
export const alt = 'Azal — Rawajeh Holding';

const COPY = {
  ar: { title: 'أزل', sub: 'تجربة تجارية وعملية متكاملة في الملقا، الرياض' },
  en: { title: 'Azal', sub: 'A complete business experience in Al Malqa, Riyadh' },
} as const;

export default async function Image({ params }: { params: { lang: string } }) {
  const lang = (params.lang === 'ar' ? 'ar' : 'en') as keyof typeof COPY;
  const copy = COPY[lang];

  const svgPath = path.join(process.cwd(), 'public/brand/logo/black_logo.svg');
  const logoB64 = readFileSync(svgPath).toString('base64');
  const logoSrc = `data:image/svg+xml;base64,${logoB64}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#FDF5E4',
          backgroundImage:
            'radial-gradient(circle at 25% 30%, rgba(184,145,94,0.18) 0%, rgba(253,245,228,0) 55%), radial-gradient(circle at 75% 75%, rgba(52,39,29,0.10) 0%, rgba(253,245,228,0) 60%)',
          padding: 80,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          width={460}
          height={350}
          alt=""
          style={{ marginBottom: 36, objectFit: 'contain' }}
        />
        <div
          style={{
            fontSize: 72,
            color: '#34271D',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            marginTop: 8,
          }}
        >
          {copy.title}
        </div>
        <div
          style={{
            fontSize: 26,
            color: '#8A603E',
            fontWeight: 500,
            marginTop: 22,
            textAlign: 'center',
            maxWidth: 920,
          }}
        >
          {copy.sub}
        </div>
      </div>
    ),
    { ...size },
  );
}
