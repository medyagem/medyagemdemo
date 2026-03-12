"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";
import AdsProtectionDashboard from "@/components/ui/AdsProtectionDashboard";
import { SECTION_DEFAULTS } from "@/lib/sections";

export default function Hero() {
  const [data, setData] = useState(SECTION_DEFAULTS.hero);
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleLinesRef = useRef<(HTMLHeadingElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/admin/sections?section=hero").then(r => r.ok ? r.json() : null).then(d => { if (d) setData(d); }).catch(() => {});
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    gsap.set(titleLinesRef.current, { y: 100, opacity: 0 });
    gsap.set(contentRef.current, { y: 40, opacity: 0 });
    gsap.set(visualRef.current, { opacity: 0, scale: 0.95 });

    tl.to(titleLinesRef.current, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.2 })
      .to(contentRef.current, { y: 0, opacity: 1, duration: 0.6 }, "-=0.4")
      .to(visualRef.current, { opacity: 1, scale: 1, duration: 1.0, ease: "power2.out" }, "-=0.4");

    ScrollTrigger.create({
      trigger: sectionRef.current, start: "top top", end: "+=120%",
      animation: gsap.timeline()
        .to(".hero-bg-anim", { y: () => window.innerHeight * 0.3, ease: "none" }, 0)
        .to(".hero-content-wrapper", { scale: 0.88, opacity: 0, y: -40, ease: "none" }, 0),
      scrub: true,
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-[100vh] min-h-[800px] flex items-center overflow-hidden pt-20 bg-hero-bg">
      <div className="hero-bg-anim absolute inset-0 z-0 bg-[linear-gradient(to_right,#1C1F36_1px,transparent_1px),linear-gradient(to_bottom,#1C1F36_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-background/40 to-background pointer-events-none" />

      <div className="hero-content-wrapper w-full max-w-[1440px] mx-auto px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-start gap-16 lg:gap-8 pt-10">
        <div className="w-full lg:w-[40%] flex flex-col items-start translate-y-4">
          <div className="px-4 py-1.5 border border-primary/30 rounded-full text-xs font-semibold text-accent mb-6 bg-primary/10" style={{ opacity: 0 }} ref={() => {}}>
            {data.badge}
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <div className="overflow-hidden">
              <h1 ref={el => { titleLinesRef.current[0] = el }} className="text-5xl md:text-6xl lg:text-[76px] font-bold text-white tracking-tighter leading-[1.05]">{data.title_line1}</h1>
            </div>
            <div className="overflow-hidden">
              <h1 ref={el => { titleLinesRef.current[1] = el }} className="text-5xl md:text-6xl lg:text-[76px] font-bold text-white tracking-tighter leading-[1.05]">
                {data.title_line2.includes("Dijital") ? <>{data.title_line2.split("Dijital")[0]}<span className="text-transparent bg-clip-text bg-brand-glow">Dijital</span>{data.title_line2.split("Dijital")[1]}</> : data.title_line2}
              </h1>
            </div>
            <div className="overflow-hidden">
              <h1 ref={el => { titleLinesRef.current[2] = el }} className="text-5xl md:text-6xl lg:text-[76px] font-bold text-white tracking-tighter leading-[1.05]">{data.title_line3}</h1>
            </div>
          </div>

          <div ref={contentRef} className="flex flex-col w-full relative z-20">
            <p className="text-lg md:text-xl text-main max-w-xl leading-relaxed mb-8">{data.description}</p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a href={data.cta_primary_link || "https://wa.me/905386295834"} target="_blank" rel="noopener noreferrer"><Button size="lg" className="w-full sm:w-auto font-semibold">{data.cta_primary}</Button></a>
              <a href={data.cta_secondary_link || "/hizmetler"}><Button variant="secondary" size="lg" className="w-full sm:w-auto">{data.cta_secondary}</Button></a>
            </div>
            <div className="flex items-center gap-6 mt-12 text-sm text-meta font-medium border-t border-border pt-6 w-full max-w-lg">
              {(data.stats || []).map((stat: any, idx: number) => (
                <div key={idx} className="flex items-center gap-6">
                  {idx > 0 && <div className="w-px h-8 bg-border" />}
                  <div className="flex flex-col">
                    <span className="text-white text-xl font-bold">{stat.value}</span>
                    <span>{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div ref={visualRef} className="w-full lg:w-[60%] relative hidden lg:block -mt-[20px] lg:translate-x-12">
          <div className="relative scale-110 origin-center">
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-brand-glow opacity-10 blur-[100px] rounded-full pointer-events-none" />
            {/* Monitör çerçevesi */}
            <img 
              src={data.visual_image || "/sahte-tiklama-monitor.png"} 
              alt="Sahte Tıklama Monitörü" 
              className="w-full h-auto relative z-10 drop-shadow-[0_40px_100px_rgba(45,107,255,0.3)] transition-transform duration-700 hover:scale-[1.02]"
              // @ts-ignore
              fetchPriority="high"
            />
            {/* Ekran içinde canlı AdsProtectionDashboard */}
            <div 
              className="absolute z-20 overflow-hidden rounded-[4px]" 
              style={{ 
                top: '17.2%', left: '20.6%', right: '20.6%', bottom: '22.2%',
                boxShadow: 'inset 0 0 40px rgba(34,197,94,0.1), inset 0 0 100px rgba(11,15,28,0.7)'
              }}
            >
              <div className="w-[100%] h-[100%]">
                <AdsProtectionDashboard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
