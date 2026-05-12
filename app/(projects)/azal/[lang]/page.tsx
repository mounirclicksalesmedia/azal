import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { getDictionary, getDirection, hasLocale } from './dictionaries';
import Nav from './components/Nav';
import About from './components/About';
import Features from './components/Features';
import Marquee from './components/Marquee';
import Gallery from './components/Gallery';
import Location from './components/Location';
import Contact from './components/Contact';
import Footer from './components/Footer';
import StickyWhatsapp from './components/StickyWhatsapp';

const Hero = dynamic(() => import('./components/Hero'), {
  loading: () => (
    <section
      aria-hidden
      style={{ height: '100vh', minHeight: '680px', background: '#0B0805' }}
    />
  ),
});

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const dir = getDirection(lang);

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: dict.hero.titleLine1,
    description: dict.meta.description,
    inLanguage: lang,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Anas bin Malik Road',
      addressLocality: 'Riyadh',
      addressRegion: 'Al Malqa',
      addressCountry: 'SA',
    },
    brand: {
      '@type': 'Organization',
      name: 'Rawajeh Holding',
    },
  };

  return (
    <>
      <Nav dict={dict} lang={lang} />
      <main>
        <Hero dict={dict} dir={dir} />
        <About dict={dict} />
        <Marquee dict={dict} />
        <Features dict={dict} />
        <Gallery dict={dict} dir={dir} />
        <Location dict={dict} />
        <Contact dict={dict} />
      </main>
      <Footer dict={dict} lang={lang} />
      <StickyWhatsapp dict={dict} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </>
  );
}
