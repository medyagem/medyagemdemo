"use client";
import { useState } from "react";
import { LayoutDashboard, Save, ChevronDown, ChevronUp, Plus, Trash2, Home, Award, Briefcase, HelpCircle, MessageCircle, Layers, Globe, PenTool, Megaphone, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import ImageUpload from "@/components/admin/ImageUpload";

interface SectionMeta { key: string; name: string; icon: any; }

const SECTION_LIST: SectionMeta[] = [
  { key: "hero", name: "Hero Banner", icon: Home },
  { key: "hakkimizda", name: "Hakkımızda", icon: Building2 },
  { key: "whymedyagem", name: "Neden Bizi Seçmelisiniz", icon: Award },
  { key: "projeler", name: "Çalışmalarımız", icon: Briefcase },
  { key: "surec", name: "Çalışma Sürecimiz", icon: Layers },
  { key: "blog_preview", name: "Blog Önizleme", icon: PenTool },
  { key: "faq", name: "Sıkça Sorulan Sorular", icon: HelpCircle },
  { key: "hizmetbolgeleri", name: "Hizmet Bölgeleri", icon: Globe },
  { key: "testimonials", name: "Müşteri Yorumları", icon: MessageCircle },
  { key: "cta", name: "CTA (Aksiyon Çağrısı)", icon: Megaphone },
];

const DelBtn = ({ onClick }: { onClick: () => void }) => <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-state-error" onClick={onClick}><Trash2 className="w-3.5 h-3.5" /></Button>;
const AddBtn = ({ onClick, label }: { onClick: () => void; label: string }) => <Button variant="ghost" size="sm" onClick={onClick} className="gap-1 text-brand-primary"><Plus className="w-3.5 h-3.5" /> {label}</Button>;

const F = ({ label, path, multiline, sectionData, onUpdate }: { label: string; path: string; multiline?: boolean; sectionData: any; onUpdate: (p: string, v: any) => void }) => {
  const k = path.split("."); let v = sectionData; for (const x of k) v = v?.[x];
  const cls = "w-full bg-background border border-border p-2.5 text-sm text-white rounded-lg focus:border-brand-primary outline-none transition-colors";
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-meta uppercase">{label}</label>
      {multiline ? (
        <textarea value={v || ""} onChange={e => onUpdate(path, e.target.value)} rows={3} className={cls + " resize-none"} />
      ) : (
        <input value={v || ""} onChange={e => onUpdate(path, e.target.value)} className={cls} />
      )}
    </div>
  );
};

