"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUpload from "@/components/admin/ImageUpload";

export default function EditRegionPage() {
  const router = useRouter();
  const params = useParams();
  const regionId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: "", name: "", slug: "", short_description: "", hero_title: "", hero_description: "", cover_image: "", cover_image_alt: "", intro_title: "", overview_content: "", is_active: true, is_featured: false,
  });

  useEffect(() => {
    fetch("/api/admin/regions")
      .then(r => r.json())
      .then(regions => {
        const region = (regions || []).find((r: any) => r.id === regionId);
        if (region) {
          setFormData({
            id: region.id, name: region.name || "", slug: region.slug || "",
            short_description: region.short_description || "", hero_title: region.hero_title || "",
            hero_description: region.hero_description || "", cover_image: region.cover_image || "",
            intro_title: region.intro_title || "",
            overview_content: region.overview_content || "", is_active: region.is_active ?? true,
            is_featured: region.is_featured ?? false,
            cover_image_alt: region.cover_image_alt || "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [regionId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/regions", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) { alert("Bölge kaydedildi."); router.push("/admin/regions"); }
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
          <Link href="/admin/regions"><button className="p-2 bg-surface border border-border rounded-lg hover:text-brand-primary transition-colors"><ArrowLeft className="w-5 h-5" /></button></Link>
          <div>
            <h2 className="text-2xl font-bold text-heading">Bölge Düzenle</h2>
            <p className="text-desc mt-1">{formData.name}</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2"><Save className="w-4 h-4" /> {saving ? "Kaydediliyor..." : "Kaydet"}</Button>
      </div>

      <div className="bg-surface border border-border rounded-xl p-8 space-y-5 shadow-sm">
        <h3 className="text-lg font-bold text-heading border-b border-border/50 pb-2 flex items-center gap-2"><MapPin className="w-5 h-5 text-brand-primary" /> Bölge Bilgileri</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Bölge Adı</label><input name="name" onChange={handleChange} value={formData.name} className="w-full bg-background border border-border p-3 text-white rounded-lg" /></div>
          <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Slug</label><input name="slug" onChange={handleChange} value={formData.slug} className="w-full bg-background border border-border p-3 text-white rounded-lg font-mono text-sm" /></div>
        </div>
        <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Giriş Başlığı (Opsiyonel)</label><input name="intro_title" onChange={handleChange} value={formData.intro_title} className="w-full bg-background border border-border p-3 text-white rounded-lg" placeholder="Örn: Neden İzmir İçin MedyaGem?" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Kısa Açıklama</label><textarea name="short_description" onChange={handleChange} value={formData.short_description} rows={2} className="w-full bg-background border border-border p-3 text-white rounded-lg resize-none" /></div>

        <ImageUpload label="Kapak Görseli" value={formData.cover_image} onChange={(url) => setFormData(p => ({...p, cover_image: url}))} />
        <div className="space-y-1">
          <label className="text-xs font-semibold text-meta uppercase">Resim Alt Etiketi (SEO)</label>
          <input 
            name="cover_image_alt" 
            onChange={handleChange} 
            value={formData.cover_image_alt} 
            placeholder="Görseli tanımlayan anahtar kelimeler..."
            className="w-full bg-background border border-border p-3 text-white rounded-lg transition-all" 
          />
        </div>

        <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">İçerik</label><RichTextEditor value={formData.overview_content} onChange={(c) => setFormData(p => ({...p, overview_content: c}))} placeholder="Bölge hakkında detaylı bilgi..." /></div>

        <div className="flex gap-6">
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" name="is_active" onChange={handleChange} checked={formData.is_active} className="w-4 h-4 accent-brand-primary" /><span className="text-main text-sm">Aktif</span></label>
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" name="is_featured" onChange={handleChange} checked={formData.is_featured} className="w-4 h-4 accent-brand-primary" /><span className="text-main text-sm">Öne Çıkan</span></label>
        </div>
      </div>
    </div>
  );
}
