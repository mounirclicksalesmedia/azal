import Image from 'next/image';
import Link from 'next/link';
import type { Dictionary, Locale } from '../dictionaries';

const PHONE = '+966 50 225 0056';
const WHATSAPP_DISPLAY = '+966 57 377 8850';
const EMAIL = 'Commercial@wasf.com.sa';

export default function Footer({ dict, lang }: { dict: Dictionary; lang: Locale }) {
  const otherLang: Locale = lang === 'ar' ? 'en' : 'ar';
  return (
    <footer
      className="relative"
      style={{ background: '#0E0A07', color: 'rgba(253,245,228,0.78)' }}
    >
      <div className="container-x py-16 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <Image
            src="/brand/azal-logo-white.png"
            alt="Azal"
            width={1167}
            height={835}
            className="h-20 w-auto object-contain"
          />
          <p className="mt-4 max-w-md text-sm" style={{ lineHeight: 1.8 }}>
            {dict.footer.tagline}
          </p>
        </div>
        <div className="lg:col-span-3">
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--cream)]/50">
            {dict.nav.contact}
          </div>
          <ul className="footer-contact-list">
            <li>
              <span>{dict.contact.email}</span>
              <bdi dir="ltr">{EMAIL}</bdi>
            </li>
            <li>
              <span>{dict.contact.whatsapp}</span>
              <bdi dir="ltr">{WHATSAPP_DISPLAY}</bdi>
            </li>
            <li>
              <span>{dict.contact.phone}</span>
              <bdi dir="ltr">{PHONE}</bdi>
            </li>
            <li>
              <span>{dict.location.kicker}</span>
              <span>{dict.location.address}</span>
            </li>
          </ul>
        </div>
        <div className="lg:col-span-4 lg:text-end">
          <Link href={`/${otherLang}`} className="under-link text-sm text-[var(--cream)]/85">
            {dict.nav.language}
          </Link>
          <div className="mt-6 flex gap-5 lg:justify-end text-sm">
            <a href="#" className="under-link">{dict.footer.privacy}</a>
            <a href="#" className="under-link">{dict.footer.terms}</a>
          </div>
        </div>
      </div>
      <div
        className="border-t py-6 text-xs"
        style={{ borderColor: 'rgba(253,245,228,0.08)' }}
      >
        <div className="container-x flex flex-wrap items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} Rawajeh Holding. {dict.footer.rights}.</span>
          <span className="opacity-60">Riyadh, KSA</span>
        </div>
      </div>
    </footer>
  );
}
