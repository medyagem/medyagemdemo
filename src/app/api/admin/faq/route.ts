import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { logActivity } from "@/lib/activity-logger";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await prisma.faqItem.findMany({
      orderBy: { order_no: "asc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("FAQ GET error:", error);
    return NextResponse.json({ error: "Veri çekilemedi." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newItem = await prisma.faqItem.create({
      data: {
        group_key: body.group_key || "genel",
        question: body.question,
        answer: body.answer,
        order_no: body.order_no || 0,
        is_active: body.is_active ?? true,
      },
    });

    logActivity({
      type: "review", // Generic activity type for FAQ
      action: "create",
      title: newItem.question,
      user: "Admin"
    });

    return NextResponse.json(newItem);
  } catch (error) {
    console.error("FAQ POST error:", error);
    return NextResponse.json({ error: "SSS oluşturulamadı." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "ID eksik." }, { status: 400 });

    const updatedItem = await prisma.faqItem.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date()
      }
    });

    logActivity({
      type: "review",
      action: "update",
      title: updatedItem.question,
      user: "Admin"
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("FAQ PUT error:", error);
    return NextResponse.json({ error: "SSS güncellenemedi." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID eksik." }, { status: 400 });

    const itemToDelete = await prisma.faqItem.findUnique({ where: { id } });
    if (itemToDelete) {
       logActivity({
         type: "review",
         action: "delete",
         title: itemToDelete.question,
         user: "Admin"
       });
       await prisma.faqItem.delete({ where: { id } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("FAQ DELETE error:", error);
    return NextResponse.json({ error: "SSS silinemedi." }, { status: 500 });
  }
}

