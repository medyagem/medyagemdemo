import { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ReviewSystem from "@/components/ui/ReviewSystem";
import ShareButtons from "@/components/ui/ShareButtons";
import { Clock, User, CalendarDays, ArrowLeft, Tag, ChevronRight, MessageSquare, Quote } from "lucide-react";
import Link from "next/link";
import Cta from "@/sections/Cta";
import { getBlogPostBySlug, getBlogPosts, getServices, getBlogCategories } from "@/lib/data-fetchers";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return { title: "Yazı Bulunamadı | MedyaGem" };

  return {
    title: `${post.title} | MedyaGem Blog`,
    description: post.meta_description || post.excerpt || "MedyaGem dijital pazarlama rehberi.",
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://medyagem.com/blog/${params.slug}`,
      images: post.cover_image ? [{ url: post.cover_image }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const [post, allPosts, services, categories] = await Promise.all([
    getBlogPostBySlug(params.slug),
    getBlogPosts(),
    getServices(),
    getBlogCategories()
  ]);

  if (!post) {
    notFound();
  }

  const category = categories.find((c: any) => c.id === post.category_id);

  const currentUrl = `https://medyagem.com/blog/${params.slug}`;
  const articleTitle = post.title || params.slug.replace(/-/g, " ").toUpperCase();
  const authorName = post.author_name || "MedyaGem Ekibi";
  const authorImage = post.author_image || "";
  const publishDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })
    : post.created_at
    ? new Date(post.created_at).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })
    : "";
  const contentHtml = post.content_json || "";
  const tags = post.tags ? post.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [];
  const recentPosts = allPosts.filter((p: any) => (p.id || p.slug) !== (post.id || post.slug)).slice(0, 4);

  const relatedServiceObj = post.related_service ? services.find((s: any) => s.slug === post.related_service) : null;

  // Benzer Yazılar (Aynı kategori veya ortak etiketlere göre)
  const relatedPosts = allPosts
    .filter((p: any) => (p.id || p.slug) !== (post.id || post.slug))
    .map((p: any) => {
      let score = 0;
      if (p.category_id === post.category_id) score += 5;
      const pTags = (p.tags || "").split(",").map((t: string) => t.trim().toLowerCase());
      const sharedTags = tags.filter((t: string) => pTags.includes(t.toLowerCase())).length;
      score += sharedTags;
      return { ...p, score };
    })
    .filter((p: any) => p.score > 0)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 3);

  const getReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const noOfWords = text.split(/\s/g).length;
    const minutes = noOfWords / wordsPerMinute;
    return `${Math.ceil(minutes)} Dk Okuma`;
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

  const readingTime = contentHtml ? getReadingTime(contentHtml) : "5 Dk Okuma";
  const tocItems = getTOC(contentHtml);

  const processedContent = contentHtml.replace(/<h2(.*?)>(.*?)<\/h2>/g, (match: string, attr: string, titleSnippet: string) => {
    const cleanTitle = titleSnippet.replace(/<[^>]*>/g, "");
    const id = cleanTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    return `<h2 id="${id}"${attr}>${titleSnippet}</h2>`;
  });

  // FAQ Schema
  let faqSchema = null;
  if (post.faq_json) {
    try {
      const faqsList = JSON.parse(post.faq_json);
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
      // JSON parse error or invalid format - skip schema
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": articleTitle,
            "image": post.cover_image ? [{ "@type": "ImageObject", "url": post.cover_image, "caption": post.cover_image_alt || articleTitle }] : [],
            "author": { "@type": "Person", "name": authorName, ...(authorImage ? { "image": authorImage } : {}) },
            "datePublished": post.published_at || post.created_at || "",
            "publisher": {
              "@type": "Organization",
              "name": "MedyaGem",
              "logo": { "@type": "ImageObject", "url": "https://medyagem.com/logo.png" }
            }
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
        title={<span className="text-3xl md:text-5xl">{articleTitle}</span>}
        description={post.excerpt || ""}
        breadcrumbItems={[
          { label: "Blog", href: "/blog" }, 
          ...(category ? [{ label: category.name, href: `/blog/kategori/${category.slug}` }] : []),
          { label: "Makale" }
        ]}
      />

      {/* Ana İçerik + Sidebar */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* ========= SOL: ANA İÇERİK ========= */}
            <article className="lg:col-span-2 space-y-10">

              {/* Kapak Görseli */}
              {post.cover_image ? (
                <div className="relative w-full aspect-[16/9] overflow-hidden border border-border rounded-lg group">
                  <img 
                    src={post.cover_image} 
                    alt={post.cover_image_alt || articleTitle} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                </div>
              ) : (
                <div className="relative w-full aspect-[16/9] bg-surface border border-border rounded-lg flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1C1F36] to-[#0D0F1A]" />
                  <span className="relative z-10 text-border font-black text-4xl tracking-widest mix-blend-overlay">MEDYAGEM BLOG</span>
                </div>
              )}

              {/* Meta Bilgileri */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-meta border-b border-border pb-6">
                {post.created_at && (
                  <time dateTime={new Date(post.created_at).toISOString()} className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-primary" /> {publishDate}
                  </time>
                )}
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> {authorName}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> {readingTime}
                </span>
                {category && (
                  <Link href={`/blog/kategori/${category.slug}`} className="flex items-center gap-2 text-primary hover:text-accent transition-colors font-bold">
                    <Tag className="w-4 h-4" /> {category.name}
                  </Link>
                )}
              </div>

              {/* İçindekiler (TOC) */}
              {tocItems.length > 1 && (
                <details className="bg-surface border border-border rounded-xl mb-8 border-l-4 border-l-primary group">
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

              {/* Başlık */}
              <h1 className="text-3xl md:text-4xl font-bold text-heading leading-tight tracking-tight">
                {articleTitle}
              </h1>

              {/* TL;DR Bölümü */}
              {post.tldr && (
                <div className="bg-primary/5 border-l-4 border-l-primary rounded-r-xl p-6 my-8">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <span className="bg-primary text-white text-xs font-black px-2 py-1 rounded-sm uppercase tracking-wider">TL;DR</span>
                    Yazı Özeti
                  </h3>
                  <p className="text-main leading-relaxed">{post.tldr}</p>
                </div>
              )}

              {/* İçerik - API'den gelen HTML */}
              {contentHtml ? (
                <div
                  className="prose prose-invert prose-lg max-w-none text-main
                    prose-headings:text-heading prose-headings:font-bold prose-headings:tracking-tight
                    prose-p:leading-relaxed prose-p:text-main
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-white
                    prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-surface prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                    prose-img:rounded-lg prose-img:border prose-img:border-border
                    prose-ul:space-y-2 prose-li:text-main"
                  dangerouslySetInnerHTML={{ __html: processedContent }}
                />
              ) : (
                <div className="prose prose-invert prose-lg max-w-none text-main">
                  <p className="text-desc italic">Bu yazının içeriği henüz eklenmemiştir.</p>
                </div>
              )}

              {/* Alıntı Kutusu */}
              {post.excerpt && (
                <div className="flex items-start gap-5 bg-surface border border-border rounded-xl p-8 my-8">
                  <div className="shrink-0 w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                    <Quote className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-main text-lg italic leading-relaxed">&ldquo;{post.excerpt}&rdquo;</p>
                    <span className="text-meta text-sm mt-3 block">— {authorName}</span>
                  </div>
                </div>
              )}

              {/* İlgili Hizmet Çapraz Link */}
              {relatedServiceObj && (
                <div className="mt-12 bg-surface border border-border rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-brand-glow opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />
                  <div className="relative z-10 flex-1">
                    <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-2 block">Sizin için Önerilen Hizmet</span>
                    <h3 className="text-2xl font-bold text-white mb-2">{relatedServiceObj.name || relatedServiceObj.hero_title}</h3>
                    <p className="text-desc line-clamp-2">{relatedServiceObj.card_description || relatedServiceObj.hero_description}</p>
                  </div>
                  <div className="relative z-10 shrink-0 w-full sm:w-auto">
                    <Link href={`/hizmetler/${relatedServiceObj.slug}`}>
                      <button className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                        Hizmeti İncele <ChevronRight className="w-5 h-5" />
                      </button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Alt Etiketler + Paylaş */}
              <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string, idx: number) => (
                    <span key={idx} className="px-4 py-2 bg-surface border border-border text-desc text-sm rounded-full hover:border-primary hover:text-primary transition-colors cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
                <ShareButtons url={currentUrl} title={`${articleTitle} - MedyaGem Blog`} />
              </div>
            </article>

            {/* ========= SAĞ: SIDEBAR ========= */}
            <aside className="space-y-8">

              {/* Yazar Kartı */}
              <div className="bg-surface border border-border rounded-xl p-8 flex flex-col items-center text-center">
                {authorImage ? (
                  <img src={authorImage} alt={authorName} className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-primary/30 shadow-lg shadow-primary/20" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold uppercase mb-4 shadow-lg shadow-primary/20">
                    {authorName.charAt(0)}
                  </div>
                )}
                <h4 className="text-lg font-bold text-heading">{authorName}</h4>
                <p className="text-desc text-sm mt-2 leading-relaxed">Dijital dünyada fark yaratan stratejiler, güncel bilgiler ve performans odaklı çözümler.</p>
              </div>

              {/* Kategoriler */}
              {categories.length > 0 && (
                <div className="bg-surface border border-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-heading mb-5 pb-3 border-b border-border">Kategoriler</h3>
                  <ul className="space-y-1">
                    {categories.filter((c: any) => c.is_active !== false).map((cat: any) => (
                      <li key={cat.id}>
                        <Link href={`/blog/kategori/${cat.slug}`} className="flex items-center justify-between py-3 px-3 text-main text-sm hover:bg-background rounded-lg transition-colors group">
                          {cat.name}
                          <ChevronRight className="w-4 h-4 text-meta group-hover:text-primary transition-colors" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Son Yazılar */}
              {recentPosts.length > 0 && (
                <div className="bg-surface border border-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-heading mb-5 pb-3 border-b border-border">Son Yazılar</h3>
                  <ul className="space-y-4">
                    {recentPosts.map((rp: any) => (
                      <li key={rp.id || rp.slug}>
                        <Link href={`/blog/${rp.slug}`} className="flex items-start gap-4 group">
                          {rp.cover_image ? (
                            <div className="w-20 h-16 shrink-0 overflow-hidden rounded-lg border border-border">
                              <img src={rp.cover_image} alt={rp.title} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-20 h-16 shrink-0 bg-background rounded-lg border border-border flex items-center justify-center">
                              <MessageSquare className="w-5 h-5 text-meta" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-heading group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                              {rp.title}
                            </h4>
                            {rp.created_at && (
                              <span className="text-xs text-meta mt-1 block">
                                {new Date(rp.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>

          </div>
        </div>
      </section>

      {/* Benzer Yazılar (Semantic Silo) */}
      {relatedPosts.length > 0 && (
        <section className="py-20 bg-background border-t border-border">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-heading mb-12 flex items-center gap-3">
              <span className="w-2 h-8 bg-primary rounded-full" /> İlgili Rehberler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((rp: any) => (
                <Link key={rp.id || rp.slug} href={`/blog/${rp.slug}`} className="group relative block bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary transition-all duration-300">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {rp.cover_image ? (
                      <img src={rp.cover_image} alt={rp.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-background flex items-center justify-center">
                        <MessageSquare className="w-10 h-10 text-meta opacity-20" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-heading group-hover:text-primary transition-colors line-clamp-2 mb-3 leading-tight">{rp.title}</h3>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs text-meta">{new Date(rp.created_at || "").toLocaleDateString("tr-TR")}</span>
                      <span className="text-primary text-xs font-bold flex items-center gap-1 group/btn">
                        Oku <ChevronRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Yorumlar & Değerlendirme */}
      <section className="py-24 bg-surface border-t border-border">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <ReviewSystem
            itemName={`${articleTitle} (Blog Makalesi)`}
            entityType="blog"
            entitySlug={params.slug}
          />
        </div>
      </section>

      <Cta />
    </>
  );
}
