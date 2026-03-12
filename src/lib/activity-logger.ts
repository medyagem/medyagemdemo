import { prisma } from "@/lib/prisma";

export interface Activity {
  id: string;
  type: string;
  action: string;
  title: string;
  timestamp: Date;
  user: string;
}

export async function logActivity(activity: {
  type: string;
  action: string;
  title: string;
  user?: string;
}) {
  try {
    await prisma.siteActivity.create({
      data: {
        type: activity.type,
        action: activity.action,
        title: activity.title,
        user: activity.user || "Admin",
      },
    });
  } catch (error) {
    console.error("Activity logging error:", error);
  }
}

export async function getActivities(): Promise<Activity[]> {
  try {
    const items = await prisma.siteActivity.findMany({
      orderBy: { timestamp: "desc" },
      take: 50,
    });
    return items.map((item: any) => ({
      id: item.id,
      type: item.type,
      action: item.action,
      title: item.title,
      timestamp: item.timestamp,
      user: item.user,
    }));
  } catch (error) {
    console.error("Get activities error:", error);
    return [];
  }
}
