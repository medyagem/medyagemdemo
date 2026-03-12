"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SECTION_DEFAULTS } from "@/lib/sections";

export default function Blog() {
  const [data, setData] = useState(SECTION_DEFAULTS.blog_preview);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Section metadata çek
        const sectionRes = await fetch("/api/admin/sections?section=blog_preview");
        if (sectionRes.ok) {
          const sData = await sectionRes.json();
          setData((prev: any) => ({ ...prev, ...sData }));
        }

        // 2. Gerçek blog yazılarını çek
        const blogRes = await fetch("/api/blog");
        if (blogRes.ok) {
          const bData = await blogRes.json();
          if (Array.isArray(bData) && bData.length > 0) {
            // İlk 3 yazıyı al ve eski yapıya uygun eşle
            const latest = bData.slice(0, 3).map((p: any) => ({
              title: p.title,
              desc: p.excerpt,
              date: new Date(p.published_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
              category: (p.tags || "").split(",")[0] || "Genel",
              slug: p.slug,
              cover_image: p.cover_image
            }));
            setData((prev: any) => ({ ...prev, items: latest }));
          }
        }
      } catch (err) {
        console.error("Blog yüklenirken hata:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo(cardsRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out", scrollTrigger: { trigger: sectionRef.current, start: "top 70%" } });
  }, []);

  return (
    <section id="blog" ref={sectionRef} className="py-24 bg-background border-t border-border">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-heading">{data.title}</h2>
            <p className="text-main max-w-xl text-lg">{data.description}</p>
          </div>
          <button className="text-white hover:text-accent transition-colors font-medium border-b border-white hover:border-accent pb-1">Tüm Yazıları Gör</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(data.items || []).map((post: any, idx: number) => (
            <Link href={`/blog/${post.slug}`} key={idx}>
              <div ref={el => { cardsRef.current[idx] = el }} className="group cursor-pointer border border-border bg-surface overflow-hidden flex flex-col h-full transition-all hover:border-primary hover:shadow-hover-glow">
                <div className="w-full h-56 bg-brand-primary/10 relative overflow-hidden">
                  {post.cover_image ? (
                    <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(93,169,255,0.15)_50%,transparent_75%)] bg-[length:250%_250%] group-hover:animate-[gradient_1.5s_linear_infinite]" />
                  )}
                  <span className="absolute top-4 left-4 bg-background/90 backdrop-blur-md border border-border px-3 py-1 text-xs font-semibold text-accent">{post.category}</span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-meta text-xs mb-3 font-medium">{post.date}</span>
                  <h3 className="text-xl font-bold text-heading mb-3 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-brand-glow transition-all line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-desc leading-relaxed mb-6 line-clamp-3">{post.desc}</p>
                  <div className="mt-auto flex items-center text-sm font-semibold text-white group-hover:text-accent transition-colors">Devamını Oku <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" /></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
