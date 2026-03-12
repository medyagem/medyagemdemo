import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { logActivity } from "@/lib/activity-logger";

export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { updated_at: "desc" },
    });
    return NextResponse.json(pages);
  } catch (error) {
    console.error("Pages GET error:", error);
    return NextResponse.json({ error: "Veri çekilemedi." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newPage = await prisma.page.create({
      data: {
        page_key: body.page_key || body.slug,
        title: body.title,
        slug: body.slug,
        hero_title: body.hero_title || "",
        hero_description: body.hero_description || "",
        content_json: body.content_json || "",
        status: body.status || "published",
      },
    });

    logActivity({
      type: "page",
      action: "create",
      title: newPage.title,
      user: "Admin"
    });

    return NextResponse.json(newPage);
  } catch (error) {
    console.error("Pages POST error:", error);
    return NextResponse.json({ error: "Sayfa oluşturulamadı." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "ID eksik." }, { status: 400 });

    const updatedPage = await prisma.page.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date()
      }
    });

    logActivity({
      type: "page",
      action: "update",
      title: updatedPage.title,
      user: "Admin"
    });

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error("Pages PUT error:", error);
    return NextResponse.json({ error: "Sayfa güncellenemedi." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID eksik." }, { status: 400 });

    const pageToDelete = await prisma.page.findUnique({ where: { id } });
    if (pageToDelete) {
       logActivity({
         type: "page",
         action: "delete",
         title: pageToDelete.title,
         user: "Admin"
       });
       await prisma.page.delete({ where: { id } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Pages DELETE error:", error);
    return NextResponse.json({ error: "Sayfa silinemedi." }, { status: 500 });
  }
}
