"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function EditPagePage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: "", title: "", slug: "", hero_title: "", hero_description: "", content_json: "", status: "published",
  });

  useEffect(() => {
    fetch("/api/admin/pages")
      .then(r => r.json())
      .then(pages => {
        const page = (pages || []).find((p: any) => p.id === pageId);
        if (page) {
          let content = "";
          if (page.content_json) {
            try { content = JSON.parse(page.content_json).content || ""; } catch { content = page.content_json; }
          }
          setFormData({
            id: page.id, title: page.title || "", slug: page.slug || "",
            hero_title: page.hero_title || "", hero_description: page.hero_description || "",
            content_json: content, status: page.status || "published",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pageId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        ...formData,
        content_json: JSON.stringify({ content: formData.content_json }),
      };
      const res = await fetch("/api/admin/pages", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) { alert("Sayfa kaydedildi."); router.push("/admin/pages"); }
      else alert("Hata oluştu.");
    } catch { alert("Bağlantı hatası."); } finally { setSaving(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (loading) return <div className="p-12 text-center text-desc">Yükleniyor...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/pages"><button className="p-2 bg-surface border border-border rounded-lg hover:text-brand-primary transition-colors"><ArrowLeft className="w-5 h-5" /></button></Link>
          <div>
            <h2 className="text-2xl font-bold text-heading">Sayfa Düzenle</h2>
            <p className="text-desc mt-1">{formData.title}</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2"><Save className="w-4 h-4" /> {saving ? "Kaydediliyor..." : "Kaydet"}</Button>
      </div>

      <div className="bg-surface border border-border rounded-xl p-8 space-y-5 shadow-sm">
        <h3 className="text-lg font-bold text-heading border-b border-border/50 pb-2 flex items-center gap-2"><FileText className="w-5 h-5 text-brand-primary" /> Sayfa Bilgileri</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Sayfa Başlığı</label><input name="title" onChange={handleChange} value={formData.title} className="w-full bg-background border border-border p-3 text-white rounded-lg" /></div>
          <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Slug</label><input name="slug" onChange={handleChange} value={formData.slug} className="w-full bg-background border border-border p-3 text-white rounded-lg font-mono text-sm" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Hero Başlık</label><input name="hero_title" onChange={handleChange} value={formData.hero_title} className="w-full bg-background border border-border p-3 text-white rounded-lg" /></div>
          <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Hero Açıklama</label><input name="hero_description" onChange={handleChange} value={formData.hero_description} className="w-full bg-background border border-border p-3 text-white rounded-lg" /></div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-meta uppercase">Durum</label>
          <select name="status" onChange={handleChange} value={formData.status} className="w-full bg-background border border-border p-3 text-white rounded-lg">
            <option value="published">Yayında</option>
            <option value="draft">Taslak</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-meta uppercase">İçerik</label>
          <RichTextEditor value={formData.content_json} onChange={(c) => setFormData(p => ({...p, content_json: c}))} placeholder="Sayfa içeriğini buraya yazın..." />
        </div>
      </div>
    </div>
  );
}
