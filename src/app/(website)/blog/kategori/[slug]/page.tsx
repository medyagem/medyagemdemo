import { Suspense } from "react";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Cta from "@/sections/Cta";
import fs from "fs";
import path from "path";

async function getCategoryData(slug: string) {
  const filePath = path.join(process.cwd(), "data", "blog-categories.json");
  if (!fs.existsSync(filePath)) return null;
  const cats = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return cats.find((c: any) => c.slug === slug);
}

async function getPostsByCategory(categoryId: string) {
  const blogPath = path.join(process.cwd(), "data", "blog-posts.json");
  if (!fs.existsSync(blogPath)) return [];
  const posts = JSON.parse(fs.readFileSync(blogPath, "utf-8"));
  return posts.filter((p: any) => p.category_id === categoryId && p.is_active !== false);
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const category = await getCategoryData(params.slug);
  if (!category) return {};
  return {
    title: `${category.name} - MedyaGem Blog`,
    description: category.description || `${category.name} konusu üzerine dijital strateji ve uzman rehberleri.`,
  };
}

export default async function BlogCategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategoryData(params.slug);
  if (!category) notFound();

  const posts = await getPostsByCategory(category.id);

  return (
    <>
      <PageHero
        title={<><span className="text-primary">{category.name}</span> Arşivi</>}
        description={category.description || "Bu kategorideki tüm uzman rehberlerimiz ve dijital stratejilerimiz."}
        breadcrumbItems={[
          { label: "Blog", href: "/blog" },
          { label: category.name }
        ]}
      />

      <section className="py-24 bg-background">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
             <Link href="/blog" className="flex items-center gap-2 text-desc hover:text-primary transition-colors font-medium">
                <ArrowLeft className="w-4 h-4" /> Tüm Yazılara Dön
             </Link>
             <div className="text-sm text-meta font-bold uppercase tracking-tight">
                TOPLAM {posts.length} YAZI
             </div>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20 bg-surface border border-border rounded-2xl">
               <h3 className="text-xl font-bold text-heading">İçerik Yakında</h3>
               <p className="text-desc mt-2">Bu kategori için hazırlıklarımız devam ediyor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col h-full bg-surface border border-border rounded-xl overflow-hidden hover:border-primary transition-all duration-300">
                  {post.cover_image && (
                    <div className="h-[200px] w-full overflow-hidden">
                      <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                     <h3 className="text-xl font-bold text-heading mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">{post.title}</h3>
                     <p className="text-desc text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">{post.excerpt}</p>
                     <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-5">
                       <span className="text-[11px] text-meta font-bold uppercase tracking-widest">
                          {new Date(post.published_at || post.created_at).toLocaleDateString("tr-TR")}
                       </span>
                       <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                     </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <Cta />
    </>
  );
}
