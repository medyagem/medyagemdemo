import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const DATA_FILE = path.join(process.cwd(), "data", "homepage.json");

const DEMO_SECTIONS = [
  { id: "sec-1", section_key: "hero", name: "Hero Banner", display_order: 1, is_visible: true },
  { id: "sec-2", section_key: "hizmetler", name: "Hizmetler", display_order: 2, is_visible: true },
  { id: "sec-3", section_key: "hakkimizda", name: "Hakkımızda", display_order: 3, is_visible: true },
  { id: "sec-4", section_key: "projeler", name: "Çalışmalarımız", display_order: 4, is_visible: true },
  { id: "sec-5", section_key: "testimonials", name: "Müşteri Yorumları", display_order: 5, is_visible: true },
  { id: "sec-6", section_key: "faq", name: "SSS", display_order: 6, is_visible: true },
  { id: "sec-7", section_key: "blog_preview", name: "Blog Önizleme", display_order: 7, is_visible: true },
  { id: "sec-8", section_key: "cta", name: "CTA", display_order: 8, is_visible: true },
];

async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(DEMO_SECTIONS, null, 2), "utf-8");
    return DEMO_SECTIONS;
  }
}

async function writeData(data: any[]) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  try {
    return NextResponse.json(await readData());
  } catch {
    return NextResponse.json(DEMO_SECTIONS);
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "ID eksik." }, { status: 400 });
    const items = await readData();
    const idx = items.findIndex((p: any) => p.id === id);
    if (idx === -1) return NextResponse.json({ error: "Bölüm bulunamadı." }, { status: 404 });
    items[idx] = { ...items[idx], ...data };
    await writeData(items);
    return NextResponse.json(items[idx]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Bölüm güncellenemedi." }, { status: 500 });
  }
}
