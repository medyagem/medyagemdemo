import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Uploads dizinini kontrol et/oluştur
    const uploadDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Dizin zaten varsa hata vermez
    }

    // Sharp ile görseli WebP'ye dönüştür ve optimize et
    const optimizedBuffer = await sharp(buffer)
      .webp({ quality: 80 })
      .toBuffer();

    // Benzersiz dosya adı oluştur (her zaman .webp)
    const fileName = `${randomUUID()}.webp`;
    const path = join(uploadDir, fileName);

    await writeFile(path, optimizedBuffer);
    const url = `/uploads/${fileName}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Yükleme sırasında hata oluştu." }, { status: 500 });
  }
}
