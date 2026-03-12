"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { MapPin } from "lucide-react";
import { SECTION_DEFAULTS } from "@/lib/sections";

export default function HizmetBolgeleri() {
  const [data, setData] = useState(SECTION_DEFAULTS.hizmetbolgeleri);
  const sectionRef = useRef<HTMLElement>(null);
  const citiesRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    fetch("/api/admin/sections?section=hizmetbolgeleri").then(r => r.ok ? r.json() : null).then(d => { if (d) setData(d); }).catch(() => {});
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo(citiesRef.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.05, ease: "back.out(1.7)", scrollTrigger: { trigger: sectionRef.current, start: "top 75%" } });
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-bg-secondary border-t border-border overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4 text-heading">{data.title}</h2>
        <p className="text-main text-lg mb-12 max-w-2xl mx-auto">{data.description}</p>
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {(data.cities || []).map((city: any, idx: number) => {
            const name = typeof city === "string" ? city : city.name;
            const link = typeof city === "string" ? "#" : city.link;
            
            return (
              <a 
                key={idx} 
                href={link}
                ref={el => { citiesRef.current[idx] = el }} 
                className="group flex flex-col items-center justify-center bg-surface border border-border px-6 py-4 min-w-[140px] hover:border-primary hover:bg-[#1C1F36] transition-all duration-300 cursor-pointer"
              >
                <MapPin className="w-5 h-5 text-desc mb-2 group-hover:text-primary transition-colors" />
                <span className="text-white font-medium group-hover:text-accent transition-colors">{name}</span>
              </a>
            );
          })}
          <div className="flex flex-col items-center justify-center bg-primary/10 border border-primary/30 px-6 py-4 min-w-[140px]">
            <span className="text-accent font-bold">{data.extra_count}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
