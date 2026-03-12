import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getActivities } from "@/lib/activity-logger";

export async function GET() {
  try {
    const [blogCount, serviceCount, regionCount, reviewCount, activities] = await Promise.all([
      prisma.blogPost.count(),
      prisma.service.count(),
      prisma.region.count(),
      prisma.review.count({ where: { status: "pending" } }),
      getActivities()
    ]);

    return NextResponse.json({
      stats: {
        blog: blogCount,
        services: serviceCount,
        regions: regionCount,
        reviews: reviewCount,
      },
      activities: activities.slice(0, 10),
    });
  } catch (error) {
    console.error("Dashboard GET error:", error);
    return NextResponse.json({ error: "İstatistikler alınamadı." }, { status: 500 });
  }
}
