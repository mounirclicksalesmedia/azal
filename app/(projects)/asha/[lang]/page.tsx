import { notFound } from 'next/navigation';
import { getDictionary, hasLocale } from './dictionaries';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import BigQuote from './components/BigQuote';
import Features from './components/Features';
import Location from './components/Location';
import Booking from './components/Booking';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default async function AshaPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <Nav dict={dict} />
      <main>
        <Hero dict={dict} />
        <About dict={dict} />
        <BigQuote dict={dict} />
        <Features dict={dict} />
        <Location dict={dict} />
        <Booking dict={dict} lang={lang} />
        <Contact dict={dict} />
      </main>
      <Footer dict={dict} />
    </>
  );
}
