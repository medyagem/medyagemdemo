"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Save, Globe, Image as ImageIcon, MessageSquare, Tag, PenTool, Layout } from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUpload from "@/components/admin/ImageUpload";
import FAQEditor from "@/components/admin/FAQEditor";
import SEOCheck from "@/components/admin/SEOCheck";
import { slugify } from "@/lib/utils/slugify";

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isInitialMount = useRef(true);
  
  const [formData, setFormData] = useState({
    id: params.id,
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
    author_name: "",
    author_image: "",
    published_at: "",
    tldr: "",
    related_service: "",
    cover_image_alt: "",
    category_id: "",
  });

  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogRes, servicesRes, categoriesRes] = await Promise.all([
          fetch("/api/admin/blog"),
          fetch("/api/admin/services"),
          fetch("/api/admin/blog-categories")
        ]);
        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          setServices(Array.isArray(servicesData) ? servicesData : []);
        }
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        }
        if (blogRes.ok) {
          const data = await blogRes.json();
          const target = data.find((p: any) => p.id === params.id);
          if (target) {
            setFormData(prev => ({ ...prev, ...target }));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  // Auto-slug generation
  useEffect(() => {
    if (isInitialMount.current) {
      if (formData.title) isInitialMount.current = false;
      return;
    }
    if (formData.title) {
      setFormData(prev => ({ ...prev, slug: slugify(formData.title) }));
    }
  }, [formData.title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/admin/blog");
      } else {
        alert("Güncelleme hatası.");
      }
    } catch (err) {
      alert("Bağlantı hatası.");
    } finally {
      setSaving(false);
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

  if (loading) return <div className="p-12 text-center text-desc">Yazı yükleniyor...</div>;

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
             <h2 className="text-2xl font-bold text-heading">Yazıyı Düzenle</h2>
             <p className="text-desc mt-1">Blog içeriğini ve yayınlama detaylarını güncelleyin.</p>
           </div>
         </div>
         <Button onClick={handleSubmit} disabled={saving} className="gap-2 font-semibold">
           <Save className="w-4 h-4" /> {saving ? "Kaydediliyor..." : "Değişiklikleri Uygula"}
         </Button>
       </div>

       <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Yazı İçeriği */}
            <div className="bg-surface border border-border rounded-xl p-8 space-y-6 shadow-sm">
               <h3 className="text-lg font-bold text-heading border-b border-border/50 pb-2 flex items-center gap-2">
                 <PenTool className="w-5 h-5 text-brand-primary" /> İçerik Yönetimi
               </h3>
               
               <div className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-main">Başlık</label>
                   <input name="title" onChange={handleChange} value={formData.title || ""} required className="w-full bg-background border border-border p-4 text-xl font-bold text-white focus:border-brand-primary rounded-lg transition-all" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-main">URL (Slug)</label>
                   <input name="slug" onChange={handleChange} value={formData.slug || ""} required className="w-full bg-background border border-border p-3 text-white focus:border-brand-primary rounded-lg font-mono text-sm" />
                 </div>
                 
                 <div className="space-y-2 pt-4">
                   <label className="text-sm font-medium text-main">Yazı Metni</label>
                   <RichTextEditor 
                     value={formData.content_json || ""} 
                     onChange={handleEditorChange}
                     placeholder="İçeriği güncelleyin..."
                   />
                 </div>
               </div>
            </div>

            {/* Özet */}
             <div className="bg-surface border border-border rounded-xl p-8 space-y-6 shadow-sm">
               <h3 className="text-lg font-bold text-heading border-b border-border/50 pb-2 flex items-center gap-2">
                 <Layout className="w-5 h-5 text-brand-primary" /> Yazı Özeti ve TL;DR
               </h3>
               <div className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-main">Kısa Bilgi / Alıntı</label>
                   <textarea name="excerpt" onChange={handleChange} value={formData.excerpt || ""} rows={3} className="w-full bg-background border border-border p-3 text-white focus:border-brand-primary rounded-lg resize-none font-sans" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-main">TL;DR (Yazı Başı Kısa Özet - AI Snippet İçin)</label>
                   <textarea name="tldr" onChange={handleChange} value={formData.tldr || ""} rows={3} className="w-full bg-background border border-border p-3 text-white focus:border-brand-primary rounded-lg resize-none border-l-4 border-l-brand-primary" placeholder="Yazının en özet hali..." />
                 </div>
               </div>
             </div>

            {/* SSS */}
            <div className="bg-surface border border-border rounded-xl p-8 space-y-6 shadow-sm">
               <FAQEditor 
                 value={formData.faq_json || "[]"} 
                 onChange={handleFaqChange} 
               />
            </div>
          </div>

          {/* Sağ Kenar */}
          <div className="space-y-8">
            <div className="bg-surface border border-border rounded-xl p-6 space-y-4 shadow-sm">
               <h3 className="text-md font-bold text-heading border-b border-border/50 pb-2">Yayında</h3>
               <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" name="is_active" onChange={handleChange} checked={formData.is_active} className="w-4 h-4 accent-brand-primary" />
                    <span className="text-main text-sm">Aktif / Görünür</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" name="is_featured" onChange={handleChange} checked={formData.is_featured} className="w-4 h-4 accent-accent" />
                    <span className="text-main text-sm">Öne Çıkarılan</span>
                  </label>
               </div>
               <div className="pt-4 space-y-2">
                   <label className="text-xs font-semibold text-meta uppercase">Yayın Tarihi</label>
                   <input type="date" name="published_at" onChange={handleChange} value={formData.published_at ? formData.published_at.split('T')[0] : ''} className="w-full bg-background border border-border p-2.5 text-sm text-white focus:border-brand-primary rounded-lg" />
                </div>

                <div className="pt-2 space-y-2">
                   <label className="text-xs font-semibold text-meta uppercase">Yazar Adı</label>
                   <input name="author_name" onChange={handleChange} value={formData.author_name || ''} className="w-full bg-background border border-border p-2.5 text-sm text-white focus:border-brand-primary rounded-lg" />
                </div>

                <div className="pt-2">
                   <ImageUpload
                     label="Yazar Resmi"
                     value={formData.author_image || ''}
                     onChange={(url) => setFormData(p => ({ ...p, author_image: url }))}
                   />
                </div>

               <Button onClick={handleSubmit} disabled={saving} className="w-full mt-4">
                  {saving ? "Güncelleniyor..." : "Yazıyı Güncelle"}
               </Button>
            </div>

             <div className="bg-surface border border-border rounded-xl p-6 space-y-4 shadow-sm">
               <ImageUpload 
                 label="Kapak Resmi"
                 value={formData.cover_image}
                 onChange={(url) => setFormData(p => ({ ...p, cover_image: url }))}
               />
               <div className="space-y-1.5 pt-2">
                 <label className="text-xs font-semibold text-meta uppercase">Resim Alt Etiketi (SEO)</label>
                 <input 
                   name="cover_image_alt" 
                   onChange={handleChange} 
                   value={formData.cover_image_alt || ""} 
                   placeholder="Görseli tanımlayan anahtar kelimeler..."
                   className="w-full bg-background border border-border p-2.5 text-sm text-white focus:border-brand-primary rounded-lg transition-all" 
                 />
               </div>
             </div>

            <div className="bg-surface border border-border rounded-xl p-6 space-y-4 shadow-sm">
               <h3 className="text-md font-bold text-heading border-b border-border/50 pb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-brand-primary" /> SEO Paneli
               </h3>
               <div className="space-y-4">
                 <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-meta uppercase">Meta Açıklama</label>
                    <textarea name="meta_description" onChange={handleChange} value={formData.meta_description || ""} rows={3} className="w-full bg-background border border-border p-2.5 text-sm text-white focus:border-brand-primary rounded-lg resize-none" />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-meta uppercase">Etiketler</label>
                    <input name="tags" onChange={handleChange} value={formData.tags || ""} className="w-full bg-background border border-border p-2.5 text-sm text-white focus:border-brand-primary rounded-lg" />
                 </div>
                 <div className="space-y-1.5 pt-2 border-t border-border/50">
                    <label className="text-xs font-semibold text-meta uppercase">Kategori</label>
                    <select 
                      name="category_id" 
                      onChange={handleChange} 
                      value={formData.category_id || ""} 
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
                 </div>
               </div>
             </div>

            {/* SEO Kontrol Listesi */}
            <SEOCheck
              title={formData.title}
              slug={formData.slug}
              metaDescription={formData.meta_description || ""}
              content={formData.content_json || ""}
              tags={formData.tags || ""}
              coverImage={formData.cover_image || ""}
              faqJson={formData.faq_json || ""}
            />
          </div>
       </form>
    </div>
  );
}
