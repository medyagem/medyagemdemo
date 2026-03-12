import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { pingIndexNow } from "@/lib/indexnow";
import { logActivity } from "@/lib/activity-logger";

export async function GET() {
  try {
    const items = await prisma.service.findMany({
      orderBy: { created_at: "asc" },
      include: { category: true }
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Services GET error:", error);
    return NextResponse.json({ error: "Veri çekilemedi." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newItem = await prisma.service.create({
      data: {
        name: body.name,
        slug: body.slug,
        card_title: body.card_title || "",
        card_description: body.card_description || "",
        is_active: body.is_active ?? true,
        is_featured: body.is_featured ?? false,
        cover_image: body.cover_image || "",
        hero_title: body.hero_title || "",
        hero_description: body.hero_description || "",
        overview_content: body.overview_content || "",
        meta_description: body.meta_description || "",
        tags: body.tags || "",
        faq_json: body.faq_json || "",
        category_id: body.category_id || null,
      },
    });

    if (newItem.is_active) {
      pingIndexNow(`/hizmetler/${newItem.slug}`).catch(() => {});
    }

    logActivity({
      type: "service",
      action: "create",
      title: newItem.name,
      user: "Admin"
    });

    return NextResponse.json(newItem);
  } catch (error) {
    console.error("Services POST error:", error);
    return NextResponse.json({ error: "Hizmet oluşturulamadı." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "ID eksik." }, { status: 400 });

    const updatedItem = await prisma.service.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date()
      }
    });

    if (updatedItem.is_active) {
      pingIndexNow(`/hizmetler/${updatedItem.slug}`).catch(() => {});
    }

    logActivity({
      type: "service",
      action: "update",
      title: updatedItem.name,
      user: "Admin"
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Services PUT error:", error);
    return NextResponse.json({ error: "Hizmet güncellenemedi." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID eksik." }, { status: 400 });

    const itemToDelete = await prisma.service.findUnique({ where: { id } });
    if (itemToDelete) {
       logActivity({
         type: "service",
         action: "delete",
         title: itemToDelete.name,
         user: "Admin"
       });
       await prisma.service.delete({ where: { id } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Services DELETE error:", error);
    return NextResponse.json({ error: "Hizmet silinemedi." }, { status: 500 });
  }
}

