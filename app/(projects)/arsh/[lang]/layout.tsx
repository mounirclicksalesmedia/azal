import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic, JetBrains_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { getDictionary, getDirection, hasLocale, locales } from './dictionaries';
import SmoothScroll from './components/SmoothScroll';
import './arsh.css';

const sansArabic = IBM_Plex_Sans_Arabic({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-arsh-body',
});

const mono = JetBrains_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-arsh-mono',
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
      canonical: `/arsh/${lang}`,
      languages: {
        ar: '/arsh/ar',
        en: '/arsh/en',
      },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      type: 'website',
      locale: lang === 'ar' ? 'ar_SA' : 'en_US',
      url: `https://azal.sa/arsh/${lang}`,
      siteName: 'Asha',
    },
    other: {
      'theme-color': '#34271D',
      direction: dir,
    },
  };
}

export default async function ArshLayout({
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
      <body className="arsh-root min-h-full">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
