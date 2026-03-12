"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { SECTION_DEFAULTS } from "@/lib/sections";

export default function Projeler() {
  const [data, setData] = useState(SECTION_DEFAULTS.projeler);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Section metadata çek (Başlık ve Açıklama için)
        const sectionRes = await fetch("/api/admin/sections?section=projeler");
        if (sectionRes.ok) {
          const sData = await sectionRes.json();
          setData((prev: any) => ({ ...prev, ...sData }));
        }

        // 2. Gerçek projeleri çek
        const projectsRes = await fetch("/api/projects");
        if (projectsRes.ok) {
          const pData = await projectsRes.json();
          if (Array.isArray(pData) && pData.length > 0) {
            // Öne çıkanları başa al, en fazla 4 adet göster
            const sorted = [...pData].sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
            setData((prev: any) => ({ ...prev, items: sorted.slice(0, 4) }));
          }
        }
      } catch (err) {
        console.error("Projeler yüklenirken hata:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo(headerRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } });
    gsap.fromTo(cardsRef.current, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out", scrollTrigger: { trigger: sectionRef.current, start: "top 60%" } });
  }, []);

  return (
    <section id="projeler" ref={sectionRef} className="py-24 bg-background border-t border-border overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-heading">{data.title}</h2>
            <p className="text-main max-w-xl text-lg">{data.description}</p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-white font-medium hover:text-accent transition-colors">Tümünü Gör <ArrowUpRight className="w-5 h-5" /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.items.map((proj: any, idx: number) => (
            <div key={idx} ref={el => { cardsRef.current[idx] = el }} className="group relative h-[400px] bg-surface border border-border overflow-hidden cursor-pointer flex flex-col justify-end p-8">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10 opacity-90" />
              <div className="absolute inset-x-8 top-8 bottom-[120px] bg-[#1C1F36] border border-border scale-[1] transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.05] flex items-center justify-center overflow-hidden">
                {proj.cover_image ? (
                  <img src={proj.cover_image} alt={proj.project_name || proj.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <>
                    <div className="w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(93,169,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[gradient_3s_linear_infinite]" />
                    <span className="absolute text-border font-medium text-lg tracking-widest">{(proj.project_name || proj.name).toUpperCase()}</span>
                  </>
                )}
              </div>
              <div className="relative z-20 transform translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                <span className="inline-block px-3 py-1 bg-primary/20 border border-primary/50 text-accent text-xs font-semibold mb-3">{proj.sector}</span>
                <h3 className="text-2xl font-bold text-heading tracking-tight mb-1 flex justify-between items-center group-hover:text-accent transition-colors">
                  {proj.project_name || proj.name} <ArrowUpRight className="w-6 h-6 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                </h3>
                <p className="text-desc text-sm">{proj.summary || proj.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
