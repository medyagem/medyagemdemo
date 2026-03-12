import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { pingIndexNow } from "@/lib/indexnow";
import { logActivity } from "@/lib/activity-logger";

export async function GET() {
  try {
    const items = await prisma.blogPost.findMany({
      orderBy: { created_at: "desc" },
      include: { category: true }
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Blog GET error:", error);
    return NextResponse.json({ error: "Veri çekilemedi." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newItem = await prisma.blogPost.create({
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt || "",
        cover_image: body.cover_image || "",
        content_json: body.content_json || "",
        meta_description: body.meta_description || "",
        tags: body.tags || "",
        faq_json: body.faq_json || "",
        category_id: body.category_id || null,
        is_active: body.is_active ?? true,
        is_featured: body.is_featured ?? false,
        author_name: body.author_name || "MedyaGem",
        published_at: new Date(),
      },
    });

    if (newItem.is_active) {
      pingIndexNow(`/blog/${newItem.slug}`).catch(() => {});
    }

    logActivity({
      type: "blog",
      action: "create",
      title: newItem.title,
      user: "Admin"
    });

    return NextResponse.json(newItem);
  } catch (error) {
    console.error("Blog POST error:", error);
    return NextResponse.json({ error: "Yazı oluşturulamadı." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "ID eksik." }, { status: 400 });

    const updatedItem = await prisma.blogPost.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date()
      }
    });

    if (updatedItem.is_active) {
      pingIndexNow(`/blog/${updatedItem.slug}`).catch(() => {});
    }

    logActivity({
      type: "blog",
      action: "update",
      title: updatedItem.title,
      user: "Admin"
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Blog PUT error:", error);
    return NextResponse.json({ error: "Yazı güncellenemedi." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID eksik." }, { status: 400 });

    const itemToDelete = await prisma.blogPost.findUnique({ where: { id } });
    if (itemToDelete) {
       logActivity({
         type: "blog",
         action: "delete",
         title: itemToDelete.title,
         user: "Admin"
       });
       await prisma.blogPost.delete({ where: { id } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Blog DELETE error:", error);
    return NextResponse.json({ error: "Yazı silinemedi." }, { status: 500 });
  }
}

