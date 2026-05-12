import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://azal.sa';
  return [
    {
      url: `${base}/azal/ar`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: { languages: { ar: `${base}/azal/ar`, en: `${base}/azal/en` } },
    },
    {
      url: `${base}/azal/en`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: { languages: { ar: `${base}/azal/ar`, en: `${base}/azal/en` } },
    },
  ];
}
