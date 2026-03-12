"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { SECTION_DEFAULTS } from "@/lib/sections";

export default function Testimonials() {
  const [data, setData] = useState(SECTION_DEFAULTS.testimonials);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("/api/admin/sections?section=testimonials").then(r => r.ok ? r.json() : null).then(d => { if (d) setData(d); }).catch(() => {});
  }, []);

  const prev = () => setCurrentIndex(p => (p === 0 ? data.items.length - 1 : p - 1));
  const next = () => setCurrentIndex(p => (p === data.items.length - 1 ? 0 : p + 1));
  if (!data.items || data.items.length === 0) return null;

  return (
    <section className="py-24 bg-background border-t border-border">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-heading">{data.title}</h2>
          <p className="text-main text-lg">{data.description}</p>
        </div>
        <div className="relative">
          <div className="overflow-hidden bg-surface border border-border p-8 md:p-12 relative">
            <Quote className="absolute top-8 left-8 w-16 h-16 text-primary/10 rotate-180" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <p className="text-xl md:text-2xl font-medium text-white mb-10 leading-relaxed italic">&quot;{data.items[currentIndex].quote}&quot;</p>
              <div className="flex flex-col">
                <span className="text-heading font-bold text-lg">{data.items[currentIndex].name}</span>
                <span className="text-transparent bg-clip-text bg-brand-glow text-sm font-semibold">{data.items[currentIndex].company}</span>
                <span className="text-meta text-sm">{data.items[currentIndex].role}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-8">
            <button onClick={prev} className="w-12 h-12 flex items-center justify-center border border-border hover:border-primary hover:text-accent transition-colors bg-surface text-white"><ChevronLeft className="w-6 h-6" /></button>
            <div className="flex items-center gap-2">{data.items.map((_: any, i: number) => (<div key={i} className={cn("h-1 transition-all duration-300", i === currentIndex ? "w-8 bg-brand-primary" : "w-2 bg-border")} />))}</div>
            <button onClick={next} className="w-12 h-12 flex items-center justify-center border border-border hover:border-primary hover:text-accent transition-colors bg-surface text-white"><ChevronRight className="w-6 h-6" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
