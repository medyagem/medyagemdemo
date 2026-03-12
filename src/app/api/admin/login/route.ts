import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password } = body;

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { message: "Admin password not configured in environment" },
        { status: 500 }
      );
    }

    if (password === adminPassword) {
      cookies().set({
        name: "admin_session",
        value: "active",
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 weeks
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { message: "Hatalı şifre" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
