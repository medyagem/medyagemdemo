const { PrismaClient } = require('@prisma/client');
const fs = require('fs/promises');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Seed işlemi başlıyor...');
  const dataDir = path.join(process.cwd(), 'data');

  async function readJson(filename) {
    try {
      const raw = await fs.readFile(path.join(dataDir, filename), 'utf-8');
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  // 1. Settings
  const settings = await readJson('settings.json');
  if (Object.keys(settings).length > 0) {
    await prisma.siteSetting.upsert({
      where: { group: 'general' },
      update: { data_json: JSON.stringify(settings) },
      create: { group: 'general', data_json: JSON.stringify(settings) },
    });
    console.log('Site ayarları yüklendi.');
  }

  // 2. Blog Categories
  const blogCats = await readJson('blog-categories.json');
  for (const cat of blogCats) {
    await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, order_no: cat.order_no },
      create: { id: cat.id, name: cat.name, slug: cat.slug, description: cat.description, order_no: cat.order_no },
    });
  }
  console.log('Blog kategorileri yüklendi.');

  // 3. Blog Posts
  const posts = await readJson('blog.json');
  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content_json: post.content_json || JSON.stringify(post.content || {}),
        cover_image: post.cover_image,
        category_id: post.category_id,
        author_name: post.author_name || 'Admin',
        published_at: post.published_at ? new Date(post.published_at) : new Date(),
        is_active: post.is_active ?? true,
      },
      create: {
        id: post.id.includes('demo') ? undefined : post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content_json: post.content_json || JSON.stringify(post.content || {}),
        cover_image: post.cover_image,
        category_id: post.category_id,
        author_name: post.author_name || 'Admin',
        published_at: post.published_at ? new Date(post.published_at) : new Date(),
        is_active: post.is_active ?? true,
      },
    });
  }
  console.log('Blog yazıları yüklendi.');

  // 4. Service Categories
  const serviceCats = await readJson('service-categories.json');
  for (const cat of serviceCats) {
    await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, order_no: cat.order_no },
      create: { id: cat.id, name: cat.name, slug: cat.slug, description: cat.description, order_no: cat.order_no },
    });
  }
  console.log('Hizmet kategorileri yüklendi.');

  // 5. Services
  const services = await readJson('services.json');
  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        card_title: s.card_title || s.name,
        card_description: s.card_description,
        card_icon: s.card_icon,
        hero_title: s.hero_title,
        hero_description: s.hero_description,
        overview_content: s.overview_content,
        category_id: s.category_id,
        is_active: s.is_active ?? true,
      },
      create: {
        id: s.id.includes('demo') ? undefined : s.id,
        name: s.name,
        slug: s.slug,
        card_title: s.card_title || s.name,
        card_description: s.card_description,
        card_icon: s.card_icon,
        hero_title: s.hero_title,
        hero_description: s.hero_description,
        overview_content: s.overview_content,
        category_id: s.category_id,
        is_active: s.is_active ?? true,
      },
    });
  }
  console.log('Hizmetler yüklendi.');

  // 6. Projects
  const projects = await readJson('projects.json');
  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: { project_name: p.project_name, client_name: p.client_name, summary: p.summary, cover_image: p.cover_image, website_url: p.website_url },
      create: { id: p.id.includes('demo') ? undefined : p.id, project_name: p.project_name, slug: p.slug, client_name: p.client_name, summary: p.summary, cover_image: p.cover_image, website_url: p.website_url },
    });
  }
  console.log('Projeler yüklendi.');

  // 7. Pages
  const pages = await readJson('pages.json');
  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: { title: page.title, page_key: page.page_key, hero_title: page.hero_title, hero_description: page.hero_description, content_json: page.content_json, status: page.status },
      create: { id: page.id.includes('demo') ? undefined : page.id, title: page.title, slug: page.slug, page_key: page.page_key, hero_title: page.hero_title, hero_description: page.hero_description, content_json: page.content_json, status: page.status },
    });
  }
  console.log('Sayfalar yüklendi.');

  // 8. Regions
  const regions = await readJson('regions.json');
  for (const r of regions) {
    await prisma.region.upsert({
      where: { slug: r.slug },
      update: { name: r.name, short_description: r.short_description, hero_title: r.hero_title, hero_description: r.hero_description, overview_content: r.overview_content },
      create: { id: r.id.includes('demo') ? undefined : r.id, name: r.name, slug: r.slug, short_description: r.short_description, hero_title: r.hero_title, hero_description: r.hero_description, overview_content: r.overview_content },
    });
  }
  console.log('Bölgeler yüklendi.');

  // 9. FAQ
  const faqs = await readJson('faq.json');
  for (const f of faqs) {
    await prisma.faqItem.create({
      data: { group_key: f.group_key, question: f.question, answer: f.answer, order_no: f.order_no || 0, is_active: f.is_active ?? true },
    });
  }
  console.log('SSS yüklendi.');

  // 10. Homepage Sections
  const sectionKeys = ['hero', 'hakkimizda', 'whymedyagem', 'projeler', 'surec', 'blog_preview', 'hizmetbolgeleri', 'faq', 'testimonials', 'cta'];
  const sectionsDir = path.join(dataDir, 'sections');
  
  for (const key of sectionKeys) {
    try {
      const filePath = path.join(sectionsDir, `${key}.json`);
      const raw = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(raw);
      
      await prisma.homepageSection.upsert({
        where: { section_key: key },
        update: { content_json: JSON.stringify(data) },
        create: { 
          section_key: key, 
          content_json: JSON.stringify(data),
          display_order: sectionKeys.indexOf(key) + 1
        },
      });
    } catch (e) {
      // console.log(`${key} bölümü için JSON bulunamadı.`);
    }
  }
  console.log('Ana sayfa bölümleri yüklendi.');

  console.log('Seed işlemi başarıyla tamamlandı.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
