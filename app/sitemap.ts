import { MetadataRoute } from 'next';

// --- GÜNCEL ALAN ADI ---
const BASE_URL = 'https://www.ezm-danismanlik.com';

async function fetchData(endpoint: string) {
  try {
    // NOT: Siteyi sunucuya yüklediğimizde buradaki localhost yerine Canlı API (Strapi) linkini yazacağız.
    // Şimdilik build alırken hata vermemesi için localhost kalabilir.
    const res = await fetch(`https://ezm-backend-production.up.railway.app/api/${endpoint}?populate=*`, { cache: 'no-store' });
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Statik Sayfalar
  const routes = ['', '/iletisim', '/blog', '/ilanlar'].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }));

  // 2. Dinamik Bloglar
  const bloglar = await fetchData('makales');
  const blogRoutes = bloglar.map((blog: any) => ({
    url: `${BASE_URL}/blog/${blog.slug}`,
    lastModified: new Date(blog.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 3. Dinamik Hizmetler
  const hizmetler = await fetchData('hizmets');
  const hizmetRoutes = hizmetler.map((hizmet: any) => ({
    url: `${BASE_URL}/hizmet/${hizmet.slug}`,
    lastModified: new Date(hizmet.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // 4. Dinamik İlanlar
  const ilanlar = await fetchData('ilans');
  const ilanRoutes = ilanlar.map((ilan: any) => ({
    url: `${BASE_URL}/ilanlar/${ilan.slug}`,
    lastModified: new Date(ilan.updatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [...routes, ...blogRoutes, ...hizmetRoutes, ...ilanRoutes];
}