import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { is_active: true },
      orderBy: { published_at: "desc" },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Blog GET error:", error);
    return NextResponse.json({ error: "Yazılar yüklenemedi." }, { status: 500 });
  }
}