export default function HomepageManagementPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sectionData, setSectionData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const loadSection = async (key: string) => {
    if (activeSection === key) { setActiveSection(null); setSectionData(null); return; }
    const res = await fetch(`/api/admin/sections?section=${key}`);
    const data = await res.json();
    setActiveSection(key);
    setSectionData(data);
  };

  const saveSection = async () => {
    if (!activeSection || !sectionData) return;
    setSaving(true);
    try {
      await fetch("/api/admin/sections", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ section: activeSection, data: sectionData }) });
      alert("Başarıyla kaydedildi!");
    } catch { alert("Kaydetme hatası."); } finally { setSaving(false); }
  };

  const u = (path: string, value: any) => {
    setSectionData((prev: any) => {
      const c = JSON.parse(JSON.stringify(prev));
      const k = path.split("."); let o = c;
      for (let i = 0; i < k.length - 1; i++) o = o[k[i]];
      o[k[k.length - 1]] = value; return c;
    });
  };

  const UI_F = (label: string, path: string, multiline?: boolean) => (
    <F label={label} path={path} multiline={multiline} sectionData={sectionData} onUpdate={u} />
  );

  const renderEditor = () => {
    if (!sectionData || !activeSection) return null;

    // Hero
    if (activeSection === "hero") return (<div className="space-y-4">
      {UI_F("Badge Etiketi", "badge")}{UI_F("Başlık Satır 1", "title_line1")}{UI_F("Başlık Satır 2", "title_line2")}{UI_F("Başlık Satır 3", "title_line3")}{UI_F("Açıklama", "description", true)}
      <div className="grid grid-cols-2 gap-4">{UI_F("Birincil Buton Yazısı", "cta_primary")}{UI_F("Birincil Buton Linki", "cta_primary_link")}</div>
      <div className="grid grid-cols-2 gap-4">{UI_F("İkincil Buton Yazısı", "cta_secondary")}{UI_F("İkincil Buton Linki", "cta_secondary_link")}</div>
      <div className="space-y-4 pt-4 border-t border-border/50">
        <ImageUpload 
          label="Hero Görseli (Monitör İçi)" 
          value={sectionData.visual_image || ""} 
          onChange={(url) => u("visual_image", url)} 
        />
        <div className="space-y-2"><label className="text-xs font-semibold text-meta uppercase">İstatistikler</label>
          {(sectionData.stats || []).map((s: any, i: number) => (<div key={i} className="flex gap-2"><input value={s.value} onChange={e => { const a = [...sectionData.stats]; a[i] = {...a[i], value: e.target.value}; u("stats", a); }} className="w-24 bg-background border border-border p-2 text-sm text-white rounded outline-none focus:border-brand-primary" placeholder="Değer" /><input value={s.label} onChange={e => { const a = [...sectionData.stats]; a[i] = {...a[i], label: e.target.value}; u("stats", a); }} className="flex-1 bg-background border border-border p-2 text-sm text-white rounded outline-none focus:border-brand-primary" placeholder="Etiket" /><DelBtn onClick={() => u("stats", sectionData.stats.filter((_: any, j: number) => j !== i))} /></div>))}
          <AddBtn onClick={() => u("stats", [...(sectionData.stats || []), { value: "", label: "" }])} label="İstatistik Ekle" />
        </div>
      </div>
    </div>);

    // Hakkımızda
    if (activeSection === "hakkimizda") return (<div className="space-y-4">
      {UI_F("Başlık", "title")}{UI_F("Açıklama", "description", true)}
      <div className="space-y-2"><label className="text-xs font-semibold text-meta uppercase">Temel Değerler</label>
        {(sectionData.pillars || []).map((p: any, i: number) => (<div key={i} className="flex gap-2"><input value={p.title} onChange={e => { const a = [...sectionData.pillars]; a[i] = {...a[i], title: e.target.value}; u("pillars", a); }} className="w-32 bg-background border border-border p-2 text-sm text-white rounded outline-none focus:border-brand-primary" placeholder="Başlık" /><input value={p.desc} onChange={e => { const a = [...sectionData.pillars]; a[i] = {...a[i], desc: e.target.value}; u("pillars", a); }} className="flex-1 bg-background border border-border p-2 text-sm text-white rounded outline-none focus:border-brand-primary" placeholder="Açıklama" /><DelBtn onClick={() => u("pillars", sectionData.pillars.filter((_: any, j: number) => j !== i))} /></div>))}
        <AddBtn onClick={() => u("pillars", [...(sectionData.pillars || []), { title: "", desc: "" }])} label="Değer Ekle" />
      </div>
      <div className="space-y-4 pt-4 border-t border-border/50">
        <ImageUpload 
          label="Bölüm Görseli" 
          value={sectionData.main_image || ""} 
          onChange={(url) => u("main_image", url)} 
        />
        <div className="space-y-2"><label className="text-xs font-semibold text-meta uppercase">İstatistikler</label>
          {(sectionData.stats || []).map((s: any, i: number) => (<div key={i} className="flex gap-2"><input value={s.value} onChange={e => { const a = [...sectionData.stats]; a[i] = {...a[i], value: e.target.value}; u("stats", a); }} className="w-24 bg-background border border-border p-2 text-sm text-white rounded outline-none focus:border-brand-primary" /><input value={s.label} onChange={e => { const a = [...sectionData.stats]; a[i] = {...a[i], label: e.target.value}; u("stats", a); }} className="flex-1 bg-background border border-border p-2 text-sm text-white rounded outline-none focus:border-brand-primary" /><DelBtn onClick={() => u("stats", sectionData.stats.filter((_: any, j: number) => j !== i))} /></div>))}
          <AddBtn onClick={() => u("stats", [...(sectionData.stats || []), { value: "", label: "" }])} label="İstatistik Ekle" />
        </div>
      </div>
    </div>);

    // Neden Bizi Seçmelisiniz
    if (activeSection === "whymedyagem") return (<div className="space-y-4">
      {UI_F("Başlık", "title")}{UI_F("Manifesto Metni", "manifesto", true)}
      <div className="space-y-2"><label className="text-xs font-semibold text-meta uppercase">Özellikler</label>
        {(sectionData.features || []).map((f: string, i: number) => (<div key={i} className="flex gap-2"><input value={f} onChange={e => { const a = [...sectionData.features]; a[i] = e.target.value; u("features", a); }} className="flex-1 bg-background border border-border p-2.5 text-sm text-white rounded-lg outline-none focus:border-brand-primary" /><DelBtn onClick={() => u("features", sectionData.features.filter((_: any, j: number) => j !== i))} /></div>))}
        <AddBtn onClick={() => u("features", [...(sectionData.features || []), ""])} label="Özellik Ekle" />
      </div>
    </div>);

    // Çalışmalarımız
    if (activeSection === "projeler") return (<div className="space-y-4">
      {UI_F("Başlık", "title")}{UI_F("Açıklama", "description", true)}
      <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-lg">
        <p className="text-xs text-brand-primary font-medium">Not: Projeler artık "Portfolyo" menüsünden yönetilmektedir. Burada sadece bu bölümün başlık ve açıklama metinlerini değiştirebilirsiniz. "Öne Çıkan" olarak işaretlediğiniz projeler burada otomatik listelenir.</p>
      </div>
    </div>);

    // Süreç
    if (activeSection === "surec") return (<div className="space-y-4">
      {UI_F("Başlık", "title")}{UI_F("Açıklama", "description", true)}
      <div className="space-y-3"><label className="text-xs font-semibold text-meta uppercase">Adımlar</label>
        {(sectionData.steps || []).map((s: any, i: number) => (<div key={i} className="bg-background border border-border rounded-lg p-4 space-y-2"><div className="flex justify-between"><span className="text-xs text-meta font-bold">Adım {i + 1}</span><DelBtn onClick={() => u("steps", sectionData.steps.filter((_: any, j: number) => j !== i))} /></div><div className="grid grid-cols-[60px_1fr] gap-2"><input value={s.id} onChange={e => { const a = [...sectionData.steps]; a[i] = {...a[i], id: e.target.value}; u("steps", a); }} className="bg-surface border border-border p-2 text-sm text-white rounded text-center outline-none focus:border-brand-primary" placeholder="01" /><input value={s.title} onChange={e => { const a = [...sectionData.steps]; a[i] = {...a[i], title: e.target.value}; u("steps", a); }} className="bg-surface border border-border p-2 text-sm text-white rounded outline-none focus:border-brand-primary" placeholder="Başlık" /></div><textarea value={s.desc} onChange={e => { const a = [...sectionData.steps]; a[i] = {...a[i], desc: e.target.value}; u("steps", a); }} rows={2} className="w-full bg-surface border border-border p-2 text-sm text-white rounded resize-none outline-none focus:border-brand-primary" placeholder="Açıklama" /></div>))}
        <AddBtn onClick={() => u("steps", [...(sectionData.steps || []), { id: String(sectionData.steps.length + 1).padStart(2, "0"), title: "", desc: "" }])} label="Adım Ekle" />
      </div>
    </div>);

    // Blog Önizleme
    if (activeSection === "blog_preview") return (<div className="space-y-4">
      {UI_F("Başlık", "title")}{UI_F("Açıklama", "description", true)}
      <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-lg">
        <p className="text-xs text-brand-primary font-medium">Not: Blog yazıları artık "Blog" menüsünden yönetilmektedir. Burada sadece bu bölümün başlık ve açıklama metinlerini değiştirebilirsiniz. En güncel 3 yazı burada otomatik listelenir.</p>
      </div>
    </div>);

    // SSS
    if (activeSection === "faq") return (<div className="space-y-3"><label className="text-xs font-semibold text-meta uppercase">Soru-Cevaplar</label>
      {(sectionData.items || []).map((item: any, i: number) => (<div key={i} className="bg-background border border-border rounded-lg p-4 space-y-2"><div className="flex justify-between"><span className="text-xs text-meta font-bold">Soru {i + 1}</span><DelBtn onClick={() => u("items", sectionData.items.filter((_: any, j: number) => j !== i))} /></div><input value={item.q} onChange={e => { const a = [...sectionData.items]; a[i] = {...a[i], q: e.target.value}; u("items", a); }} className="w-full bg-surface border border-border p-2.5 text-sm text-white rounded outline-none focus:border-brand-primary" placeholder="Soru" /><textarea value={item.a} onChange={e => { const a = [...sectionData.items]; a[i] = {...a[i], a: e.target.value}; u("items", a); }} rows={2} className="w-full bg-surface border border-border p-2.5 text-sm text-white rounded resize-none outline-none focus:border-brand-primary" placeholder="Cevap" /></div>))}
      <AddBtn onClick={() => u("items", [...(sectionData.items || []), { q: "", a: "" }])} label="Soru Ekle" />
    </div>);

    // Hizmet Bölgeleri
    if (activeSection === "hizmetbolgeleri") return (<div className="space-y-4">
      {UI_F("Başlık", "title")}{UI_F("Açıklama", "description", true)}{UI_F("Ek Sayaç Metni", "extra_count")}
      <div className="space-y-2"><label className="text-xs font-semibold text-meta uppercase">Şehirler</label>
        {(sectionData.cities || []).map((c: any, i: number) => (
          <div key={i} className="bg-background/50 border border-border rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-meta font-bold uppercase">Şehir {i + 1}</span>
              <DelBtn onClick={() => u("cities", sectionData.cities.filter((_: any, j: number) => j !== i))} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input 
                value={typeof c === 'string' ? c : (c.name || "")} 
                onChange={e => { 
                  const a = [...sectionData.cities]; 
                  if (typeof c === 'string') a[i] = { name: e.target.value, link: "#" };
                  else a[i] = {...a[i], name: e.target.value}; 
                  u("cities", a); 
                }} 
                className="bg-background border border-border p-2 text-sm text-white rounded outline-none focus:border-brand-primary" 
                placeholder="Şehir Adı" 
              />
              <input 
                value={typeof c === 'string' ? "#" : (c.link || "#")} 
                onChange={e => { 
                  const a = [...sectionData.cities]; 
                  if (typeof c === 'string') a[i] = { name: c, link: e.target.value };
                  else a[i] = {...a[i], link: e.target.value}; 
                  u("cities", a); 
                }} 
                className="bg-background border border-border p-2 text-sm text-white rounded outline-none focus:border-brand-primary" 
                placeholder="Link" 
              />
            </div>
          </div>
        ))}
        <AddBtn onClick={() => u("cities", [...(sectionData.cities || []), { name: "", link: "#" }])} label="Şehir Ekle" />
      </div>
    </div>);

    // Müşteri Yorumları
    if (activeSection === "testimonials") return (<div className="space-y-4">
      {UI_F("Başlık", "title")}{UI_F("Açıklama", "description", true)}
      <div className="space-y-3"><label className="text-xs font-semibold text-meta uppercase">Yorumlar</label>
        {(sectionData.items || []).map((item: any, i: number) => (<div key={i} className="bg-background border border-border rounded-lg p-4 space-y-2"><div className="flex justify-between"><span className="text-xs text-meta font-bold">Yorum {i + 1}</span><DelBtn onClick={() => u("items", sectionData.items.filter((_: any, j: number) => j !== i))} /></div><textarea value={item.quote} onChange={e => { const a = [...sectionData.items]; a[i] = {...a[i], quote: e.target.value}; u("items", a); }} rows={2} className="w-full bg-surface border border-border p-2.5 text-sm text-white rounded resize-none outline-none focus:border-brand-primary" placeholder="Yorum" /><div className="grid grid-cols-3 gap-2"><input value={item.name} onChange={e => { const a = [...sectionData.items]; a[i] = {...a[i], name: e.target.value}; u("items", a); }} className="bg-surface border border-border p-2 text-sm text-white rounded outline-none focus:border-brand-primary" placeholder="İsim" /><input value={item.company} onChange={e => { const a = [...sectionData.items]; a[i] = {...a[i], company: e.target.value}; u("items", a); }} className="bg-surface border border-border p-2 text-sm text-white rounded outline-none focus:border-brand-primary" placeholder="Şirket" /><input value={item.role} onChange={e => { const a = [...sectionData.items]; a[i] = {...a[i], role: e.target.value}; u("items", a); }} className="bg-surface border border-border p-2 text-sm text-white rounded outline-none focus:border-brand-primary" placeholder="Pozisyon" /></div></div>))}
        <AddBtn onClick={() => u("items", [...(sectionData.items || []), { quote: "", name: "", company: "", role: "" }])} label="Yorum Ekle" />
      </div>
    </div>);

    // CTA
    if (activeSection === "cta") return (<div className="space-y-4">
      {UI_F("Başlık Satır 1", "title_line1")}{UI_F("Başlık Satır 2 (Vurgulu)", "title_line2")}{UI_F("Açıklama", "description", true)}
      <div className="grid grid-cols-2 gap-4">{UI_F("Birincil Buton Yazısı", "cta_primary")}{UI_F("Birincil Buton Linki", "cta_primary_link")}</div>
      <div className="grid grid-cols-2 gap-4">{UI_F("İkincil Buton Yazısı", "cta_secondary")}{UI_F("İkincil Buton Linki", "cta_secondary_link")}</div>
      <div className="grid grid-cols-2 gap-4">{UI_F("Telefon (Görünen)", "phone")}{UI_F("Telefon (Ham)", "phone_raw")}</div>
    </div>);

    return null;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-bold text-heading flex items-center gap-2"><LayoutDashboard className="w-6 h-6 text-brand-primary" /> Ana Sayfa Yönetimi</h2>
        <p className="text-desc mt-1">Anasayfadaki tüm bölümleri buradan düzenleyin. Bir bölüme tıklayarak içeriğini güncelleyin.</p>
      </div>

      <div className="space-y-3">
        {SECTION_LIST.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.key} className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
              <button 
                onClick={() => loadSection(s.key)} 
                className={`w-full flex items-center justify-between p-5 text-left hover:bg-background/20 transition-colors ${activeSection === s.key ? 'bg-brand-primary/5 border-b border-border' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-primary/10 rounded-lg"><Icon className="w-5 h-5 text-brand-primary" /></div>
                  <div>
                    <p className="text-main font-semibold">{s.name}</p>
                    <p className="text-xs text-meta">{s.key}</p>
                  </div>
                </div>
                {activeSection === s.key ? <ChevronUp className="w-5 h-5 text-meta" /> : <ChevronDown className="w-5 h-5 text-meta" />}
              </button>
              {activeSection === s.key && sectionData && (
                <div className="p-6 border-t border-border space-y-4">
                  {renderEditor()}
                  <div className="flex justify-end pt-4 border-t border-border/50">
                    <Button onClick={saveSection} disabled={saving} className="gap-2"><Save className="w-4 h-4" /> {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}</Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
