"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/ui/PageHero";

export default function KVKKPage() {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/api/admin/pages").then(r => r.json()).then(pages => {
      const kvkk = pages.find((p: any) => p.slug === "kvkk" || p.page_key === "kvkk");
      if (kvkk?.content_json) {
        try {
          const parsed = JSON.parse(kvkk.content_json);
          setContent(parsed.content || "");
        } catch { setContent(""); }
      }
    }).catch(() => {});
  }, []);

  return (
    <div>
      <PageHero
        title="KVKK Aydınlatma Metni"
        description="Kişisel verilerin korunması hakkında bilgilendirme"
        breadcrumbItems={[{ label: "KVKK Aydınlatma Metni" }]}
      />
      <section className="py-16 bg-background">
        <div className="max-w-[900px] mx-auto px-6 lg:px-8">
          <div className="bg-surface border border-border rounded-2xl p-8 md:p-12 shadow-sm">
            {content ? (
              <div className="prose prose-invert prose-lg max-w-none [&_h2]:text-heading [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:mt-8 [&_h3]:text-heading [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-3 [&_h3]:mt-6 [&_p]:text-main [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:text-main [&_li]:mb-2" dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <div className="text-desc text-center py-12">İçerik yükleniyor...</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
