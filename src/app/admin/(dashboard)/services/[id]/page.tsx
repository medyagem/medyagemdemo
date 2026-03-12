"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Save, Globe, Image as ImageIcon, MessageSquare, Tag, PenTool, Layout, Plus, Trash2 } from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUpload from "@/components/admin/ImageUpload";
import FAQEditor from "@/components/admin/FAQEditor";
import SEOCheck from "@/components/admin/SEOCheck";
import { slugify } from "@/lib/utils/slugify";

export default function EditServicePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isInitialMount = useRef(true);
  
  const [formData, setFormData] = useState({
    id: params.id,
    name: "",
    slug: "",
    card_title: "",
    card_description: "",
    hero_title: "",
    hero_description: "",
    overview_title: "",
    overview_content: "",
    cover_image: "",
    meta_description: "",
    tags: "",
    faq_json: "",
    is_active: true,
    is_featured: false,
    cover_image_alt: "",
    category_id: "",
  });

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const [servicesRes, categoriesRes] = await Promise.all([
          fetch("/api/admin/services"),
          fetch("/api/admin/service-categories")
        ]);
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        }
        if (servicesRes.ok) {
          const data = await servicesRes.json();
          const target = data.find((s: any) => s.id === params.id);
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
    fetchServiceData();
  }, [params.id]);

  // Auto-slug generation (only after initial load to avoid overwriting existing slug immediately on mount)
  useEffect(() => {
    if (isInitialMount.current) {
      if (formData.name) isInitialMount.current = false;
      return;
    }
    if (formData.name) {
      setFormData(prev => ({ ...prev, slug: slugify(formData.name) }));
    }
  }, [formData.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/admin/services");
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
    setFormData(prev => ({ ...prev, overview_content: content }));
  };

  const handleFaqChange = (faqJson: string) => {
    setFormData(prev => ({ ...prev, faq_json: faqJson }));
  };

  if (loading) return <div className="p-12 text-center text-desc">Hizmet bilgisi yükleniyor...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
       <div className="flex justify-between items-center border-b border-border pb-6">
         <div className="flex items-center gap-4">
           <Link href="/admin/services">
              <button className="p-2 bg-surface border border-border rounded-lg hover:text-brand-primary transition-colors">
                 <ArrowLeft className="w-5 h-5" />
              </button>
           </Link>
           <div>
             <h2 className="text-2xl font-bold text-heading">Hizmeti Düzenle</h2>
             <p className="text-desc mt-1">Sitede bulunan hizmetin tüm detaylarını ve SEO ayarlarını güncelleyin.</p>
           </div>
         </div>
         <Button onClick={handleSubmit} disabled={saving} className="gap-2">
           <Save className="w-4 h-4" /> {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
         </Button>
       </div>

       <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Temel Bilgiler */}
            <div className="bg-surface border border-border rounded-xl p-8 space-y-6 shadow-sm">
               <h3 className="text-lg font-bold text-heading border-b border-border/50 pb-2 flex items-center gap-2">
                 <Globe className="w-5 h-5 text-brand-primary" /> Temel Kimlik Bilgileri
               </h3>
               
               <div className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-main">Hizmet Adı (Sistemde Görünecek)</label>
                   <input name="name" onChange={handleChange} value={formData.name || ""} required className="w-full bg-background border border-border p-3 text-white focus:border-brand-primary rounded-lg transition-all" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-main">URL (Slug)</label>
                   <input name="slug" onChange={handleChange} value={formData.slug || ""} required className="w-full bg-background border border-border p-3 text-white focus:border-brand-primary rounded-lg font-mono text-sm" />
                 </div>
               </div>
            </div>

            {/* İçerik Editörü */}
            <div className="bg-surface border border-border rounded-xl p-8 space-y-6 shadow-sm">
               <h3 className="text-lg font-bold text-heading border-b border-border/50 pb-2 flex items-center gap-2">
                 <PenTool className="w-5 h-5 text-brand-primary" /> Hizmet Detay İçeriği
               </h3>
               
               <div className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-main">Genel Bakış Metni (Wordpress Tarzı Editör)</label>
                   <RichTextEditor 
                     value={formData.overview_content || ""} 
                     onChange={handleEditorChange}
                     placeholder="Hizmetin tüm detaylarını buraya zengin metin olarak girebilirsiniz..."
                   />
                 </div>
               </div>
            </div>

            {/* SSS Bölümü */}
            <div className="bg-surface border border-border rounded-xl p-8 space-y-6 shadow-sm">
               <FAQEditor 
                 value={formData.faq_json || "[]"} 
                 onChange={handleFaqChange} 
               />
            </div>
          </div>

          {/* Sağ Kenar Çubuğu */}
          <div className="space-y-8">
            {/* Yayınlama Ayarları */}
            <div className="bg-surface border border-border rounded-xl p-6 space-y-4 shadow-sm">
               <h3 className="text-md font-bold text-heading border-b border-border/50 pb-2">Yayınlama Alanı</h3>
               <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" name="is_active" onChange={handleChange} checked={formData.is_active} className="w-4 h-4 accent-brand-primary" />
                    <span className="text-main text-sm group-hover:text-white transition-colors">Aktif (Yayında)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" name="is_featured" onChange={handleChange} checked={formData.is_featured} className="w-4 h-4 accent-accent" />
                    <span className="text-main text-sm group-hover:text-white transition-colors">Öne Çıkarılan</span>
                  </label>
               </div>
               <Button onClick={handleSubmit} disabled={saving} className="w-full mt-4">
                  {saving ? "Güncelleniyor..." : "Değişiklikleri Kaydet"}
               </Button>
            </div>

            {/* Görsel Ayarları */}
             <div className="bg-surface border border-border rounded-xl p-6 space-y-4 shadow-sm">
                <ImageUpload 
                  label="Kapak Görseli"
                  value={formData.cover_image || ""}
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

            {/* SEO & Etiketler */}
            <div className="bg-surface border border-border rounded-xl p-6 space-y-4 shadow-sm">
               <h3 className="text-md font-bold text-heading border-b border-border/50 pb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" /> SEO & Etiketler
               </h3>
               <div className="space-y-4">
                 <div className="space-y-1.5">
                    <label className="text-xs font-medium text-meta uppercase">Meta Açıklaması</label>
                    <textarea name="meta_description" onChange={handleChange} value={formData.meta_description || ""} rows={3} className="w-full bg-background border border-border p-2.5 text-sm text-white focus:border-brand-primary rounded-lg resize-none" placeholder="Arama sonuçlarında görünecek açıklama..." />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-xs font-medium text-meta uppercase">Etiketler (Virgülle Ayırın)</label>
                    <input name="tags" onChange={handleChange} value={formData.tags || ""} className="w-full bg-background border border-border p-2.5 text-sm text-white focus:border-brand-primary rounded-lg" placeholder="seo, sem, dijital pazarlama" />
                 </div>
                 <div className="space-y-1.5 pt-2 border-t border-border/50">
                    <label className="text-xs font-medium text-meta uppercase">Hizmet Kategorisi</label>
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
               </div>
            </div>

            {/* SEO Kontrol Listesi */}
            <SEOCheck
              title={formData.name}
              slug={formData.slug}
              metaDescription={formData.meta_description || ""}
              content={formData.overview_content || ""}
              tags={formData.tags || ""}
              coverImage={formData.cover_image || ""}
              faqJson={formData.faq_json || ""}
            />
          </div>
       </form>
    </div>
  );
}
