import 'server-only';

export const locales = ['ar', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ar';

const dictionaries = {
  ar: () => import('./dictionaries/ar.json').then((m) => m.default),
  en: () => import('./dictionaries/en.json').then((m) => m.default),
} as const;

export const hasLocale = (locale: string): locale is Locale =>
  (locales as readonly string[]).includes(locale);

export const getDictionary = async (locale: Locale) => dictionaries[locale]();

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

export const getDirection = (locale: Locale): 'rtl' | 'ltr' =>
  locale === 'ar' ? 'rtl' : 'ltr';
