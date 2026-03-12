"use client";

import { useState, useEffect, Suspense } from "react";
import PageHero from "@/components/ui/PageHero";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Hash } from "lucide-react";
import Cta from "@/sections/Cta";
import { useSearchParams, useRouter } from "next/navigation";

function BlogListContent() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const pageParam = searchParams.get("page");
  const catParam = searchParams.get("category");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const POSTS_PER_PAGE = 6;

  useEffect(() => {
    // Verileri paralel çek
    Promise.all([
      fetch("/api/admin/blog").then(r => r.json()),
      fetch("/api/admin/blog-categories").then(r => r.json())
    ])
    .then(([blogData, catData]) => {
      if (Array.isArray(blogData)) {
        const activePosts = blogData.filter((p: any) => p.is_active !== false);
        activePosts.sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at).getTime();
          const dateB = new Date(b.published_at || b.created_at).getTime();
          return dateB - dateA;
        });
        setPosts(activePosts);
      }
      if (Array.isArray(catData)) {
        setCategories(catData.filter((c: any) => c.is_active !== false).sort((a, b) => (a.order || 0) - (b.order || 0)));
      }
    })
    .catch(() => {})
    .finally(() => setLoading(false));
  }, []);

  // Filtreleme mantığı
  const filteredPosts = catParam 
    ? posts.filter(p => p.category_id === catParam)
    : posts;

  const featured = filteredPosts.find(p => p.is_featured) || filteredPosts[0];
  const rest = filteredPosts.filter(p => p.id !== (featured?.id));
  
  const totalPages = Math.ceil(rest.length / POSTS_PER_PAGE);
  const isValidPage = currentPage > 0 && (totalPages === 0 || currentPage <= totalPages);
  
  const displayPosts = rest.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/blog?${params.toString()}`);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleCategoryChange = (catId: string | null) => {
    const params = new URLSearchParams();
    if (catId) params.set("category", catId);
    // Kategori değişince sayfayı 1 yap
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <>
      <PageHero
        title={<>Dijital Strateji <span className="text-transparent bg-clip-text bg-brand-glow">Ajanda & Kılavuzu</span></>}
        description="MedyaGem uzmanlarının hazırladığı rehberler sayesinde rakiplerinizden her zaman bir adım önde olun."
        breadcrumbItems={[{ label: "Blog" }]}
      />

      <section className="py-24 bg-background">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20 text-desc">Yükleniyor...</div>
          ) : (
            <>
              {/* Kategori Filtreleme Barı */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                    !catParam 
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                    : "bg-surface border-border text-desc hover:border-primary/50 hover:text-white"
                  }`}
                >
                  Tümü
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                      catParam === cat.id 
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                      : "bg-surface border-border text-desc hover:border-primary/50 hover:text-white"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {!isValidPage || (filteredPosts.length === 0) ? (
                <div className="text-center py-10">
                   <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface border border-border mb-4">
                     <Hash className="w-8 h-8 text-desc opacity-50" />
                   </div>
                   <h3 className="text-xl font-bold text-heading">İçerik Bulunamadı</h3>
                   <p className="text-desc mt-2">Bu kategoride henüz bir yazı yayınlanmamış.</p>
                </div>
              ) : (
                <>
                  {/* Featured Post - Sadece 1. sayfada ve filtre yokken (veya filtrelenmiş ilk öğe olarak) görünür */}
                  {currentPage === 1 && featured && (
                    <div className="mb-20">
                      <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
                        <span className="w-8 h-[2px] bg-primary"></span> Öne Çıkan İçerik
                      </h2>
                      <Link href={`/blog/${featured.slug}`} className="group block relative bg-surface border border-border overflow-hidden hover:border-primary transition-all duration-300 rounded-2xl shadow-xl shadow-black/20">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                          {featured.cover_image && (
                            <div className="h-[300px] lg:h-[450px] w-full overflow-hidden border-b lg:border-b-0 lg:border-r border-border">
                              <img src={featured.cover_image} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            </div>
                          )}
                          <div className="p-8 md:p-12 flex flex-col justify-center">
                            <div className="flex items-center gap-4 mb-6">
                              <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary font-bold text-xs uppercase tracking-wider rounded-lg">
                                {categories.find(c => c.id === featured.category_id)?.name || "Genel"}
                              </span>
                              <span className="text-xs text-meta font-medium">
                                {new Date(featured.published_at || featured.created_at).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
                              </span>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-extrabold text-heading group-hover:text-primary transition-colors tracking-tight mb-5 leading-tight">{featured.title}</h3>
                            <p className="text-desc md:text-lg leading-relaxed line-clamp-4 mb-8">{featured.excerpt}</p>
                            <div className="flex items-center text-primary font-bold group-hover:gap-3 transition-all duration-300">
                               Devamını Oku <ArrowRight className="w-5 h-5 ml-2" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}

                  {/* Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayPosts.map((post) => (
                      <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col h-full bg-surface border border-border rounded-xl overflow-hidden hover:border-primary shadow-sm hover:shadow-primary/10 transition-all duration-300">
                        {post.cover_image && (
                          <div className="h-[220px] w-full overflow-hidden relative">
                             <div className="absolute top-4 left-4 z-10">
                                <span className="px-3 py-1 bg-background/90 backdrop-blur-sm border border-border/50 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                                   {categories.find(c => c.id === post.category_id)?.name || "Blog"}
                                </span>
                             </div>
                             <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          </div>
                        )}
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-xl font-bold text-heading mb-3 group-hover:text-primary transition-colors leading-snug line-clamp-2">{post.title}</h3>
                          <p className="text-desc text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">{post.excerpt}</p>
                          <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-5">
                            <div className="flex items-center gap-2 text-[11px] text-meta font-bold uppercase tracking-tighter">
                              <span>{new Date(post.published_at || post.created_at || Date.now()).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                               <ArrowRight className="w-4 h-4 text-desc group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="mt-16 flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-3 rounded-xl bg-surface border border-border text-main hover:text-white hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        aria-label="Önceki Sayfa"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-12 h-12 rounded-xl border font-bold transition-all ${
                            currentPage === pageNum 
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                            : "bg-surface border-border text-main hover:text-white hover:border-primary"
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}

                      <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-3 rounded-xl bg-surface border border-border text-main hover:text-white hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        aria-label="Sonraki Sayfa"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>
      <Cta />
    </>
  );
}

export default function BlogListingPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center text-desc">Yükleniyor...</div>}>
      <BlogListContent />
    </Suspense>
  );
}
