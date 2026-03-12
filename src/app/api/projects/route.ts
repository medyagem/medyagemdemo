import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "projects.json");

async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const allProjects = await readData();
    // Sadece aktif olanları döndür
    const activeProjects = allProjects.filter((p: any) => p.is_active);
    return NextResponse.json(activeProjects);
  } catch (error) {
    return NextResponse.json({ error: "Projeler yüklenemedi." }, { status: 500 });
  }
}
