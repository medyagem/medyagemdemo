import React from "react";
import Breadcrumb from "./Breadcrumb";

interface PageHeroProps {
  title: React.ReactNode;
  description: string;
  breadcrumbItems: { label: string; href?: string }[];
  image?: string;
  imageAlt?: string;
  children?: React.ReactNode;
}

export default function PageHero({ title, description, breadcrumbItems, image, imageAlt, children }: PageHeroProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Ana Sayfa",
        "item": "https://medyagem.com"
      },
      ...breadcrumbItems.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": item.href ? `https://medyagem.com${item.href}` : undefined
      }))
    ]
  };

  return (
    <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 overflow-hidden border-b border-border bg-hero-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-glow opacity-[0.05] blur-[150px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 blur-[120px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
        <Breadcrumb items={breadcrumbItems} />
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 text-heading max-w-4xl text-balance">
          {title}
        </h1>
        
        <p className="text-lg md:text-xl text-main max-w-2xl leading-relaxed mb-8">
          {description}
        </p>

        {children && (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
