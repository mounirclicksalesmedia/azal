import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import { getDictionary, getDirection, hasLocale, locales } from './dictionaries';
import PageLoader from './components/PageLoader';
import SmoothScroll from './components/SmoothScroll';

const clashDisplay = localFont({
  src: [
    { path: '../fonts/ClashDisplay-Extralight.ttf', weight: '200', style: 'normal' },
    { path: '../fonts/ClashDisplay-Light.ttf', weight: '300', style: 'normal' },
    { path: '../fonts/ClashDisplay-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../fonts/ClashDisplay-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../fonts/ClashDisplay-Semibold.ttf', weight: '600', style: 'normal' },
    { path: '../fonts/ClashDisplay-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-display',
  display: 'swap',
});

const azaharText = localFont({
  src: [
    { path: '../fonts/AzaharText-Light.otf', weight: '300', style: 'normal' },
    { path: '../fonts/AzaharText-Regular.otf', weight: '400', style: 'normal' },
    { path: '../fonts/AzaharText-Medium.otf', weight: '500', style: 'normal' },
    { path: '../fonts/AzaharText-Bold.otf', weight: '700', style: 'normal' },
    { path: '../fonts/AzaharText-Black.otf', weight: '900', style: 'normal' },
  ],
  variable: '--font-text',
  display: 'swap',
});

const azaharDisplay = localFont({
  src: [
    { path: '../fonts/AzaharAL-VF.woff2', weight: '100 900', style: 'normal' },
  ],
  variable: '--font-display-ar',
  display: 'swap',
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
    alternates: {
      canonical: `/${lang}`,
      languages: {
        ar: '/ar',
        en: '/en',
      },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      type: 'website',
      locale: lang === 'ar' ? 'ar_SA' : 'en_US',
      url: `https://azal.sa/${lang}`,
      siteName: 'Azal',
      images: [
        {
          url: '/opengraph-image.png',
          width: 1167,
          height: 835,
          alt: 'Rawajeh Holding',
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.meta.title,
      description: dict.meta.description,
      images: ['/twitter-image.png'],
    },
    other: {
      'theme-color': '#34271D',
      direction: dir,
    },
  };
}

export default async function LocaleLayout({
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
      className={`${clashDisplay.variable} ${azaharText.variable} ${azaharDisplay.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://tiles.openfreemap.org" crossOrigin="" />
        <link rel="dns-prefetch" href="https://tiles.openfreemap.org" />
        <link rel="dns-prefetch" href="https://unpkg.com" />
        <link
          rel="preload"
          as="image"
          href="/azal/hero/hero-1.jpg"
          fetchPriority="high"
        />
      </head>
      <body className="min-h-full bg-[var(--bg)] text-[var(--ink)] font-text">
        <PageLoader />
        <SmoothScroll />
        <div className="page-content">{children}</div>
      </body>
    </html>
  );
}
