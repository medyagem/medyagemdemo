import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "blog.json");

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
    const allPosts = await readData();
    // Sadece aktif olanları döndür
    const activePosts = allPosts.filter((p: any) => p.is_active);
    // Tarihe göre sırala (en yeni en üstte)
    const sorted = activePosts.sort((a: any, b: any) => 
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
    return NextResponse.json(sorted);
  } catch (error) {
    return NextResponse.json({ error: "Yazılar yüklenemedi." }, { status: 500 });
  }
}
