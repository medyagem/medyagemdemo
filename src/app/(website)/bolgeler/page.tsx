"use client";

import { useState, useEffect } from "react";
import PageHero from "@/components/ui/PageHero";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import Faq from "@/sections/Faq";

export default function RegionsListingPage() {
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/regions")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setRegions(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        title={<>Sınırları Aşan <span className="text-transparent bg-clip-text bg-brand-glow">Dijital Çözümler</span></>}
        description="MedyaGem olarak sadece bir lokasyonda değil; kurduğumuz modern uzaktan çalışma modeliyle Türkiye'nin 81 ilinde aktif hizmet veriyoruz."
        breadcrumbItems={[{ label: "Bölgeler" }]}
      />

      <section className="py-24 bg-background">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl md:text-5xl font-bold text-heading">Müşteriniz Neredeyse <br/> İşletmeniz Orada</h2>
            <p className="text-main leading-relaxed text-lg">
              Fiziksel mesafelerin ticarette önemini yitirdiği yeni nesil düzende biz, &quot;uzaktan danışmanlık&quot; adı altında son derece verimli ve kesintisiz bir çalışma modeli sunuyoruz.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="border border-border p-4 bg-surface">
                <span className="text-primary font-bold text-lg mb-2 block">Yerel (Lokal) SEO</span>
                <p className="text-sm text-desc">İlgili ildeki arama hacmine göre optimize edilmiş çalışmalar.</p>
              </div>
              <div className="border border-border p-4 bg-surface">
                <span className="text-secondary font-bold text-lg mb-2 block">Zaman Tasarrufu</span>
                <p className="text-sm text-desc">Online toplantılarla hızlı dönüşümler ve kesintisiz destek ağı.</p>
              </div>
            </div>
          </div>
          <div className="h-full min-h-[400px] border border-border bg-bg-secondary flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,rgba(93,169,255,0.2)_0%,transparent_70%)]" />
            <MapPin className="w-24 h-24 text-primary mb-6 animate-bounce" />
            <h3 className="text-3xl font-black text-heading uppercase tracking-widest relative z-10">TÜRKİYE GENELİ HİZMET</h3>
            <p className="text-meta text-center mt-2 relative z-10">Sorunsuz teslimat ve %100 memnuniyet</p>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-heading mb-10 pb-4 border-b border-border">Merkezi Hizmet Bölgelerimiz</h2>
          {loading ? (
            <div className="text-center py-12 text-desc">Yükleniyor...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regions.map((region) => (
                <Link key={region.id} href={`/bolgeler/${region.slug}`} className="group flex flex-col bg-surface border border-border overflow-hidden hover:border-primary transition-all duration-300">
                  {/* Kapak Görseli */}
                  {region.cover_image && (
                    <div className="h-[180px] w-full overflow-hidden">
                      <img src={region.cover_image} alt={region.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  )}
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-heading group-hover:text-primary transition-colors flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-desc group-hover:text-primary transition-colors" />
                        {region.name}
                      </h3>
                    </div>
                    <p className="text-desc leading-relaxed line-clamp-3 mb-6 flex-grow">
                      {region.short_description || ""}
                    </p>
                    <div className="flex items-center text-primary font-bold mt-auto group-hover:translate-x-2 transition-transform text-sm">
                      {region.name} Dijital Pazarlama
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-12 p-6 border border-border border-dashed text-center bg-surface">
            <p className="text-main italic">Sadece yukarıdaki şehirler değil, <strong>81 ilimizdeki</strong> işletmelerle de büyük bir özenle çalışmaktayız.</p>
          </div>
        </div>
      </section>
      <Faq />
    </>
  );
}
