"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { SECTION_DEFAULTS } from "@/lib/sections";

export default function Surec() {
  const [data, setData] = useState(SECTION_DEFAULTS.surec);
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    fetch("/api/admin/sections?section=surec").then(r => r.ok ? r.json() : null).then(d => { if (d) setData(d); }).catch(() => {});
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo(lineRef.current, { height: "0%" }, { height: "100%", ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top 50%", end: "bottom 80%", scrub: true } });
    stepsRef.current.forEach((step) => {
      gsap.fromTo(step, { opacity: 0.3, x: -20 }, { opacity: 1, x: 0, duration: 0.5, scrollTrigger: { trigger: step, start: "top 70%" } });
    });
  }, []);

  return (
    <section id="surec" ref={sectionRef} className="py-24 bg-bg-secondary border-t border-border">
      <div className="max-w-[900px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-heading">{data.title}</h2>
          <p className="text-main text-lg">{data.description}</p>
        </div>
        <div className="relative pl-8 md:pl-16">
          <div className="absolute left-[15px] md:left-[31px] top-0 bottom-0 w-[2px] bg-border" />
          <div ref={lineRef} className="absolute left-[15px] md:left-[31px] top-0 w-[2px] bg-brand-primary" />
          <div className="flex flex-col gap-12">
            {(data.steps || []).map((step: any, idx: number) => (
              <div key={idx} ref={el => { stepsRef.current[idx] = el }} className="relative flex flex-col pt-2 group">
                <div className="absolute -left-[40px] md:-left-[56px] top-2 w-[18px] h-[18px] rounded-full bg-background border-2 border-primary flex items-center justify-center z-10 transition-all duration-300 group-hover:scale-125 group-hover:border-accent">
                  <div className="w-[6px] h-[6px] bg-primary group-hover:bg-accent rounded-full transition-colors" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-heading mb-2 flex items-center gap-3">
                  <span className="text-brand-primary text-transparent bg-clip-text bg-brand-primary text-base md:text-lg">{step.id}</span>{step.title}
                </h3>
                <p className="text-desc text-base md:text-lg leading-relaxed max-w-xl">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
