import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.blogCategory.findMany({
      orderBy: { order_no: "asc" }
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("BlogCategories GET error:", error);
    return NextResponse.json({ error: "Veri çekilemedi." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newItem = await prisma.blogCategory.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || "",
        order_no: body.order_no || 0,
        is_active: body.is_active ?? true,
      },
    });
    return NextResponse.json(newItem);
  } catch (error) {
    console.error("BlogCategories POST error:", error);
    return NextResponse.json({ error: "Kategori oluşturulamadı." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "ID eksik." }, { status: 400 });

    const updatedItem = await prisma.blogCategory.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date()
      }
    });
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("BlogCategories PUT error:", error);
    return NextResponse.json({ error: "Kategori güncellenemedi." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID eksik." }, { status: 400 });

    await prisma.blogCategory.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("BlogCategories DELETE error:", error);
    return NextResponse.json({ error: "Kategori silinemedi." }, { status: 500 });
  }
}

