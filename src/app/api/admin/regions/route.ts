import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { logActivity } from "@/lib/activity-logger";

export async function GET() {
  try {
    const items = await prisma.region.findMany({
      orderBy: { created_at: "desc" }
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Regions GET error:", error);
    return NextResponse.json({ error: "Veri çekilemedi." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newItem = await prisma.region.create({
      data: {
        name: body.name,
        slug: body.slug,
        short_description: body.short_description || "",
        hero_title: body.hero_title || "",
        hero_description: body.hero_description || "",
        cover_image: body.cover_image || "",
        overview_content: body.overview_content || "",
        is_active: body.is_active ?? true,
        is_featured: body.is_featured ?? false,
      },
    });

    logActivity({
      type: "region",
      action: "create",
      title: newItem.name,
      user: "Admin"
    });

    return NextResponse.json(newItem);
  } catch (error) {
    console.error("Regions POST error:", error);
    return NextResponse.json({ error: "Bölge oluşturulamadı." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "ID eksik." }, { status: 400 });

    const updatedItem = await prisma.region.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date()
      }
    });

    logActivity({
      type: "region",
      action: "update",
      title: updatedItem.name,
      user: "Admin"
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Regions PUT error:", error);
    return NextResponse.json({ error: "Bölge güncellenemedi." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID eksik." }, { status: 400 });

    const itemToDelete = await prisma.region.findUnique({ where: { id } });
    if (itemToDelete) {
       logActivity({
         type: "region",
         action: "delete",
         title: itemToDelete.name,
         user: "Admin"
       });
       await prisma.region.delete({ where: { id } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Regions DELETE error:", error);
    return NextResponse.json({ error: "Bölge silinemedi." }, { status: 500 });
  }
}

