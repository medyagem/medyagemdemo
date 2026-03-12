"use client";

import { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { SECTION_DEFAULTS } from "@/lib/sections";

export default function Faq() {
  const [data, setData] = useState(SECTION_DEFAULTS.faq);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    fetch("/api/admin/sections?section=faq").then(r => r.ok ? r.json() : null).then(d => { if (d) setData(d); }).catch(() => {});
  }, []);

  return (
    <section className="py-24 bg-background border-t border-border">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-heading">Sıkça Sorulan Sorular</h2>
          <p className="text-main text-lg">Merak ettiğiniz her şey, şeffaf ve net cevaplarıyla burada.</p>
        </div>
        <div className="space-y-4">
          {data.items.map((faq: any, idx: number) => (
            <div key={idx} className={cn("border border-border transition-all duration-300", openIndex === idx ? "bg-surface" : "bg-transparent hover:bg-surface/50")}>
              <button onClick={() => setOpenIndex(openIndex === idx ? null : idx)} className="w-full flex items-center justify-between p-6 text-left">
                <span className={cn("text-lg font-semibold transition-colors", openIndex === idx ? "text-heading" : "text-main")}>{faq.q}</span>
                <div className={cn("w-10 h-10 flex items-center justify-center border border-border transition-all shrink-0 ml-4", openIndex === idx ? "bg-primary/20 border-primary/50" : "")}>
                  {openIndex === idx ? <Minus className="w-5 h-5 text-accent" /> : <Plus className="w-5 h-5 text-desc" />}
                </div>
              </button>
              <div className={cn("overflow-hidden transition-all duration-300 px-6", openIndex === idx ? "max-h-96 pb-6" : "max-h-0")}>
                <p className="text-main leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
