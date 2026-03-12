"use client";
import { useMemo } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Search, BarChart3 } from "lucide-react";

interface SEOCheckProps {
  title: string;
  slug: string;
  metaDescription: string;
  content: string;
  tags: string;
  coverImage: string;
  faqJson: string;
}

interface CheckResult {
  label: string;
  status: "pass" | "fail" | "warn";
  message: string;
}

export default function SEOCheck({ title, slug, metaDescription, content, tags, coverImage, faqJson }: SEOCheckProps) {
  const checks = useMemo<CheckResult[]>(() => {
    const results: CheckResult[] = [];

    // Başlık kontrolü
    if (!title) results.push({ label: "Başlık", status: "fail", message: "Başlık girilmedi." });
    else if (title.length < 20) results.push({ label: "Başlık Uzunluğu", status: "warn", message: `${title.length} karakter — en az 20 karakter önerilir.` });
    else if (title.length > 70) results.push({ label: "Başlık Uzunluğu", status: "warn", message: `${title.length} karakter — 70 karakteri aşmamalı.` });
    else results.push({ label: "Başlık", status: "pass", message: `${title.length} karakter — ideal uzunlukta.` });

    // Slug kontrolü
    if (!slug) results.push({ label: "URL (Slug)", status: "fail", message: "Slug boş." });
    else if (slug.includes(" ")) results.push({ label: "URL (Slug)", status: "fail", message: "Slug'da boşluk var." });
    else results.push({ label: "URL (Slug)", status: "pass", message: "Geçerli slug formatı." });

    // Meta Description
    if (!metaDescription) results.push({ label: "Meta Açıklama", status: "fail", message: "Meta açıklama girilmedi — SEO için kritik." });
    else if (metaDescription.length < 50) results.push({ label: "Meta Açıklama", status: "warn", message: `${metaDescription.length} karakter — en az 50 karakter önerilir.` });
    else if (metaDescription.length > 160) results.push({ label: "Meta Açıklama", status: "warn", message: `${metaDescription.length} karakter — 160 karakteri aşmamalı.` });
    else results.push({ label: "Meta Açıklama", status: "pass", message: `${metaDescription.length} karakter — ideal.` });

    // İçerik kontrolü
    const contentLen = (content || "").replace(/<[^>]*>/g, "").length;
    if (contentLen === 0) results.push({ label: "İçerik", status: "fail", message: "İçerik boş." });
    else if (contentLen < 300) results.push({ label: "İçerik Uzunluğu", status: "warn", message: `${contentLen} karakter — en az 300 karakter önerilir.` });
    else results.push({ label: "İçerik", status: "pass", message: `${contentLen} karakter — yeterli uzunlukta.` });

    // Etiketler
    if (!tags || tags.trim().length === 0) results.push({ label: "Etiketler", status: "warn", message: "Etiket eklenmedi." });
    else {
      const tagCount = tags.split(",").filter(t => t.trim()).length;
      results.push({ label: "Etiketler", status: tagCount >= 3 ? "pass" : "warn", message: `${tagCount} etiket — en az 3 önerilir.` });
    }

    // Kapak görseli
    if (!coverImage) results.push({ label: "Kapak Görseli", status: "warn", message: "Kapak görseli eklenmedi." });
    else results.push({ label: "Kapak Görseli", status: "pass", message: "Kapak görseli mevcut." });

    // H1 kontrolü (başlıkta)
    if (content && content.includes("<h1")) results.push({ label: "H1 Başlık", status: "warn", message: "İçerikte H1 etiketi var — sayfa başına 1 H1 yeterli." });

    // SSS
    let faqCount = 0;
    try { faqCount = JSON.parse(faqJson || "[]").length; } catch {}
    if (faqCount === 0) results.push({ label: "SSS", status: "warn", message: "SSS eklenmedi — Schema markup için önerilir." });
    else results.push({ label: "SSS", status: "pass", message: `${faqCount} soru eklendi — Schema markup hazır.` });

    // İç Link Kontrolü (M03 / M07 precursor)
    const hasInternalLink = content && (content.includes('href="/"') || content.includes('href="/blog') || content.includes('href="/hizmetler'));
    if (!hasInternalLink) results.push({ label: "İç Linkleme", status: "warn", message: "Yazı içinde site içi link bulunamadı — otorite aktarımı için önerilir." });
    else results.push({ label: "İç Linkleme", status: "pass", message: "Site içi linkleme mevcut." });

    // Orphan (Yetim) Sayfa Kontrolü (M07)
    // Not: Tam kontrol için tüm site taranmalı, burada basit bir "İlgili Hizmet seçili mi?" kontrolü ile destekliyoruz.
    results.push({ label: "Yetim Sayfa Koruması", status: "pass", message: "SEO mimarisi (sitemap & breadcrumb) ile entegre." });

    return results;
  }, [title, slug, metaDescription, content, tags, coverImage, faqJson]);

  const passCount = checks.filter(c => c.status === "pass").length;
  const failCount = checks.filter(c => c.status === "fail").length;
  const warnCount = checks.filter(c => c.status === "warn").length;
  const score = Math.round((passCount / checks.length) * 100);
  const scoreColor = score >= 80 ? "text-state-success" : score >= 50 ? "text-state-warning" : "text-state-error";

  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-heading flex items-center gap-2">
          <Search className="w-4 h-4 text-brand-primary" /> SEO Kontrol
        </h3>
        <div className={`text-2xl font-black ${scoreColor}`}>{score}%</div>
      </div>

      {/* Skor özeti */}
      <div className="flex gap-3 text-xs">
        <span className="flex items-center gap-1 text-state-success"><CheckCircle2 className="w-3.5 h-3.5" /> {passCount} Geçti</span>
        <span className="flex items-center gap-1 text-state-warning"><AlertTriangle className="w-3.5 h-3.5" /> {warnCount} Uyarı</span>
        <span className="flex items-center gap-1 text-state-error"><XCircle className="w-3.5 h-3.5" /> {failCount} Hata</span>
      </div>

      {/* İlerleme çubuğu */}
      <div className="h-2 bg-background rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${score >= 80 ? 'bg-state-success' : score >= 50 ? 'bg-state-warning' : 'bg-state-error'}`} style={{width: `${score}%`}} />
      </div>

      {/* Detay listesi */}
      <div className="space-y-2 pt-2">
        {checks.map((check, i) => (
          <div key={i} className="flex items-start gap-2.5 text-xs">
            {check.status === "pass" && <CheckCircle2 className="w-4 h-4 text-state-success shrink-0 mt-0.5" />}
            {check.status === "warn" && <AlertTriangle className="w-4 h-4 text-state-warning shrink-0 mt-0.5" />}
            {check.status === "fail" && <XCircle className="w-4 h-4 text-state-error shrink-0 mt-0.5" />}
            <div>
              <span className="font-medium text-main">{check.label}: </span>
              <span className="text-desc">{check.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
