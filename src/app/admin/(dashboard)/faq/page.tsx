"use client";
export const dynamic = 'force-dynamic';
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, HelpCircle, Save, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function FAQManagementPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ group_key: "genel", question: "", answer: "", order_no: 0 });

  const fetchFaqs = async () => {
    try {
      const res = await fetch("/api/admin/faq");
      if (res.ok) setFaqs(await res.json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchFaqs(); }, []);

  const handleSave = async () => {
    const method = editingId ? "PUT" : "POST";
    const body = editingId ? { id: editingId, ...form } : form;
    try {
      const res = await fetch("/api/admin/faq", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) { fetchFaqs(); setForm({ group_key: "genel", question: "", answer: "", order_no: 0 }); setEditingId(null); }
    } catch { alert("Hata oluştu."); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu soruyu silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/faq?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchFaqs();
    } catch { alert("Silme hatası."); }
  };

  const startEdit = (faq: any) => {
    setEditingId(faq.id);
    setForm({ group_key: faq.group_key, question: faq.question, answer: faq.answer, order_no: faq.order_no });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-bold text-heading flex items-center gap-2"><HelpCircle className="w-6 h-6 text-brand-primary" /> SSS Yönetimi</h2>
        <p className="text-desc mt-1">Site genelinde kullanılan sıkça sorulan soruları yönetin.</p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="text-md font-bold text-heading">{editingId ? "Soruyu Düzenle" : "Yeni Soru Ekle"}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Grup Anahtarı</label><input value={form.group_key} onChange={e => setForm({...form, group_key: e.target.value})} className="w-full bg-background border border-border p-2.5 text-sm text-white rounded-lg" placeholder="genel" /></div>
          <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Sıra No</label><input type="number" value={form.order_no} onChange={e => setForm({...form, order_no: parseInt(e.target.value) || 0})} className="w-full bg-background border border-border p-2.5 text-sm text-white rounded-lg" /></div>
        </div>
        <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Soru</label><input value={form.question} onChange={e => setForm({...form, question: e.target.value})} className="w-full bg-background border border-border p-3 text-white rounded-lg" placeholder="Hizmet süreniz ne kadar?" /></div>
        <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Cevap</label><textarea value={form.answer} onChange={e => setForm({...form, answer: e.target.value})} rows={3} className="w-full bg-background border border-border p-3 text-white rounded-lg resize-none" placeholder="Detaylı cevap metni..." /></div>
        <div className="flex gap-2">
          <Button onClick={handleSave} className="gap-2"><Save className="w-4 h-4" /> {editingId ? "Güncelle" : "Ekle"}</Button>
          {editingId && <Button variant="ghost" onClick={() => { setEditingId(null); setForm({ group_key: "genel", question: "", answer: "", order_no: 0 }); }}>İptal</Button>}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm divide-y divide-border">
        {loading ? <div className="p-8 text-center text-desc">Yükleniyor...</div> : faqs.length === 0 ? <div className="p-8 text-center text-desc">Henüz soru eklenmedi.</div> : faqs.map(faq => (
          <div key={faq.id} className="p-4 flex items-start justify-between gap-4 hover:bg-background/20 transition-colors">
            <div className="flex-1">
              <p className="text-main font-medium">{faq.question}</p>
              <p className="text-desc text-sm mt-1">{faq.answer}</p>
              <span className="text-xs text-meta mt-2 inline-block bg-background px-2 py-0.5 rounded">{faq.group_key}</span>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => startEdit(faq)}><Edit className="w-4 h-4 text-brand-primary" /></Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-state-error" onClick={() => handleDelete(faq.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
