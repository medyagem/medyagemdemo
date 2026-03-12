"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ArrowRight, Monitor, Settings, Search, Megaphone, Target, ShieldBan, Share2, PenTool } from "lucide-react";
import Link from "next/link";

interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  card_title: string | null;
  card_description: string | null;
}

const ICONS = [Monitor, Settings, Search, Megaphone, Target, ShieldBan, Share2, PenTool];

export default function HizmetlerGrid({ services }: { services: ServiceItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (cardsRef.current.length > 0) {
      gsap.fromTo(cardsRef.current, 
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );
    }

    return () => {
      // ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [services]);

  return (
    <section id="hizmetler" ref={sectionRef} className="py-24 bg-background relative z-10 border-t border-border">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="flex flex-col mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter text-heading">
            Hizmetlerimiz
          </h2>
          <p className="text-main max-w-2xl text-lg">
            İşletmenizin dijital dünyada büyümesi için ihtiyaç duyduğunuz tüm profesyonel çözümleri tek çatı altında sunuyoruz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const IconComponent = ICONS[index % ICONS.length];
            return (
              <Link href={`/hizmetler/${service.slug}`} key={service.id}>
                <div
                  ref={el => { cardsRef.current[index] = el }}
                  className="group bg-surface border border-border p-8 transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-hover-glow flex flex-col justify-between h-full min-h-[300px]"
                >
                  <div>
                    <IconComponent className="w-10 h-10 text-primary mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 group-hover:text-accent" />
                    <h3 className="text-xl font-bold mb-3 text-heading group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-brand-glow transition-all">{service.card_title || service.name}</h3>
                    <p className="text-desc text-sm leading-relaxed mb-6">
                      {service.card_description || "Profesyonel destek alarak büyüyün."}
                    </p>
                  </div>

                  <div className="flex items-center text-sm font-semibold text-white group-hover:text-accent transition-colors cursor-pointer mt-auto">
                    Detay 
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
