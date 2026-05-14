import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic, JetBrains_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { getDictionary, getDirection, hasLocale, locales } from './dictionaries';
import SmoothScroll from './components/SmoothScroll';
import PageLoader from '@/components/PageLoader/PageLoader';
import './asha.css';

const sansArabic = IBM_Plex_Sans_Arabic({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-asha-body',
});

const mono = JetBrains_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-asha-mono',
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const dir = getDirection(lang);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    metadataBase: new URL('https://azal.sa'),
    icons: {
      icon: [{ url: '/brand/logo/black_logo.svg', type: 'image/svg+xml' }],
      shortcut: [{ url: '/brand/logo/black_logo.svg' }],
      apple: [{ url: '/brand/logo/black_logo.svg', type: 'image/svg+xml' }],
    },
    alternates: {
      canonical: `/asha/${lang}`,
      languages: {
        ar: '/asha/ar',
        en: '/asha/en',
      },
    },
    // openGraph.images and twitter.images are intentionally omitted —
    // Next picks them up from the sibling opengraph-image.tsx and
    // twitter-image.tsx conventions, which render the Rawajeh logo
    // over a cream brand frame.
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      type: 'website',
      locale: lang === 'ar' ? 'ar_SA' : 'en_US',
      url: `https://azal.sa/asha/${lang}`,
      siteName: 'Asha',
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.meta.title,
      description: dict.meta.description,
    },
    other: {
      'theme-color': '#34271D',
      direction: dir,
    },
  };
}

export default async function AshaLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dir = getDirection(lang);

  return (
    <html
      lang={lang}
      dir={dir}
      className={`${sansArabic.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="asha-root min-h-full">
        <PageLoader waitForSelector="video[data-h-video]" />
        <SmoothScroll />
        <div className="page-content">{children}</div>
      </body>
    </html>
  );
}
