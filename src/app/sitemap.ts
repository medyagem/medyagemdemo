import { MetadataRoute } from 'next';
import fs from 'fs/promises';
import path from 'path';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://medyagem.com';

  // Statik Rotalar
  const staticRoutes = [
    '',
    '/hakkimizda',
    '/hizmetler',
    '/blog',
    '/bolgeler',
    '/calismalar',
    '/iletisim',
    '/sss',
    '/kvkk',
    '/cerez-politikasi',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dinamik Verileri Çek
  const getDynamicItems = async (file: string) => {
    try {
      const filePath = path.join(process.cwd(), 'data', file);
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return [];
    }
  };

  const [blogItems, serviceItems, regionItems, projectItems] = await Promise.all([
    getDynamicItems('blog.json'),
    getDynamicItems('services.json'),
    getDynamicItems('regions.json'),
    getDynamicItems('projects.json'),
  ]);

  const dynamicRoutes = [
    ...blogItems.map((item: any) => ({
      url: `${baseUrl}/blog/${item.slug}`,
      lastModified: new Date(item.date || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...serviceItems.map((item: any) => ({
      url: `${baseUrl}/hizmetler/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...regionItems.map((item: any) => ({
      url: `${baseUrl}/bolgeler/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
    ...projectItems.map((item: any) => ({
      url: `${baseUrl}/calismalar/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
