import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    // --- GÜNCEL SITEMAP ADRESİ ---
    sitemap: 'https://www.ezm-danismanlik.com/sitemap.xml',
  };
}