"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Save, Globe, Image as ImageIcon, MessageSquare, Tag, PenTool, Layout } from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUpload from "@/components/admin/ImageUpload";
import FAQEditor from "@/components/admin/FAQEditor";
import SEOCheck from "@/components/admin/SEOCheck";
import SEOImporter from "@/components/admin/SEOImporter";
import { ParsedSEOData } from "@/lib/utils/seo-parser";
import { slugify } from "@/lib/utils/slugify";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    cover_image: "",
    content_json: "",
    meta_description: "",
    tags: "",
    faq_json: "",
    is_active: true,
    is_featured: false,
    author_name: "MedyaGem",
    author_image: "",
    published_at: new Date().toISOString().split('T')[0],
    tldr: "",
    related_service: "",
    cover_image_alt: "",
    category_id: "",
  });

  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/services").then(r => r.json()),
      fetch("/api/admin/blog-categories").then(r => r.json())
    ]).then(([sData, cData]) => {
      setServices(Array.isArray(sData) ? sData : []);
      setCategories(Array.isArray(cData) ? cData : []);
    }).catch(() => {});
  }, []);

  // Auto-slug generation
  useEffect(() => {
    if (formData.title) {
      setFormData(prev => ({ ...prev, slug: slugify(formData.title) }));
    }
  }, [formData.title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/admin/blog");
      } else {
        alert("Hata oluştu.");
      }
    } catch (err) {
      alert("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    setFormData(prev => ({
      ...prev,
      [target.name]: target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value
    }));
  };

  const handleEditorChange = (content: string) => {
    setFormData(prev => ({ ...prev, content_json: content }));
  };

  const handleFaqChange = (faqJson: string) => {
    setFormData(prev => ({ ...prev, faq_json: faqJson }));
  };

  const handleSEOImport = (data: ParsedSEOData) => {
    // Kategori eşleştirme (İsimden ID bulma)
    let catId = formData.category_id;
    if (data.category && categories.length > 0) {
      const found = categories.find(c => c.name.toLowerCase() === data.category?.toLowerCase());
      if (found) catId = found.id;
    }

    setFormData(prev => ({
      ...prev,
      title: data.title || prev.title,
      meta_description: data.description || prev.meta_description,
      excerpt: data.excerpt || prev.excerpt,
      tldr: data.tldr || prev.tldr,
      tags: data.keywords ? data.keywords.join(', ') : prev.tags,
      content_json: data.content || prev.content_json,
      faq_json: data.faq ? JSON.stringify(data.faq) : prev.faq_json,
      category_id: catId,
      related_service: data.related_service || prev.related_service,
      cover_image: data.cover_image || prev.cover_image,
      cover_image_alt: data.cover_image_alt || prev.cover_image_alt,
      author_name: data.author_name || prev.author_name,
      author_image: data.author_image || prev.author_image
    }));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
       <div className="flex justify-between items-center border-b border-border pb-6">
         <div className="flex items-center gap-4">
           <Link href="/admin/blog">
              <button className="p-2 bg-surface border border-border rounded-lg hover:text-brand-primary transition-colors">
                 <ArrowLeft className="w-5 h-5" />
              </button>
           </Link>
           <div>
             <h2 className="text-2xl font-bold text-heading">Yeni Blog Yazısı</h2>
             <p className="text-desc mt-1">Sitenin blog bölümü için zengin içerikli yeni bir yazı oluşturun.</p>
           </div>
         </div>
         <Button onClick={handleSubmit} disabled={loading} className="gap-2 font-semibold">
           <Save className="w-4 h-4" /> {loading ? "Yayınlanıyor..." : "Şimdi Yayınla"}
         </Button>
       </div>

       <SEOImporter type="blog" onImport={handleSEOImport} />

       <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Yazı İçeriği */}
            <div className="bg-surface border border-border rounded-xl p-8 space-y-6 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl rounded-full pointer-events-none" />
               
               <h3 className="text-lg font-bold text-heading border-b border-border/50 pb-2 flex items-center gap-2">
                 <PenTool className="w-5 h-5 text-brand-primary" /> Yazı İçeriği ve Başlık
               </h3>
               
               <div className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-main">Blog Yazısı Başlığı</label>
                   <input name="title" onChange={handleChange} value={formData.title} required className="w-full bg-background border border-border p-4 text-xl font-bold text-white focus:border-brand-primary rounded-lg transition-all" placeholder="Yazı Başlığını Buraya Girin" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-main">URL (Slug) - Otomatik Oluşturulur</label>
                   <input name="slug" onChange={handleChange} value={formData.slug} required className="w-full bg-background border border-border p-3 text-white focus:border-brand-primary rounded-lg font-mono text-sm opacity-80" placeholder="yazi-slug-adresi" />
                 </div>
                 
                 <div className="space-y-2 pt-4">
                   <label className="text-sm font-medium text-main">İçerik Editörü (WordPress Tarzı)</label>
                   <RichTextEditor 
                     value={formData.content_json} 
                     onChange={handleEditorChange}
                     placeholder="Yazı içeriğini buraya detaylıca yazın, görsel ve başlıklar ekleyin..."
                   />
                 </div>
               </div>
            </div>

            {/* Özet ve Kısa Bilgi */}
            <div className="bg-surface border border-border rounded-xl p-8 space-y-6 shadow-sm">
               <h3 className="text-lg font-bold text-heading border-b border-border/50 pb-2 flex items-center gap-2">
                 <Layout className="w-5 h-5 text-brand-primary" /> Yazı Özeti ve TL;DR
               </h3>
               <div className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-main">Kısa Özet (Listeleme sayfasında görünür)</label>
                   <textarea name="excerpt" onChange={handleChange} value={formData.excerpt} rows={3} className="w-full bg-background border border-border p-3 text-white focus:border-brand-primary rounded-lg resize-none" placeholder="Yazı hakkında 1-2 cümlelik kısa bir önizleme metni..." />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-main">TL;DR (Yazı Başı Kısa Özet - AI Snippet İçin)</label>
                   <textarea name="tldr" onChange={handleChange} value={formData.tldr} rows={3} className="w-full bg-background border border-border p-3 text-white focus:border-brand-primary rounded-lg resize-none border-l-4 border-l-brand-primary" placeholder="Madde madde veya kısa paragrafla yazının en özet hali (E-E-A-T ve AI aramalar için etkilidir)..." />
                 </div>
               </div>
             </div>

            {/* SSS Bölümü */}
            <div className="bg-surface border border-border rounded-xl p-8 space-y-6 shadow-sm">
               <FAQEditor 
                 value={formData.faq_json} 
                 onChange={handleFaqChange} 
               />
            </div>
          </div>

          {/* Sağ Kenar Çubuğu */}
          <div className="space-y-8">
            {/* Yayınlama Ayarları */}
            <div className="bg-surface border border-border rounded-xl p-6 space-y-4 shadow-sm">
               <h3 className="text-md font-bold text-heading border-b border-border/50 pb-2">Durum ve Görünürlük</h3>
               <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" name="is_active" onChange={handleChange} checked={formData.is_active} className="w-4 h-4 accent-brand-primary" />
                    <span className="text-main text-sm group-hover:text-white transition-colors font-medium">Hemen Yayınla</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" name="is_featured" onChange={handleChange} checked={formData.is_featured} className="w-4 h-4 accent-accent" />
                    <span className="text-main text-sm group-hover:text-white transition-colors font-medium">Öne Çıkan Yazı</span>
                  </label>
               </div>
                              <div className="pt-4 space-y-2">
                   <label className="text-xs font-semibold text-meta uppercase">Yayın Tarihi</label>
                   <input type="date" name="published_at" onChange={handleChange} value={formData.published_at || ''} className="w-full bg-background border border-border p-2.5 text-sm text-white focus:border-brand-primary rounded-lg" />
                </div>

                <div className="pt-2 space-y-2">
                   <label className="text-xs font-semibold text-meta uppercase">Yazar Adı</label>
                   <input name="author_name" onChange={handleChange} value={formData.author_name} className="w-full bg-background border border-border p-2.5 text-sm text-white focus:border-brand-primary rounded-lg" />
                </div>

                <div className="pt-2">
                   <ImageUpload
                     label="Yazar Resmi"
                     value={formData.author_image || ''}
                     onChange={(url) => setFormData(p => ({ ...p, author_image: url }))}
                   />
                </div>

               <Button onClick={handleSubmit} disabled={loading} className="w-full mt-4">
                  {loading ? "Kaydediliyor..." : "Taslağı Kaydet"}
               </Button>
            </div>

            {/* Kapak Görseli */}
             <div className="bg-surface border border-border rounded-xl p-6 space-y-4 shadow-sm">
                <ImageUpload 
                  label="Kapak Görseli"
                  value={formData.cover_image}
                  onChange={(url) => setFormData(p => ({ ...p, cover_image: url }))}
                />
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-semibold text-meta uppercase">Resim Alt Etiketi (SEO)</label>
                  <input 
                    name="cover_image_alt" 
                    onChange={handleChange} 
                    value={formData.cover_image_alt} 
                    placeholder="Görseli tanımlayan anahtar kelimeler..."
                    className="w-full bg-background border border-border p-2.5 text-sm text-white focus:border-brand-primary rounded-lg transition-all" 
                  />
                </div>
             </div>

            {/* SEO & Etiketler */}
            <div className="bg-surface border border-border rounded-xl p-6 space-y-4 shadow-sm">
               <h3 className="text-md font-bold text-heading border-b border-border/50 pb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-brand-primary" /> SEO ve Meta Verileri
               </h3>
               <div className="space-y-4">
                 <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-meta uppercase">Meta Açıklaması (SEO)</label>
                    <textarea name="meta_description" onChange={handleChange} value={formData.meta_description} rows={3} className="w-full bg-background border border-border p-2.5 text-sm text-white focus:border-brand-primary rounded-lg resize-none" placeholder="Google aramalarında çıkacak özet..." />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-meta uppercase">Etiketler</label>
                    <input name="tags" onChange={handleChange} value={formData.tags} className="w-full bg-background border border-border p-2.5 text-sm text-white focus:border-brand-primary rounded-lg" placeholder="pazarlama, sosyal medya, seo" />
                 </div>
                 <div className="space-y-1.5 pt-2 border-t border-border/50">
                    <label className="text-xs font-semibold text-meta uppercase">Kategori</label>
                    <select 
                      name="category_id" 
                      onChange={handleChange} 
                      value={formData.category_id} 
                      className="w-full bg-background border border-border p-2.5 text-sm text-white focus:border-brand-primary rounded-lg"
                    >
                      <option value="">Kategori Seçin</option>
                      {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                 <div className="space-y-1.5 pt-2 border-t border-border/50">
                    <label className="text-xs font-semibold text-meta uppercase">İlgili Hizmet (Çapraz Link)</label>
                    <select name="related_service" onChange={(e) => setFormData(p => ({ ...p, related_service: e.target.value }))} value={formData.related_service || ""} className="w-full bg-background border border-border p-2.5 text-sm text-white focus:border-brand-primary rounded-lg">
                      <option value="">Seçiniz</option>
                      {services.map((s: any) => (
                        <option key={s.id} value={s.slug}>{s.name || s.hero_title}</option>
                      ))}
                    </select>
                    <p className="text-xs text-desc mt-1">Seçilirse blog içeriğinden bu hizmete otomatik yönlendirme (link) kutusu eklenir.</p>
                 </div>
               </div>
             </div>

            {/* SEO Kontrol Listesi */}
            <SEOCheck
              title={formData.title}
              slug={formData.slug}
              metaDescription={formData.meta_description}
              content={formData.content_json}
              tags={formData.tags}
              coverImage={formData.cover_image}
              faqJson={formData.faq_json}
            />
          </div>
       </form>
    </div>
  );
}
