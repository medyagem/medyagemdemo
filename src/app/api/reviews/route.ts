import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Belirli bir öğe için yorumları çek
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const entityType = searchParams.get("type");
    const entitySlug = searchParams.get("slug");

    if (!entityType || !entitySlug) {
      return NextResponse.json({ error: "Eksik parametreler." }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: {
        entity_type: entityType,
        entity_id: entitySlug,
        status: "approved",
      },
      orderBy: {
        submitted_at: "desc",
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Yorum çekme hatası:", error);
    return NextResponse.json({ error: "Yorumlar yüklenemedi." }, { status: 500 });
  }
}

// POST: Yeni yorum gönder
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { author_name, rating, comment, entity_type, entity_id } = body;

    if (!author_name || !rating || !entity_type || !entity_id) {
      return NextResponse.json({ error: "Eksik bilgiler." }, { status: 400 });
    }

    const newReview = await prisma.review.create({
      data: {
        author_name,
        rating: parseInt(rating),
        comment,
        entity_type,
        entity_id,
        status: "pending", // Varsayılan olarak onay bekliyor
      },
    });

    return NextResponse.json(newReview);
  } catch (error) {
    console.error("Yorum gönderme hatası:", error);
    return NextResponse.json({ error: "Yorum gönderilemedi." }, { status: 500 });
  }
}
