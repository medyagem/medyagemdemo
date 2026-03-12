"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";
import { PhoneCall } from "lucide-react";
import { SECTION_DEFAULTS } from "@/lib/sections";

export default function Cta() {
  const [data, setData] = useState(SECTION_DEFAULTS.cta);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/admin/sections?section=cta").then(r => r.ok ? r.json() : null).then(d => { if (d) setData(d); }).catch(() => {});
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo(ctaRef.current, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: ctaRef.current, start: "top 80%" } });
  }, []);

  return (
    <section className="py-24 bg-background border-t border-border px-6 lg:px-8">
      <div ref={ctaRef} className="max-w-[1280px] mx-auto bg-surface border border-border p-12 md:p-20 text-center relative overflow-hidden flex flex-col items-center shadow-lg">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-heading leading-tight">
            {data.title_line1} <br/><span className="text-transparent bg-clip-text bg-brand-glow hover:brightness-125 transition-all cursor-pointer inline-block">{data.title_line2}</span>
          </h2>
          <p className="text-main text-lg md:text-xl mb-12 leading-relaxed">{data.description}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href={data.cta_primary_link || "https://wa.me/905386295834"} target="_blank" rel="noopener noreferrer"><Button size="lg" className="w-full sm:w-auto h-16 px-10 text-lg group">{data.cta_primary}</Button></a>
            <a href={data.cta_secondary_link || "tel:05386295834"}><Button variant="secondary" size="lg" className="w-full sm:w-auto h-16 px-10 text-lg gap-3"><PhoneCall className="w-5 h-5" /> {data.cta_secondary}</Button></a>
          </div>
          <div className="mt-8"><a href={`tel:${data.phone_raw}`} className="text-2xl md:text-3xl font-bold tracking-widest text-white hover:text-accent transition-colors drop-shadow-[0_0_10px_rgba(93,169,255,0.3)]">{data.phone}</a></div>
        </div>
      </div>
    </section>
  );
}
