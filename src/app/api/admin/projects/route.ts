import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { pingIndexNow } from "@/lib/indexnow";
import { logActivity } from "@/lib/activity-logger";

export async function GET() {
  try {
    const items = await prisma.project.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json({ error: "Veri çekilemedi." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newItem = await prisma.project.create({
      data: {
        project_name: body.project_name,
        slug: body.slug,
        client_name: body.client_name || "",
        sector: body.sector || "",
        summary: body.summary || "",
        cover_image: body.cover_image || "",
        website_url: body.website_url || "",
        is_active: body.is_active ?? true,
        is_featured: body.is_featured ?? false,
      },
    });

    if (newItem.is_active) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://medyagem.net';
      pingIndexNow([`${siteUrl}/calismalar`]).catch(() => {});
    }

    logActivity({
      type: "project",
      action: "create",
      title: newItem.project_name,
      user: "Admin"
    });

    return NextResponse.json(newItem);
  } catch (error) {
    console.error("Projects POST error:", error);
    return NextResponse.json({ error: "Proje oluşturulamadı." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "ID eksik." }, { status: 400 });

    const updatedItem = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date()
      }
    });

    if (updatedItem.is_active) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://medyagem.net';
      pingIndexNow([`${siteUrl}/calismalar`]).catch(() => {});
    }

    logActivity({
      type: "project",
      action: "update",
      title: updatedItem.project_name,
      user: "Admin"
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Projects PUT error:", error);
    return NextResponse.json({ error: "Proje güncellenemedi." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID eksik." }, { status: 400 });

    const itemToDelete = await prisma.project.findUnique({ where: { id } });
    if (itemToDelete) {
       logActivity({
         type: "project",
         action: "delete",
         title: itemToDelete.project_name,
         user: "Admin"
       });
       await prisma.project.delete({ where: { id } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Projects DELETE error:", error);
    return NextResponse.json({ error: "Proje silinemedi." }, { status: 500 });
  }
}

