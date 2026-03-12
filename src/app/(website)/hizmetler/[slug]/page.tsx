import { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ReviewSystem from "@/components/ui/ReviewSystem";
import ShareButtons from "@/components/ui/ShareButtons";
import { CheckCircle2, ArrowLeft, ChevronRight, Clock, Shield, Zap, BarChart3, Target, Layers } from "lucide-react";
import Link from "next/link";
import Faq from "@/sections/Faq";
import Cta from "@/sections/Cta";
import { getServiceBySlug, getServices, getBlogPosts, getServiceCategories } from "@/lib/data-fetchers";
import { notFound } from "next/navigation";

const FAKE_REVIEWS = [
  { id: "1", author: "Ahmet Yılmaz", rating: 5, content: "Süreç çok şeffaf ilerledi. Aldığımız hizmet sonrası müşteri dönüşlerimiz %40 arttı.", date: "12 Mart 2026" },
  { id: "2", author: "Ayşe Kaya", rating: 5, content: "Google Ads kampanyalarımızı baştan yarattılar. Boşa giden harcamalarımız durdu.", date: "5 Mart 2026" }
];

const PROCESS_STEPS = [
  { no: "01", t: "Analiz", icon: Target, desc: "Sektör ve rakip analizi yapılır" },
  { no: "02", t: "Strateji", icon: Layers, desc: "Özel strateji belirlenir" },
  { no: "03", t: "Kurulum", icon: Zap, desc: "Sistemler kurulur ve aktive edilir" },
  { no: "04", t: "Optimizasyon", icon: BarChart3, desc: "Veriye dayalı iyileştirme yapılır" },
  { no: "05", t: "Rapor", icon: Shield, desc: "Aylık performans raporu sunulur" }
];

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);
  if (!service) return { title: "Hizmet Bulunamadı | MedyaGem" };

  return {
    title: `${service.hero_title || service.name} | MedyaGem Hizmetler`,
    description: service.hero_description || "MedyaGem dijital pazarlama çözümleri.",
    openGraph: {
      title: service.hero_title || service.name,
      description: service.hero_description ?? undefined,
      url: `https://medyagem.com/hizmetler/${params.slug}`,
      images: service.cover_image ? [{ url: service.cover_image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.hero_title || service.name} | MedyaGem Hizmetler`,
      description: service.hero_description || "MedyaGem dijital pazarlama çözümleri.",
      images: service.cover_image ? [service.cover_image] : [],
    },
  };
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const [service, allServices, allPosts, categories] = await Promise.all([
    getServiceBySlug(params.slug),
    getServices(),
    getBlogPosts(),
    getServiceCategories()
  ]);

  if (!service) {
    notFound();
  }

  const category = categories.find((c: any) => c.id === service.category_id);

  const currentUrl = `https://medyagem.com/hizmetler/${params.slug}`;
  const serviceName = service.name || service.card_title || params.slug.replace(/-/g, " ").toUpperCase();
  const heroTitle = service.hero_title || serviceName;
  const heroDesc = service.hero_description || `Profesyonel ekibimizle ${serviceName.toLowerCase()} süreçlerinizi baştan uca tasarlıyor, yönetiyor ve raporluyoruz.`;
  const overviewContent = service.overview_content || "";
  const otherServices = allServices.filter((s: any) => s.slug !== params.slug).slice(0, 5);
  const relatedPosts = allPosts.filter((p: any) => p.related_service === params.slug).slice(0, 3);

  const getReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const noOfWords = text.split(/\s/g).length;
    return `${Math.ceil(noOfWords / wordsPerMinute)} Dk Okuma`;
  };

  const getTOC = (html: string) => {
    const headings: { id: string, text: string }[] = [];
    const regex = /<h2.*?>(.*?)<\/h2>/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      const text = match[1].replace(/<[^>]*>/g, ""); // strip tags
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      headings.push({ id, text });
    }
    return headings;
  };

  const readingTime = overviewContent ? getReadingTime(overviewContent) : "5 Dk Okuma";
  const tocItems = getTOC(overviewContent);

  const processedContent = overviewContent.replace(/<h2(.*?)>(.*?)<\/h2>/g, (match: string, attr: string, titleSnippet: string) => {
    const cleanTitle = titleSnippet.replace(/<[^>]*>/g, "");
    const id = cleanTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    return `<h2 id="${id}"${attr}>${titleSnippet}</h2>`;
  });

  // FAQ Schema
  let faqSchema = null;
  if (service.faq_json) {
    try {
      const faqsList = JSON.parse(service.faq_json);
      if (Array.isArray(faqsList) && faqsList.length > 0) {
        faqSchema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqsList.map((faq: any) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        };
      }
    } catch (e) {
      // ignore
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": serviceName,
            "provider": { "@type": "LocalBusiness", "name": "MedyaGem" },
            "areaServed": { "@type": "Country", "name": "Turkey" },
            "url": currentUrl
          })
        }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Hero */}
      <PageHero
        title={<><span className="text-transparent bg-clip-text bg-brand-glow">{heroTitle}</span></>}
        description={heroDesc}
        breadcrumbItems={[
          { label: "Hizmetler", href: "/hizmetler" }, 
          ...(category ? [{ label: category.name, href: `/hizmetler/kategori/${category.slug}` }] : []),
          { label: serviceName }
        ]}
        image={service.cover_image ?? undefined}
        imageAlt={service.cover_image_alt || serviceName}
      />

      {/* Ana İçerik + Sidebar */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* ========= SOL: ANA İÇERİK ========= */}
            <article className="lg:col-span-2 space-y-10">

              {/* Kapak Görseli */}
              {service.cover_image ? (
                <div className="relative w-full aspect-[16/9] overflow-hidden border border-border rounded-lg group">
                  <img 
                    src={service.cover_image} 
                    alt={service.cover_image_alt || serviceName} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                </div>
              ) : (
                <div className="relative w-full aspect-[16/9] bg-surface border border-border rounded-lg flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-[#0D0F1A]" />
                  <span className="relative z-10 text-heading font-black text-3xl md:text-4xl tracking-tight">{serviceName}</span>
                </div>
              )}

              {/* Meta (Okuma Süresi vb) */}
              <div className="flex items-center gap-4 text-xs text-meta uppercase font-bold tracking-widest border-b border-border pb-6">
                <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {readingTime}</span>
                <span className="text-border">|</span>
                {category ? (
                  <Link href={`/hizmetler/kategori/${category.slug}`} className="text-primary hover:text-accent transition-colors italic font-bold">
                    {category.name} Çözümleri
                  </Link>
                ) : (
                  <span className="text-primary italic">MedyaGem Profesyonel Çözüm</span>
                )}
              </div>

              {/* İçindekiler (TOC) */}
              {tocItems.length > 1 && (
                <details className="bg-surface border border-border rounded-xl mb-8 border-l-4 border-l-primary shadow-sm group">
                  <summary className="list-none cursor-pointer p-8">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-bold text-heading flex items-center gap-2">
                        <ChevronRight className="w-5 h-5 text-primary transition-transform group-open:rotate-90" /> İçindekiler
                      </h4>
                      <span className="text-primary text-sm font-medium group-open:hidden">Göster</span>
                      <span className="text-primary text-sm font-medium hidden group-open:block">Gizle</span>
                    </div>
                  </summary>
                  <div className="px-8 pb-8 pt-0">
                    <ul className="space-y-3 border-t border-border pt-6">
                      {tocItems.map((item, i) => (
                        <li key={i}>
                          <a href={`#${item.id}`} className="text-main hover:text-primary transition-colors flex items-center gap-2 text-sm md:text-base">
                            <span className="w-1.5 h-1.5 rounded-full bg-border" />
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              )}

              {/* API'den gelen içerik varsa göster */}
              {overviewContent && (
                <div>
                  <div
                    className="prose prose-invert prose-lg max-w-none text-main
                      prose-headings:text-heading prose-headings:font-bold
                      prose-p:leading-relaxed prose-p:text-main
                      prose-a:text-primary prose-strong:text-white
                      prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-surface prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
                      prose-img:rounded-lg prose-img:border prose-img:border-border"
                    dangerouslySetInnerHTML={{ __html: processedContent }}
                  />
                </div>
              )}

              {/* Paylaş */}
              <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <span className="text-heading font-bold text-lg">Bu hizmeti paylaşın</span>
                <ShareButtons url={currentUrl} title={`${serviceName} Hizmeti - MedyaGem`} />
              </div>
            </article>

            {/* ========= SAĞ: SIDEBAR ========= */}
            <aside className="space-y-8">

              {/* Hızlı İletişim */}
              <div className="bg-gradient-to-br from-primary/20 to-surface border border-border rounded-xl p-8 text-center">
                <h3 className="text-xl font-bold text-heading mb-3">Ücretsiz Analiz Alın</h3>
                <p className="text-desc text-sm mb-6 leading-relaxed">Rakiplerinizi analiz edelim ve size özel strateji sunalım. Tamamen ücretsiz.</p>
                <Link href="/iletisim" className="inline-block w-full py-3 px-6 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors text-center">
                  Hemen Başlayın
                </Link>
              </div>

              {/* Kategoriler (Hizmet) */}
              {categories.length > 0 && (
                <div className="bg-surface border border-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-heading mb-5 pb-3 border-b border-border">Hizmet Alanları</h3>
                  <ul className="space-y-1">
                    {categories.filter((c: any) => c.is_active !== false).map((cat: any) => (
                      <li key={cat.id}>
                        <Link href={`/hizmetler/kategori/${cat.slug}`} className={`flex items-center justify-between py-3 px-3 text-sm rounded-lg transition-colors group ${category?.id === cat.id ? 'bg-primary/10 text-primary' : 'text-main hover:bg-background'}`}>
                          {cat.name}
                          <ChevronRight className={`w-4 h-4 transition-colors ${category?.id === cat.id ? 'text-primary' : 'text-meta group-hover:text-primary'}`} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Diğer Hizmetler */}
              {otherServices.length > 0 && (
                <div className="bg-surface border border-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-heading mb-5 pb-3 border-b border-border">Diğer Hizmetler</h3>
                  <ul className="space-y-1">
                    {otherServices.map((s: any) => (
                      <li key={s.id}>
                        <Link href={`/hizmetler/${s.slug}`} className="flex items-center justify-between py-3 px-3 text-main text-sm hover:bg-background rounded-lg transition-colors group">
                          {s.name || s.card_title || s.slug}
                          <ChevronRight className="w-4 h-4 text-meta group-hover:text-primary transition-colors" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* İstatistikler */}
              <div className="bg-surface border border-border rounded-xl p-6 space-y-5">
                <h3 className="text-lg font-bold text-heading pb-3 border-b border-border">Başarı Metrikleri</h3>
                <div className="space-y-4">
                  {[
                    { label: "Müşteri Memnuniyeti", value: "%98" },
                    { label: "Ortalama ROI Artışı", value: "+%125" },
                    { label: "Tamamlanan Proje", value: "150+" },
                  ].map((stat, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-main text-sm">{stat.label}</span>
                      <span className="text-primary font-bold text-lg">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

            </aside>
          </div>
        </div>
      </section>

      {/* Süreç - Tam Genişlik */}
      <section className="py-20 bg-surface border-t border-border">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-heading text-center mb-4">Sıfırdan Zirveye İşleyişimiz</h2>
          <p className="text-main text-center mb-16 max-w-2xl mx-auto">Beş adımlı sürecimiz ile projenizi en yüksek performansa taşıyoruz.</p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {PROCESS_STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex flex-col items-center justify-center text-center p-6 bg-surface border border-border rounded-xl relative group hover:border-primary transition-colors">
                  <span className="text-5xl font-black text-white opacity-5 absolute top-4 group-hover:opacity-10 transition-opacity">{step.no}</span>
                  <Icon className="w-8 h-8 text-primary mb-3 relative z-10" />
                  <span className="text-lg font-bold text-heading relative z-10 mb-1">{step.t}</span>
                  <span className="text-desc text-xs relative z-10">{step.desc}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Çapraz Linkleme (Semantic Silo) - Bu Hizmetle İlgili Yazılar */}
      {relatedPosts.length > 0 && (
        <section className="py-20 bg-background border-t border-border">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-heading mb-12 flex items-center gap-3">
              <span className="w-2 h-8 bg-primary rounded-full" /> Uzman Rehberimizden Okuyun
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((rp: any) => (
                <Link key={rp.id} href={`/blog/${rp.slug}`} className="group relative block bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary transition-all duration-300">
                  <div className="relative aspect-video overflow-hidden">
                    {rp.cover_image ? (
                      <img src={rp.cover_image} alt={rp.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-background flex items-center justify-center">
                        <BarChart3 className="w-10 h-10 text-meta opacity-20" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-heading group-hover:text-primary transition-colors line-clamp-2 mb-3 leading-tight">{rp.title}</h3>
                    <p className="text-desc text-sm line-clamp-2 mb-4">{rp.excerpt}</p>
                    <span className="text-primary text-xs font-bold flex items-center gap-1 group/btn">
                      Hemen Oku <ChevronRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <Faq />

      {/* Reviews */}
      <section className="py-24 bg-background border-t border-border">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <ReviewSystem
            itemName={`${serviceName} Hizmeti`}
            reviews={FAKE_REVIEWS}
            averageRating={5.0}
            totalReviews={2}
            entityType="service"
            entitySlug={params.slug}
          />
        </div>
      </section>

      <Cta />
    </>
  );
}
