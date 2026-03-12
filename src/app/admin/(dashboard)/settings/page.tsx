"use client";
import { useState, useEffect } from "react";
import { Settings, Save, Globe, Code, Search, Shield, Image as ImageIcon, Tag, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import ImageUpload from "@/components/admin/ImageUpload";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    site_name: "Medyagem",
    site_description: "",
    site_keywords: "",
    robots_txt: "User-agent: *\nAllow: /\nSitemap: https://medyagem.com/sitemap.xml",
    site_logo: "",
    site_favicon: "",
    email: "",
    phone: "",
    address: "",
    whatsapp: "",
    google_tag_manager: "",
    google_analytics: "",
    google_ads_conversion: "",
    facebook_pixel: "",
    yandex_verification: "",
    bing_verification: "",
    pinterest_verification: "",
    head_scripts: "",
    footer_scripts: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data?.data_json) {
            try { setSettings(prev => ({...prev, ...JSON.parse(data.data_json)})); } catch {}
          }
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ group: "contact", data_json: JSON.stringify(settings) }),
      });
      alert("Ayarlar başarıyla kaydedildi.");
    } catch { alert("Hata oluştu."); } finally { setSaving(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (loading) return <div className="p-12 text-center text-desc">Yükleniyor...</div>;

  const tabs = [
    { id: "general", label: "Genel", icon: Globe },
    { id: "seo", label: "SEO & Meta", icon: Search },
    { id: "integrations", label: "Entegrasyonlar", icon: Code },
    { id: "branding", label: "Logo & Favicon", icon: ImageIcon },
    { id: "advanced", label: "Gelişmiş", icon: Shield },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-surface border border-border p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-heading flex items-center gap-2"><Settings className="w-6 h-6 text-brand-primary" /> Site Ayarları</h2>
          <p className="text-desc mt-1">Sitenizin genel yapılandırmasını, SEO ve entegrasyon ayarlarını yönetin.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2"><Save className="w-4 h-4" /> {saving ? "Kaydediliyor..." : "Tümünü Kaydet"}</Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-surface border border-border rounded-xl p-1.5">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-brand-primary text-white shadow-md' : 'text-desc hover:text-main hover:bg-background'}`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Genel */}
      {activeTab === "general" && (
        <div className="bg-surface border border-border rounded-xl p-8 space-y-5 shadow-sm">
          <h3 className="text-lg font-bold text-heading border-b border-border/50 pb-2">Genel Bilgiler</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Site Adı</label><input name="site_name" onChange={handleChange} value={settings.site_name} className="w-full bg-background border border-border p-3 text-white rounded-lg" /></div>
            <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">E-posta</label><input name="email" onChange={handleChange} value={settings.email} className="w-full bg-background border border-border p-3 text-white rounded-lg" /></div>
            <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Telefon</label><input name="phone" onChange={handleChange} value={settings.phone} className="w-full bg-background border border-border p-3 text-white rounded-lg" /></div>
            <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">WhatsApp</label><input name="whatsapp" onChange={handleChange} value={settings.whatsapp} className="w-full bg-background border border-border p-3 text-white rounded-lg" /></div>
          </div>
          <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Adres</label><textarea name="address" onChange={handleChange} value={settings.address} rows={2} className="w-full bg-background border border-border p-3 text-white rounded-lg resize-none" /></div>
        </div>
      )}

      {/* SEO & Meta */}
      {activeTab === "seo" && (
        <div className="bg-surface border border-border rounded-xl p-8 space-y-5 shadow-sm">
          <h3 className="text-lg font-bold text-heading border-b border-border/50 pb-2 flex items-center gap-2"><Search className="w-5 h-5 text-brand-primary" /> SEO ve Meta Veriler</h3>
          <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Site Açıklaması (Meta Description)</label><textarea name="site_description" onChange={handleChange} value={settings.site_description} rows={3} className="w-full bg-background border border-border p-3 text-white rounded-lg resize-none" placeholder="Google arama sonuçlarında görünecek açıklama..." /></div>
          <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Site Anahtar Kelimeler (Keywords)</label><input name="site_keywords" onChange={handleChange} value={settings.site_keywords} className="w-full bg-background border border-border p-3 text-white rounded-lg" placeholder="dijital pazarlama, seo, web tasarım, sosyal medya" /></div>
          <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Robots.txt İçeriği</label><textarea name="robots_txt" onChange={handleChange} value={settings.robots_txt} rows={6} className="w-full bg-background border border-border p-3 text-white rounded-lg resize-y font-mono text-sm" /></div>
        </div>
      )}

      {/* Entegrasyonlar */}
      {activeTab === "integrations" && (
        <div className="bg-surface border border-border rounded-xl p-8 space-y-5 shadow-sm">
          <h3 className="text-lg font-bold text-heading border-b border-border/50 pb-2 flex items-center gap-2"><Code className="w-5 h-5 text-brand-primary" /> Pazarlama ve Analitik Entegrasyonları</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Google Tag Manager ID</label><input name="google_tag_manager" onChange={handleChange} value={settings.google_tag_manager} className="w-full bg-background border border-border p-3 text-white rounded-lg font-mono text-sm" placeholder="GTM-XXXXXXX" /></div>
            <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Google Analytics ID</label><input name="google_analytics" onChange={handleChange} value={settings.google_analytics} className="w-full bg-background border border-border p-3 text-white rounded-lg font-mono text-sm" placeholder="G-XXXXXXXXXX" /></div>
            <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Google Ads Conversion ID</label><input name="google_ads_conversion" onChange={handleChange} value={settings.google_ads_conversion} className="w-full bg-background border border-border p-3 text-white rounded-lg font-mono text-sm" placeholder="AW-XXXXXXXXXX" /></div>
            <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Facebook Pixel ID</label><input name="facebook_pixel" onChange={handleChange} value={settings.facebook_pixel} className="w-full bg-background border border-border p-3 text-white rounded-lg font-mono text-sm" placeholder="XXXXXXXXXXXXXXXX" /></div>
          </div>
          <h4 className="text-sm font-bold text-heading pt-2">Arama Motoru Doğrulama Kodları</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Yandex Doğrulama</label><input name="yandex_verification" onChange={handleChange} value={settings.yandex_verification} className="w-full bg-background border border-border p-3 text-white rounded-lg font-mono text-sm" /></div>
            <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Bing Doğrulama</label><input name="bing_verification" onChange={handleChange} value={settings.bing_verification} className="w-full bg-background border border-border p-3 text-white rounded-lg font-mono text-sm" /></div>
            <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Pinterest Doğrulama</label><input name="pinterest_verification" onChange={handleChange} value={settings.pinterest_verification} className="w-full bg-background border border-border p-3 text-white rounded-lg font-mono text-sm" /></div>
          </div>
        </div>
      )}

      {/* Logo & Favicon */}
      {activeTab === "branding" && (
        <div className="bg-surface border border-border rounded-xl p-8 space-y-6 shadow-sm">
          <h3 className="text-lg font-bold text-heading border-b border-border/50 pb-2 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-brand-primary" /> Marka Görselleri</h3>
          <div className="grid grid-cols-2 gap-8">
            <ImageUpload label="Site Logo" value={settings.site_logo} onChange={(url) => setSettings(p => ({...p, site_logo: url}))} />
            <ImageUpload label="Site Favicon" value={settings.site_favicon} onChange={(url) => setSettings(p => ({...p, site_favicon: url}))} />
          </div>
        </div>
      )}

      {/* Gelişmiş */}
      {activeTab === "advanced" && (
        <div className="bg-surface border border-border rounded-xl p-8 space-y-5 shadow-sm">
          <h3 className="text-lg font-bold text-heading border-b border-border/50 pb-2 flex items-center gap-2"><Shield className="w-5 h-5 text-brand-primary" /> Özel Kodlar</h3>
          <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Head Scriptleri (Sayfa üst kısmı)</label><textarea name="head_scripts" onChange={handleChange} value={settings.head_scripts} rows={5} className="w-full bg-background border border-border p-3 text-white rounded-lg resize-y font-mono text-sm" placeholder="<!-- Google Tag Manager, Schema.org vb. -->" /></div>
          <div className="space-y-1"><label className="text-xs font-semibold text-meta uppercase">Footer Scriptleri (Sayfa alt kısmı)</label><textarea name="footer_scripts" onChange={handleChange} value={settings.footer_scripts} rows={5} className="w-full bg-background border border-border p-3 text-white rounded-lg resize-y font-mono text-sm" placeholder="<!-- Chat widget, analytics vb. -->" /></div>
        </div>
      )}
    </div>
  );
}
