"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Save, Briefcase, Tag, Layout } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import SEOCheck from "@/components/admin/SEOCheck";
import { slugify } from "@/lib/utils/slugify";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    project_name: "", slug: "", client_name: "", sector: "", summary: "", cover_image: "", website_url: "", 
    meta_description: "", tags: "", is_active: true, is_featured: false,
  });

  useEffect(() => {
    if (formData.project_name) setFormData(prev => ({ ...prev, slug: slugify(formData.project_name) }));
  }, [formData.project_name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) router.push("/admin/projects");
      else alert("Hata oluştu.");
    } catch { alert("Bağlantı hatası."); } finally { setLoading(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const t = e.target;
    setFormData(prev => ({ ...prev, [t.name]: t.type === 'checkbox' ? (t as HTMLInputElement).checked : t.value }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects"><button className="p-2 bg-surface border border-border rounded-lg hover:text-brand-primary transition-colors"><ArrowLeft className="w-5 h-5" /></button></Link>
          <div>
            <h2 className="text-2xl font-bold text-heading">Yeni Proje Ekle</h2>
            <p className="text-desc mt-1">Portfolyoya yeni bir proje ekleyin.</p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={loading} className="gap-2"><Save className="w-4 h-4" /> {loading ? "Kaydediliyor..." : "Kaydet"}</Button>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-xl p-8 space-y-4 shadow-sm">
            <h3 className="text-lg font-bold text-heading border-b border-border/50 pb-2 flex items-center gap-2"><Briefcase className="w-5 h-5 text-brand-primary" /> Proje Bilgileri</h3>
            <div className="space-y-2"><label className="text-sm font-medium text-main">Proje Adı</label><input name="project_name" onChange={handleChange} value={formData.project_name} required className="w-full bg-background border border-border p-3 text-white focus:border-brand-primary rounded-lg" /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-main">Slug</label><input name="slug" onChange={handleChange} value={formData.slug} required className="w-full bg-background border border-border p-3 text-white focus:border-brand-primary rounded-lg font-mono text-sm" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-sm font-medium text-main">Müşteri Adı</label><input name="client_name" onChange={handleChange} value={formData.client_name} className="w-full bg-background border border-border p-3 text-white focus:border-brand-primary rounded-lg" /></div>
              <div className="space-y-2"><label className="text-sm font-medium text-main">Sektör</label><input name="sector" onChange={handleChange} value={formData.sector} className="w-full bg-background border border-border p-3 text-white focus:border-brand-primary rounded-lg" /></div>
            </div>
            <div className="space-y-2"><label className="text-sm font-medium text-main">Proje Özeti</label><textarea name="summary" onChange={handleChange} value={formData.summary} rows={4} className="w-full bg-background border border-border p-3 text-white focus:border-brand-primary rounded-lg resize-none" /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-main">Web Sitesi URL</label><input name="website_url" onChange={handleChange} value={formData.website_url} className="w-full bg-background border border-border p-3 text-white focus:border-brand-primary rounded-lg" placeholder="https://" /></div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-xl p-6 space-y-4 shadow-sm">
            <ImageUpload label="Kapak Görseli" value={formData.cover_image} onChange={(url) => setFormData(p => ({...p, cover_image: url}))} />
          </div>

          <div className="bg-surface border border-border rounded-xl p-6 space-y-4 shadow-sm">
             <h3 className="text-md font-bold text-heading border-b border-border/50 pb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-brand-primary" /> SEO ve Etiketler
             </h3>
             <div className="space-y-4">
               <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-meta uppercase">Meta Açıklaması</label>
                  <textarea name="meta_description" onChange={handleChange} value={formData.meta_description} rows={3} className="w-full bg-background border border-border p-2.5 text-sm text-white focus:border-brand-primary rounded-lg resize-none" />
               </div>
               <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-meta uppercase">Etiketler</label>
                  <input name="tags" onChange={handleChange} value={formData.tags} className="w-full bg-background border border-border p-2.5 text-sm text-white focus:border-brand-primary rounded-lg" placeholder="web-tasarim, kurumsal" />
               </div>
             </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6 space-y-3 shadow-sm">
            <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" name="is_active" onChange={handleChange} checked={formData.is_active} className="w-4 h-4 accent-brand-primary" /><span className="text-main text-sm">Yayında</span></label>
            <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" name="is_featured" onChange={handleChange} checked={formData.is_featured} className="w-4 h-4 accent-accent" /><span className="text-main text-sm">Öne Çıkan</span></label>
          </div>

          <SEOCheck 
            title={formData.project_name}
            slug={formData.slug}
            metaDescription={formData.meta_description}
            content={formData.summary}
            tags={formData.tags}
            coverImage={formData.cover_image}
            faqJson=""
          />
        </div>
      </form>
    </div>
  );
}
