"use client";
import { useState } from "react";
import { Code2, Copy, CheckCircle2, Building2, Briefcase, FileText, HelpCircle, Star, List } from "lucide-react";
import { Button } from "@/components/ui/Button";

const SCHEMA_TYPES = [
  {
    type: "Organization",
    icon: Building2,
    description: "Şirket bilgilerini arama motorlarına tanımlar",
    template: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "MedyaGem Dijital Ajans",
      url: "https://medyagem.com",
      logo: "https://medyagem.com/logo.png",
      contactPoint: { "@type": "ContactPoint", telephone: "", contactType: "customer service", areaServed: "TR", availableLanguage: "Turkish" },
      sameAs: []
    }
  },
  {
    type: "LocalBusiness",
    icon: Building2,
    description: "Yerel işletme bilgileri (Google Haritalar entegrasyonu)",
    template: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "MedyaGem Dijital Ajans",
      image: "",
      address: { "@type": "PostalAddress", streetAddress: "", addressLocality: "İstanbul", addressRegion: "İstanbul", postalCode: "", addressCountry: "TR" },
      telephone: "",
      priceRange: "₺₺"
    }
  },
  {
    type: "Service",
    icon: Briefcase,
    description: "Hizmet sayfaları için yapılandırılmış veri",
    template: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "",
      description: "",
      provider: { "@type": "Organization", name: "MedyaGem" },
      areaServed: "TR"
    }
  },
  {
    type: "Article / BlogPosting",
    icon: FileText,
    description: "Blog yazıları için makale şeması",
    template: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: "",
      description: "",
      author: { "@type": "Person", name: "MedyaGem" },
      publisher: { "@type": "Organization", name: "MedyaGem" },
      datePublished: "",
      image: ""
    }
  },
  {
    type: "FAQPage",
    icon: HelpCircle,
    description: "SSS sayfaları için zengin sonuç şeması",
    template: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [{ "@type": "Question", name: "Soru?", acceptedAnswer: { "@type": "Answer", text: "Cevap" } }]
    }
  },
  {
    type: "AggregateRating",
    icon: Star,
    description: "Toplu değerlendirme puanı şeması",
    template: {
      "@context": "https://schema.org",
      "@type": "AggregateRating",
      itemReviewed: { "@type": "Organization", name: "MedyaGem" },
      ratingValue: "4.9",
      bestRating: "5",
      ratingCount: "47"
    }
  },
  {
    type: "BreadcrumbList",
    icon: List,
    description: "Sayfa hiyerarşisi navigasyonu",
    template: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://medyagem.com" },
        { "@type": "ListItem", position: 2, name: "Hizmetler", item: "https://medyagem.com/hizmetler" }
      ]
    }
  },
];

export default function SchemaCenter() {
  const [activeType, setActiveType] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [editableJson, setEditableJson] = useState("");

  const openSchema = (type: string) => {
    if (activeType === type) { setActiveType(null); return; }
    const schema = SCHEMA_TYPES.find(s => s.type === type);
    setActiveType(type);
    setEditableJson(JSON.stringify(schema?.template, null, 2));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`<script type="application/ld+json">\n${editableJson}\n</script>`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-bold text-heading flex items-center gap-2"><Code2 className="w-6 h-6 text-brand-primary" /> Schema Merkezi</h2>
        <p className="text-desc mt-1">Schema.org JSON-LD yapılandırılmış veri şablonlarını yönetin. Google zengin sonuçlar için kritik öneme sahiptir.</p>
      </div>

      <div className="space-y-3">
        {SCHEMA_TYPES.map(schema => (
          <div key={schema.type} className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
            <button onClick={() => openSchema(schema.type)} className={`w-full flex items-center justify-between p-5 text-left hover:bg-background/20 transition-colors ${activeType === schema.type ? 'bg-brand-primary/5' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-primary/10 rounded-lg"><schema.icon className="w-5 h-5 text-brand-primary" /></div>
                <div>
                  <p className="text-main font-semibold">{schema.type}</p>
                  <p className="text-xs text-desc">{schema.description}</p>
                </div>
              </div>
            </button>
            {activeType === schema.type && (
              <div className="p-5 border-t border-border space-y-4">
                <textarea value={editableJson} onChange={e => setEditableJson(e.target.value)} rows={12} className="w-full bg-background border border-border p-4 text-sm text-white rounded-lg resize-y font-mono" />
                <div className="flex gap-2">
                  <Button onClick={copyToClipboard} className="gap-2">{copied ? <><CheckCircle2 className="w-4 h-4" /> Kopyalandı</> : <><Copy className="w-4 h-4" /> Script Olarak Kopyala</>}</Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
