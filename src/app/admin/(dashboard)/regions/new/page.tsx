"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Save, MapPin } from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUpload from "@/components/admin/ImageUpload";
import { slugify } from "@/lib/utils/slugify";

export default function NewRegionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", slug: "", short_description: "", hero_title: "", hero_description: "", cover_image: "", cover_image_alt: "", intro_title: "", overview_content: "", is_active: true, is_featured: false,
  });

  useEffect(() => {
    if (formData.name) setFormData(prev => ({ ...prev, slug: slugify(formData.name) }));
  }, [formData.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/regions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) router.push("/admin/regions");
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
          <Link href="/admin/regions"><button className="p-2 bg-surface border border-border rounded-lg hover:text-brand-primary transition-colors"><ArrowLeft className="w-5 h-5" /></button></Link>
          <div>
            <h2 className="text-2xl font-bold text-heading">Yeni Bölge Ekle</h2>
            <p className="text-desc mt-1">Hizmet verilen yeni bir lokasyon tanımlayın.</p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={loading} className="gap-2"><Save className="w-4 h-4" /> {loading ? "Kaydediliyor..." : "Kaydet"}</Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-surface border border-border rounded-xl p-8 space-y-4 shadow-sm">
          <h3 className="text-lg font-bold text-heading border-b border-border/50 pb-2 flex items-center gap-2"><MapPin className="w-5 h-5 text-brand-primary" /> Bölge Bilgileri</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><label className="text-sm font-medium text-main">Bölge Adı</label><input name="name" onChange={handleChange} value={formData.name} required className="w-full bg-background border border-border p-3 text-white focus:border-brand-primary rounded-lg" placeholder="İstanbul" /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-main">Slug</label><input name="slug" onChange={handleChange} value={formData.slug} required className="w-full bg-background border border-border p-3 text-white focus:border-brand-primary rounded-lg font-mono text-sm" /></div>
          </div>
          <div className="space-y-2"><label className="text-sm font-medium text-main">Giriş Başlığı (Opsiyonel)</label><input name="intro_title" onChange={handleChange} value={formData.intro_title} className="w-full bg-background border border-border p-3 text-white focus:border-brand-primary rounded-lg" placeholder="Örn: Neden İzmir İçin MedyaGem?" /></div>
          <div className="space-y-2"><label className="text-sm font-medium text-main">Kısa Açıklama</label><textarea name="short_description" onChange={handleChange} value={formData.short_description} rows={2} className="w-full bg-background border border-border p-3 text-white focus:border-brand-primary rounded-lg resize-none" /></div>
          
          {/* Kapak Görseli */}
          <div className="space-y-2">
            <ImageUpload label="Kapak Görseli" value={formData.cover_image} onChange={(url) => setFormData(p => ({...p, cover_image: url}))} />
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-meta uppercase">Resim Alt Etiketi (SEO)</label>
              <input 
                name="cover_image_alt" 
                onChange={handleChange} 
                value={formData.cover_image_alt} 
                placeholder="Görseli tanımlayan anahtar kelimeler..."
                className="w-full bg-background border border-border p-3 text-white focus:border-brand-primary rounded-lg transition-all" 
              />
            </div>
          </div>

          <div className="space-y-2"><label className="text-sm font-medium text-main">İçerik</label><RichTextEditor value={formData.overview_content} onChange={(c) => setFormData(p => ({...p, overview_content: c}))} placeholder="Bölge hakkında detaylı bilgi..." /></div>
          <div className="flex gap-6">
            <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" name="is_active" onChange={handleChange} checked={formData.is_active} className="w-4 h-4 accent-brand-primary" /><span className="text-main text-sm">Aktif</span></label>
            <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" name="is_featured" onChange={handleChange} checked={formData.is_featured} className="w-4 h-4 accent-brand-primary" /><span className="text-main text-sm">Öne Çıkan</span></label>
          </div>
        </div>
      </form>
    </div>
  );
}
