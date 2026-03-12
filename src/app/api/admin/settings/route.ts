import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";

export async function GET() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { group: "general" }
    });
    return NextResponse.json({ data_json: setting?.data_json || "{}" });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ error: "Ayarlar çekilemedi." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let dataToSave: string;

    if (body.data_json) {
      dataToSave = body.data_json;
    } else {
      dataToSave = JSON.stringify(body);
    }

    const merged = await prisma.siteSetting.upsert({
      where: { group: "general" },
      update: { data_json: dataToSave },
      create: { group: "general", data_json: dataToSave }
    });

    logActivity({
      type: "settings",
      action: "update",
      title: "Site Genel Ayarları",
      user: "Admin"
    });

    return NextResponse.json({ success: true, data_json: merged.data_json });
  } catch (error) {
    console.error("Settings POST error:", error);
    return NextResponse.json({ error: "Ayarlar kaydedilemedi." }, { status: 500 });
  }
}
