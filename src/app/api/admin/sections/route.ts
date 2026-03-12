import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SECTION_DEFAULTS } from "@/lib/sections";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sectionKey = searchParams.get("section");
    
    if (sectionKey) {
      const dbSection = await prisma.homepageSection.findUnique({
        where: { section_key: sectionKey }
      });
      
      if (dbSection) {
        return NextResponse.json(JSON.parse(dbSection.content_json || "{}"));
      }
      
      // Veritabanında yoksa varsayılanı döndür
      return NextResponse.json(SECTION_DEFAULTS[sectionKey] || {});
    }

    // Tüm section listesi
    const sections = [
      { key: "hero", name: "Hero Banner" },
      { key: "hakkimizda", name: "Hakkımızda" },
      { key: "whymedyagem", name: "Neden Bizi Seçmelisiniz" },
      { key: "projeler", name: "Çalışmalarımız" },
      { key: "surec", name: "Çalışma Sürecimiz" },
      { key: "blog_preview", name: "Blog Önizleme" },
      { key: "faq", name: "Sıkça Sorulan Sorular" },
      { key: "hizmetbolgeleri", name: "Hizmet Bölgeleri" },
      { key: "testimonials", name: "Müşteri Yorumları" },
      { key: "cta", name: "CTA (Aksiyon Çağrısı)" },
    ];
    return NextResponse.json(sections);
  } catch (error) {
    console.error("Sections GET error:", error);
    return NextResponse.json({ error: "Veri çekilemedi." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { section, data } = body;
    
    if (!section || !data) {
      return NextResponse.json({ error: "Section ve data zorunlu." }, { status: 400 });
    }

    await prisma.homepageSection.upsert({
      where: { section_key: section },
      update: { content_json: JSON.stringify(data) },
      create: { 
        section_key: section, 
        content_json: JSON.stringify(data),
        title: data.title || null
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sections PUT error:", error);
    return NextResponse.json({ error: "Veri kaydedilemedi." }, { status: 500 });
  }
}

