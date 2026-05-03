import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://azal.sa/sitemap.xml',
    host: 'https://azal.sa',
  };
}
