"use client";

import { useState, useEffect } from "react";
import PageHero from "@/components/ui/PageHero";
import Link from "next/link";
import { ArrowRight, Monitor, BarChart2, MousePointerClick, CheckCircle, Smartphone, PenTool, Search, Globe, LayoutGrid } from "lucide-react";
import Faq from "@/sections/Faq";
import Cta from "@/sections/Cta";
import WhyMedyagem from "@/sections/WhyMedyagem";
import { Button } from "@/components/ui/Button";

const ICONS = [Monitor, BarChart2, MousePointerClick, CheckCircle, Smartphone, PenTool, Search, Globe];

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/services").then(r => r.json()),
      fetch("/api/admin/service-categories").then(r => r.json())
    ])
    .then(([sData, cData]) => {
      if (Array.isArray(sData)) setServices(sData);
      if (Array.isArray(cData)) setCategories(cData.filter((c: any) => c.is_active !== false));
    })
    .catch(() => {})
    .finally(() => setLoading(false));
  }, []);

  const filteredServices = selectedCat
    ? services.filter(s => s.category_id === selectedCat)
    : services;

  return (
    <>
      <PageHero
        title={<>Tek Çatı Altında <span className="text-transparent bg-clip-text bg-brand-glow">360° Dijital Hizmetler</span></>}
        description="Markanızın ihtiyacı olan modern web altyapısı, kusursuz görünürlük ve performans odaklı reklam yönetimi."
        breadcrumbItems={[{ label: "Hizmetler" }]}
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="#hizmet-listesi">
            <Button size="lg" className="w-full sm:w-auto font-semibold">Tüm Hizmetleri İncele</Button>
          </Link>
          <Link href="/iletisim">
            <Button size="lg" variant="outline" className="w-full sm:w-auto font-semibold border-white/20 hover:bg-white/10">Ücretsiz Teklif Al</Button>
          </Link>
        </div>
      </PageHero>

      <section id="hizmet-listesi" className="py-24 bg-background border-t border-border/50">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          {/* Kategori Filtresi */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            <button
              onClick={() => setSelectedCat(null)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                selectedCat === null 
                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                : "bg-surface border-border text-desc hover:border-primary/50"
              }`}
            >
              Tüm Hizmetler
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                  selectedCat === cat.id 
                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                  : "bg-surface border-border text-desc hover:border-primary/50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-desc">Hizmetler yükleniyor...</div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-20">
               <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-surface border border-border mb-6">
                 <LayoutGrid className="w-10 h-10 text-desc opacity-40" />
               </div>
               <h3 className="text-2xl font-bold text-heading">Hizmet Bulunamadı</h3>
               <p className="text-desc mt-2">Bu kategoride henüz bir hizmet eklenmemiş.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service, index) => {
                const IconComponent = ICONS[index % ICONS.length];
                return (
                  <Link key={service.id} href={`/hizmetler/${service.slug}`} className="group flex flex-col bg-surface border border-border overflow-hidden hover:border-primary transition-all duration-500 rounded-2xl shadow-lg hover:shadow-primary/10">
                    {/* Kapak Görseli */}
                    <div className="relative aspect-video w-full overflow-hidden border-b border-border/50">
                      {service.cover_image ? (
                        <img src={service.cover_image} alt={service.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full bg-background flex items-center justify-center">
                           <IconComponent className="w-16 h-16 text-primary/20" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 z-10">
                         <span className="px-3 py-1 bg-primary/90 text-white text-[10px] font-bold uppercase tracking-widest rounded-md">
                            {categories.find(c => c.id === service.category_id)?.name || "Hizmet"}
                         </span>
                      </div>
                    </div>

                    <div className="p-8 flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-heading group-hover:text-primary transition-colors leading-tight">{service.card_title || service.name}</h3>
                      </div>
                      <p className="text-desc leading-relaxed line-clamp-3 mb-8 flex-grow text-sm">{service.card_description || service.hero_description || "MedyaGem ile markanızı dijitalde bir üst seviyeye taşıyın."}</p>
                      
                      <div className="mt-auto pt-6 border-t border-border/50 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-meta">
                        <span>{service.created_at ? new Date(service.created_at).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' }) : 'Profesyonel Hizmet'}</span>
                        <div className="flex items-center text-primary group-hover:gap-2 transition-all duration-300">
                          DETAYLAR <ArrowRight className="w-4 h-4 ml-1.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <WhyMedyagem />
      <Faq />
      <Cta />
    </>
  );
}
