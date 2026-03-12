"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { SECTION_DEFAULTS } from "@/lib/sections";

export default function Hakkimizda() {
  const [data, setData] = useState(SECTION_DEFAULTS.hakkimizda);
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/admin/sections?section=hakkimizda").then(r => r.ok ? r.json() : null).then(d => { if (d) setData(d); }).catch(() => {});
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } });
    tl.fromTo(leftRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
      .fromTo(rightRef.current?.children ? Array.from(rightRef.current.children) : [], { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power2.out" }, "-=0.4");
  }, []);

  return (
    <section id="hakkimizda" ref={sectionRef} className="py-24 bg-bg-secondary relative z-10 border-t border-border">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 flex flex-col lg:flex-row gap-16 items-center">
        <div ref={leftRef} className="w-full lg:w-1/2">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter text-heading">{data.title}</h2>
          <p className="text-main text-lg mb-8 leading-relaxed">{data.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {(data.pillars || []).map((p: any, i: number) => (<div key={i}><h4 className="text-heading font-bold mb-2">{p.title}</h4><p className="text-sm text-desc">{p.desc}</p></div>))}
          </div>
        </div>
        <div ref={rightRef} className="w-full lg:w-1/2 relative min-h-[400px]">
          {/* Background Image / Placeholder */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden border border-border/50 shadow-2xl z-0">
             <img 
               src={data.main_image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000"} 
               alt="MedyaGem Ofis" 
               className="w-full h-full object-cover opacity-60 hover:scale-105 transition-transform duration-700"
             />
             <div className="absolute inset-0 bg-gradient-to-tr from-background via-transparent to-primary/10" />
          </div>

          {/* Stats Overlay */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 p-8 h-full items-center">
            {(data.stats || []).map((s: any, i: number) => (
              <div key={i} className="bg-surface/80 backdrop-blur-md border border-white/10 p-6 flex flex-col justify-center items-center text-center shadow-xl hover:border-primary/50 transition-all group">
                <span className="text-3xl font-bold text-transparent bg-clip-text bg-brand-glow mb-1 group-hover:scale-110 transition-transform">{s.value}</span>
                <span className="text-xs text-meta font-semibold uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
