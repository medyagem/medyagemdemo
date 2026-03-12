import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: {
        submitted_at: "desc",
      },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Yorum listeleme hatası:", error);
    return NextResponse.json({ error: "Yorumlar alınamadı." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;
    
    if (!id) return NextResponse.json({ error: "ID eksik." }, { status: 400 });

    const updatedReview = await prisma.review.update({
      where: { id },
      data: { 
        status, 
        approved_at: status === "approved" ? new Date() : null 
      },
    });

    // Aktivite logla
    logActivity({
      type: "review",
      action: "update",
      title: `${updatedReview.author_name} - ${status === 'approved' ? 'Onaylandı' : 'Reddedildi'}`,
      user: "Admin"
    });

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error("Yorum güncelleme hatası:", error);
    return NextResponse.json({ error: "Yorum güncellenemedi." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) return NextResponse.json({ error: "ID eksik." }, { status: 400 });

    const itemToDelete = await prisma.review.findUnique({
      where: { id }
    });

    if (itemToDelete) {
       logActivity({
         type: "review",
         action: "delete",
         title: `${itemToDelete.author_name} yorumu`,
         user: "Admin"
       });
       
       await prisma.review.delete({
         where: { id }
       });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Yorum silme hatası:", error);
    return NextResponse.json({ error: "Yorum silinemedi." }, { status: 500 });
  }
}

