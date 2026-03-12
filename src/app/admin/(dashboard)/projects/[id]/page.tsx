"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, FolderKanban, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUpload from "@/components/admin/ImageUpload";
import SEOCheck from "@/components/admin/SEOCheck";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: "", project_name: "", slug: "", client_name: "", sector: "", summary: "", cover_image: "", 
    website_url: "", meta_description: "", tags: "", is_active: true, is_featured: false,
  });

  useEffect(() => {
    fetch("/api/admin/projects")
      .then(r => r.json())
      .then(projects => {
        const project = (projects || []).find((p: any) => p.id === projectId);
        if (project) {
          setFormData({
            id: project.id, project_name: project.project_name || "", slug: project.slug || "",
            client_name: project.client_name || "", sector: project.sector || "",
            summary: project.summary || "", cover_image: project.cover_image || "",
            website_url: project.website_url || "", 
            meta_description: project.meta_description || "",
            tags: project.tags || "",
            is_active: project.is_active ?? true,
            is_featured: project.is_featured ?? false,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/projects", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) { alert("Proje kaydedildi."); router.push("/admin/projects"); }
      else alert("Hata oluştu.");
    } catch { alert("Bağlantı hatası."); } finally { setSaving(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const t = e.target;
    setFormData(prev => ({ ...prev, [t.name]: t.type === 'checkbox' ? (t as HTMLInputElement).checked : t.value }));
  };

  if (loading) return <div className="p-12 text-center text-desc">Yükleniyor...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects"><button className="p-2 bg-surface border border-border rounded-lg hover:text-brand-primary transition-colors"><ArrowLeft className="w-5 h-5" /></button></Link>
          <div>
            <h2 className="text-2xl font-bold text-heading">Proje Düzenle</h2>
            <p className="text-desc mt-1">{formData.project_name}</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2"><Save className="w-4 h-4" /> {saving ? "Kaydediliyor..." : "Kaydet"}</Button>
      </div>

      <div className="bg-surface border border-border rounded-xl p-8 space-y-5 shadow-sm">
        <h3 className="text-lg font-bold text-heading border-b border-border/50 pb-2 flex items-center gap-2"><FolderKanban className="w-5 h-5 text-brand-primary" /> Proje Bilgileri</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Proje Adı</label><input name="project_name" onChange={handleChange} value={formData.project_name} className="w-full bg-background border border-border p-3 text-white rounded-lg" /></div>
          <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Slug</label><input name="slug" onChange={handleChange} value={formData.slug} className="w-full bg-background border border-border p-3 text-white rounded-lg font-mono text-sm" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Müşteri Adı</label><input name="client_name" onChange={handleChange} value={formData.client_name} className="w-full bg-background border border-border p-3 text-white rounded-lg" /></div>
          <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Sektör</label><input name="sector" onChange={handleChange} value={formData.sector} className="w-full bg-background border border-border p-3 text-white rounded-lg" /></div>
        </div>
        <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Web Sitesi URL</label><input name="website_url" onChange={handleChange} value={formData.website_url} className="w-full bg-background border border-border p-3 text-white rounded-lg font-mono text-sm" placeholder="https://..." /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Özet</label><textarea name="summary" onChange={handleChange} value={formData.summary} rows={3} className="w-full bg-background border border-border p-3 text-white rounded-lg resize-none" /></div>

        <ImageUpload label="Kapak Görseli" value={formData.cover_image} onChange={(url) => setFormData(p => ({...p, cover_image: url}))} />

        <div className="space-y-4 pt-4 border-t border-border/50">
           <h3 className="text-md font-bold text-heading flex items-center gap-2">
              <Tag className="w-4 h-4 text-brand-primary" /> SEO ve Etiketler
           </h3>
           <div className="grid grid-cols-1 gap-4">
             <div className="space-y-1">
                <label className="text-xs font-semibold text-meta uppercase">Meta Açıklaması</label>
                <textarea name="meta_description" onChange={handleChange} value={formData.meta_description} rows={3} className="w-full bg-background border border-border p-2.5 text-sm text-white rounded-lg resize-none" />
             </div>
             <div className="space-y-1">
                <label className="text-xs font-semibold text-meta uppercase">Etiketler</label>
                <input name="tags" onChange={handleChange} value={formData.tags} className="w-full bg-background border border-border p-2.5 text-sm text-white rounded-lg" />
             </div>
           </div>
        </div>

        <div className="flex gap-6 pt-4 border-t border-border/50">
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" name="is_active" onChange={handleChange} checked={formData.is_active} className="w-4 h-4 accent-brand-primary" /><span className="text-main text-sm">Aktif</span></label>
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" name="is_featured" onChange={handleChange} checked={formData.is_featured} className="w-4 h-4 accent-brand-primary" /><span className="text-main text-sm">Öne Çıkan</span></label>
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
    </div>
  );
}
