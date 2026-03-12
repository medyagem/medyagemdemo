import PageHero from "@/components/ui/PageHero";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Cta from "@/sections/Cta";
import { getProjects } from "@/lib/data-fetchers";

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHero
        title={<>Başarıya Ulaşan <span className="text-transparent bg-clip-text bg-brand-glow">Projelerimiz</span></>}
        description="Farklı sektörlerdeki işletmeler için tasarladığımız, %100 performans ve dönüşüm odaklı dijital çözümlerimizi inceleyin."
        breadcrumbItems={[{ label: "Çalışmalar" }]}
      />

      <section className="py-24 bg-background">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {projects.map((proj) => (
              <Link key={proj.id} href={`/calismalar/${proj.slug}`} className="group relative h-[350px] bg-surface border border-border overflow-hidden cursor-pointer flex flex-col justify-end">
                {/* Kapak Görseli */}
                {proj.cover_image ? (
                  <div className="absolute inset-0">
                    <img src={proj.cover_image} alt={proj.project_name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-[#1C1F36] transition-transform duration-700 ease-out group-hover:scale-105 flex items-center justify-center">
                    <div className="w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(93,169,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%]" />
                    <span className="absolute text-border font-medium text-lg tracking-widest z-0 mix-blend-overlay">{(proj.project_name || "").toUpperCase()}</span>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />

                {/* İçerik */}
                <div className="relative z-20 p-8 transform translate-y-2 transition-all duration-500 group-hover:translate-y-0">
                  <span className="inline-block px-3 py-1 bg-primary/20 border border-primary/50 text-accent text-xs font-semibold mb-3">
                    {proj.sector || "Dijital"}
                  </span>
                  <h3 className="text-2xl font-bold text-heading tracking-tight mb-1 flex justify-between items-center group-hover:text-accent transition-colors">
                    {proj.project_name}
                    <ArrowUpRight className="w-6 h-6 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                  </h3>
                  <p className="text-desc text-sm">{proj.summary || ""}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Başarı Skoru */}
          <div className="bg-brand-primary p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 border border-border">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
            <div className="relative z-10 flex-1">
              <h3 className="text-3xl md:text-5xl font-black text-white mb-6">Ortalama Başarı Skorumuz</h3>
              <p className="text-white/90 text-lg leading-relaxed max-w-xl">
                Teslim ettiğimiz projelerde işletmelerin arama motoru görünürlüklerinde ilk 3 ayda gözlemlenen net sıçrama verileri.
              </p>
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-8 min-w-[300px]">
              <div className="flex flex-col"><span className="text-5xl font-black text-white mb-2">+%125</span><span className="text-white/80 font-medium">Trafik Artışı</span></div>
              <div className="flex flex-col"><span className="text-5xl font-black text-white mb-2">+%40</span><span className="text-white/80 font-medium">Dönüşüm Oranı</span></div>
              <div className="flex flex-col"><span className="text-5xl font-black text-white mb-2">35+</span><span className="text-white/80 font-medium">Yeni Müşteri (Aylık)</span></div>
              <div className="flex flex-col"><span className="text-5xl font-black text-white mb-2">%100</span><span className="text-white/80 font-medium">Mobil Uyum</span></div>
            </div>
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}
