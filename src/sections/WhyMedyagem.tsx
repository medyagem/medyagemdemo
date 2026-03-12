"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { SECTION_DEFAULTS } from "@/lib/sections";

export default function WhyMedyagem() {
  const [data, setData] = useState(SECTION_DEFAULTS.whymedyagem);
  const sectionRef = useRef<HTMLElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/admin/sections?section=whymedyagem").then(r => r.ok ? r.json() : null).then(d => { if (d) setData(d); }).catch(() => {});
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(title1Ref.current, { x: -100, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true } });
    gsap.to(title2Ref.current, { x: 100, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true } });
    if (wordsRef.current) {
      const words = wordsRef.current.querySelectorAll("span");
      gsap.fromTo(words, { opacity: 0.2 }, { opacity: 1, duration: 1, stagger: 0.1, scrollTrigger: { trigger: wordsRef.current, start: "top 80%", end: "bottom 50%", scrub: true } });
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-32 bg-background relative overflow-hidden border-t border-border">
      <div className="w-full font-black text-[12vw] leading-[0.85] tracking-tighter whitespace-nowrap opacity-5 select-none text-white pointer-events-none mb-20 flex flex-col items-center justify-center">
        <h2 ref={title1Ref} className="w-full text-center">NEDEN MEDYAGEM</h2>
        <h2 ref={title2Ref} className="w-full text-center text-primary">NEDEN MEDYAGEM</h2>
      </div>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="flex flex-col justify-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-8 text-heading">{data.title}</h3>
          <div ref={wordsRef} className="text-2xl md:text-3xl font-medium leading-tight text-main flex flex-wrap gap-x-2">
            {data.manifesto.split(" ").map((word: string, i: number) => (<span key={i} className="transition-colors">{word}</span>))}
          </div>
        </div>
        <div className="flex flex-col justify-center gap-6">
          {data.features.map((feature: string, idx: number) => (
            <div key={idx} className="flex items-center gap-4 bg-surface p-6 border border-border transition-all hover:bg-[#1C1F36] hover:border-primary">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><div className="w-2.5 h-2.5 bg-accent rounded-full shadow-[0_0_10px_rgba(93,169,255,0.8)]" /></div>
              <p className="text-lg font-semibold text-heading">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
