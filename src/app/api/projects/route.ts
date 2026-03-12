import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { is_active: true },
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json({ error: "Projeler yüklenemedi." }, { status: 500 });
  }
}
