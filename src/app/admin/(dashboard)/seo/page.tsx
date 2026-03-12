"use client";
import { useState, useEffect } from "react";
import { Search, CheckCircle2, XCircle, AlertTriangle, FileText, Briefcase, PenTool, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface SEOItem { type: string; title: string; slug: string; id: string; meta_description: string; cover_image?: string; tags?: string; }

export default function SEOCenterPage() {
  const [items, setItems] = useState<SEOItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [sRes, bRes, pRes] = await Promise.all([
          fetch("/api/admin/services"), fetch("/api/admin/blog"), fetch("/api/admin/pages"),
        ]);
        const services = sRes.ok ? (await sRes.json()).map((s: any) => ({ type: "service", title: s.name, slug: s.slug, id: s.id, meta_description: s.meta_description || "", cover_image: s.cover_image || "", tags: s.tags || "" })) : [];
        const blogs = bRes.ok ? (await bRes.json()).map((b: any) => ({ type: "blog", title: b.title, slug: b.slug, id: b.id, meta_description: b.meta_description || "", cover_image: b.cover_image || "", tags: b.tags || "" })) : [];
        const pages = pRes.ok ? (await pRes.json()).map((p: any) => ({ type: "page", title: p.title, slug: p.slug, id: p.id, meta_description: p.hero_description || "", cover_image: "" })) : [];
        setItems([...services, ...blogs, ...pages]);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    loadAll();
  }, []);

  const getScore = (item: SEOItem) => {
    let score = 0, total = 5;
    if (item.title && item.title.length >= 20) score++;
    if (item.slug) score++;
    if (item.meta_description && item.meta_description.length >= 50) score++;
    if (item.cover_image) score++;
    if (item.tags && item.tags.split(",").filter(t => t.trim()).length >= 2) score++;
    return Math.round((score / total) * 100);
  };

  const getIcon = (type: string) => {
    if (type === "service") return <Briefcase className="w-4 h-4 text-brand-primary" />;
    if (type === "blog") return <PenTool className="w-4 h-4 text-accent" />;
    return <FileText className="w-4 h-4 text-state-info" />;
  };

  const getEditUrl = (item: SEOItem) => {
    if (item.type === "service") return `/admin/services/${item.id}`;
    if (item.type === "blog") return `/admin/blog/${item.id}`;
    return `/admin/pages/${item.id}`;
  };

  const filtered = filter === "all" ? items : items.filter(i => i.type === filter);
  const avgScore = items.length > 0 ? Math.round(items.reduce((a, i) => a + getScore(i), 0) / items.length) : 0;
  const criticalCount = items.filter(i => getScore(i) < 40).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-bold text-heading flex items-center gap-2"><Search className="w-6 h-6 text-brand-primary" /> SEO Merkezi</h2>
        <p className="text-desc mt-1">Tüm içeriklerin SEO durumunu tek panelden kontrol edin.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5 text-center"><div className={`text-3xl font-black ${avgScore >= 70 ? 'text-state-success' : avgScore >= 40 ? 'text-state-warning' : 'text-state-error'}`}>{avgScore}%</div><div className="text-xs text-desc mt-1">Ortalama SEO Skoru</div></div>
        <div className="bg-surface border border-border rounded-xl p-5 text-center"><div className="text-3xl font-black text-heading">{items.length}</div><div className="text-xs text-desc mt-1">Toplam İçerik</div></div>
        <div className="bg-surface border border-border rounded-xl p-5 text-center"><div className="text-3xl font-black text-state-error">{criticalCount}</div><div className="text-xs text-desc mt-1">Kritik SEO Eksikleri</div></div>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-3 border-b border-border bg-background/50 flex gap-1">
          {[{ id: "all", label: "Tümü" }, { id: "service", label: "Hizmetler" }, { id: "blog", label: "Blog" }, { id: "page", label: "Sayfalar" }].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f.id ? 'bg-brand-primary text-white' : 'text-desc hover:text-main'}`}>{f.label}</button>
          ))}
        </div>
        <div className="divide-y divide-border">
          {loading ? <div className="p-8 text-center text-desc">Yükleniyor...</div> : filtered.length === 0 ? <div className="p-8 text-center text-desc">İçerik bulunamadı.</div> : filtered.map(item => {
            const score = getScore(item);
            return (
              <div key={`${item.type}-${item.id}`} className="px-6 py-4 flex items-center justify-between hover:bg-background/20 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  {getIcon(item.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-main font-medium truncate">{item.title}</p>
                    <p className="text-xs text-meta font-mono">/{item.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${score >= 70 ? 'bg-state-success' : score >= 40 ? 'bg-state-warning' : 'bg-state-error'}`} style={{width: `${score}%`}} />
                    </div>
                    <span className={`text-xs font-bold ${score >= 70 ? 'text-state-success' : score >= 40 ? 'text-state-warning' : 'text-state-error'}`}>{score}%</span>
                  </div>
                  {!item.meta_description && <span className="text-xs text-state-error flex items-center gap-1"><XCircle className="w-3 h-3" /> Meta Yok</span>}
                  <Link href={getEditUrl(item)}><Button variant="ghost" size="sm" className="h-8 px-3 text-xs gap-1"><ExternalLink className="w-3 h-3" /> Düzenle</Button></Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
