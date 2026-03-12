import { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ReviewSystem from "@/components/ui/ReviewSystem";
import ShareButtons from "@/components/ui/ShareButtons";
import { CheckCircle2, ChevronRight, MapPin, ArrowLeft, ShieldCheck, Zap, BarChart3, Target, Clock } from "lucide-react";
import Link from "next/link";
import Cta from "@/sections/Cta";
import { getRegionBySlug, getRegions } from "@/lib/data-fetchers";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const region = await getRegionBySlug(params.slug);
  if (!region) return { title: "Bölge Bulunamadı | MedyaGem" };

  const cityName = region.name || params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
  return {
    title: `${region.hero_title || cityName} | MedyaGem Hizmet Bölgeleri`,
    description: region.hero_description || `MedyaGem ${cityName} Dijital Ajans ve Web Tasarım Hizmetleri`,
    openGraph: {
      title: region.hero_title || cityName,
      description: region.hero_description ?? undefined,
      url: `https://medyagem.com/bolgeler/${params.slug}`,
      images: region.cover_image ? [{ url: region.cover_image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: region.hero_title || cityName,
      description: region.hero_description ?? undefined,
      images: region.cover_image ? [region.cover_image] : [],
    },
  };
}

export default async function RegionDetailPage({ params }: { params: { slug: string } }) {
  const [region, allRegions] = await Promise.all([
    getRegionBySlug(params.slug),
    getRegions()
  ]);

  if (!region) {
    notFound();
  }

  const currentUrl = `https://medyagem.com/bolgeler/${params.slug}`;
  const cityName = region.name || params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
  const heroTitle = region.hero_title || cityName;
  const heroDesc = region.hero_description || `${cityName} şehrindeki yerel ya da ulusal markalar için özel konumlandırılmış, yüksek dönüşüm getiren uzaktan hizmet (ajans) stratejileri.`;
  const overviewContent = region.overview_content || "";
  const otherRegions = allRegions.filter((r: any) => r.slug !== params.slug).slice(0, 6);

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": `${cityName} Hizmet Bölgesi | MedyaGem`,
            "description": `MedyaGem ${cityName} Dijital Ajans ve Web Tasarım Hizmetleri`,
            "url": currentUrl,
          })
        }}
      />

      {/* Hero */}
      <PageHero
        title={<><span className="text-transparent bg-clip-text bg-brand-glow">{heroTitle}</span></>}
        description={heroDesc}
        breadcrumbItems={[{ label: "Bölgeler", href: "/bolgeler" }, { label: cityName }]}
        image={region.cover_image}
        imageAlt={region.cover_image_alt || cityName}
      />

      {/* Ana İçerik + Sidebar Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* ========= SOL: ANA İÇERİK ========= */}
            <article className="lg:col-span-2 space-y-10">

              {/* Kapak Görseli */}
              {region.cover_image ? (
                <div className="relative w-full aspect-[16/9] overflow-hidden border border-border rounded-lg group">
                  <img 
                    src={region.cover_image} 
                    alt={region.cover_image_alt || cityName} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                </div>
              ) : (
                <div className="relative w-full aspect-[16/9] bg-surface border border-border rounded-lg flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-[#0D0F1A]" />
                  <span className="relative z-10 text-heading font-black text-3xl md:text-4xl tracking-tight">{cityName}</span>
                </div>
              )}

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-xs text-meta uppercase font-bold tracking-widest border-b border-border pb-6">
                <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {readingTime}</span>
                <span className="text-border">|</span>
                <span className="text-primary italic">MedyaGem Yerel Çözüm</span>
              </div>

              {/* Table of Contents (TOC) */}
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

              {/* Intro Title & Content */}
              {region.intro_title && (
                <div className="mb-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-heading leading-tight tracking-tight">
                    {region.intro_title}
                  </h2>
                </div>
              )}
              <div className="space-y-6">

                {overviewContent ? (
                  <div
                    className="prose prose-invert prose-lg max-w-none text-main
                      prose-headings:text-heading prose-headings:font-bold
                      prose-p:leading-relaxed prose-p:text-main
                      prose-a:text-primary prose-strong:text-white
                      prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-surface prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
                      prose-img:rounded-lg prose-img:border prose-img:border-border"
                    dangerouslySetInnerHTML={{ __html: processedContent }}
                  />
                ) : (
                  <div className="space-y-4 text-main text-lg leading-relaxed">
                    <p>
                      Operasyon merkezimiz İstanbul&apos;da olsa da dijital süreçlerin inşasında mekan ve sınır yoktur. <strong>{cityName}</strong> sınırları içerisindeki rakiplerinizi geçmek, hedef kitleniz tarafından &quot;yerel aramalarda&quot; bulunabilir (Lokal SEO) olmak için güçlü bir altyapıya ihtiyacınız var.
                    </p>
                    <p>
                      MedyaGem olarak, Google Haritalar (Benim İşletmem) optimizasyonunuzdan özelleştirilmiş kurumsal web sitenize kadar her detayı sizin yerinize &quot;uzaktan&quot; şeffaf bir metrik sistemiyle takip ediyoruz.
                    </p>
                  </div>
                )}
              </div>

              {/* Paylaş */}
              <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <span className="text-heading font-bold text-lg">Bu bölgeyi paylaşın</span>
                <ShareButtons url={currentUrl} title={`${cityName} Hizmet Bölgesi - MedyaGem`} />
              </div>
            </article>

            {/* ========= SAĞ: SIDEBAR ========= */}
            <aside className="space-y-8">

              {/* Hizmetler Listesi (Bölge Odaklı) */}
              <div className="bg-surface border border-border rounded-xl p-8 border-t-2 border-t-primary shadow-lg">
                <h3 className="text-xl font-bold text-heading mb-6 border-b border-border pb-4 flex items-center gap-2">
                  <MapPin className="text-primary w-6 h-6" /> {cityName} Paketleri
                </h3>
                <ul className="flex flex-col gap-4">
                  {[
                    `${cityName} Kurumsal Web Tasarımı`,
                    `${cityName} Yerel (Lokal) SEO`,
                    "Bölge Odaklı Google Ads Reklamları",
                    "Sahte Tıklama Koruması",
                    "7/24 Şeffaf Raporlama"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 group">
                      <div className="mt-1">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 transition-transform group-hover:scale-110" />
                      </div>
                      <span className="text-main font-medium text-sm leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hızlı İletişim */}
              <div className="bg-gradient-to-br from-primary/10 to-surface border border-border rounded-xl p-8 text-center">
                <h3 className="text-xl font-bold text-heading mb-3">Çözüm Ortağınız Olalım</h3>
                <p className="text-desc text-sm mb-6 leading-relaxed">{cityName} pazarında dijital liderliğe yükselmek için bugün bizimle iletişime geçin.</p>
                <Link href="/iletisim" className="inline-block w-full py-4 px-6 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all hover:shadow-[0_0_20px_rgba(45,107,255,0.4)] text-center">
                  Ücretsiz Teklif Alın
                </Link>
              </div>

              {/* Diğer Bölgeler */}
              {otherRegions.length > 0 && (
                <div className="bg-surface border border-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-heading mb-5 pb-3 border-b border-border">Diğer Hizmet Bölgeleri</h3>
                  <div className="flex flex-wrap gap-2">
                    {otherRegions.map((r: any) => (
                      <Link
                        key={r.id}
                        href={`/bolgeler/${r.slug}`}
                        className="px-3 py-2 bg-background border border-border text-desc text-xs font-bold hover:bg-primary hover:text-white hover:border-primary transition-all rounded"
                      >
                        {r.name.toUpperCase()}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Güven Rozetleri */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface border border-border p-4 rounded-xl flex flex-col items-center text-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                  <span className="text-[10px] text-meta font-bold uppercase">100% Güvenli</span>
                </div>
                <div className="bg-surface border border-border p-4 rounded-xl flex flex-col items-center text-center gap-2">
                  <Zap className="w-6 h-6 text-accent" />
                  <span className="text-[10px] text-meta font-bold uppercase">Hızlı Teslimat</span>
                </div>
                <div className="bg-surface border border-border p-4 rounded-xl flex flex-col items-center text-center gap-2">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  <span className="text-[10px] text-meta font-bold uppercase">Veri Odaklı</span>
                </div>
                <div className="bg-surface border border-border p-4 rounded-xl flex flex-col items-center text-center gap-2">
                  <Target className="w-6 h-6 text-accent" />
                  <span className="text-[10px] text-meta font-bold uppercase">Tam Hedef</span>
                </div>
              </div>

            </aside>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-surface border-t border-border">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
           <ReviewSystem
             itemName={`${cityName} Dijital Ajans Hizmetleri`}
             entityType="region"
             entitySlug={params.slug}
           />
        </div>
      </section>

      <Cta />
    </>
  );
}
