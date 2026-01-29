import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");
    const days = Number(searchParams.get("days") ?? 30);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const where = {
      createdAt: { gte: startDate },
      ...(path ? { path } : {}),
    };

    // Total views
    const totalViews = await prisma.pageView.count({ where });

    // Top pages
    const pageViews = await prisma.pageView.groupBy({
      by: ["path"],
      where,
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    });

    // Daily views menggunakan $queryRaw tag function yang benar
    let dailyViews: { date: Date; views: bigint }[];
    if (path) {
      dailyViews = await prisma.$queryRaw<{ date: Date; views: bigint }[]>`
        SELECT DATE("createdAt") AS date, COUNT(*) AS views
        FROM "page_views"
        WHERE "createdAt" >= ${startDate} AND "path" = ${path}
        GROUP BY DATE("createdAt")
        ORDER BY date DESC
      `;
    } else {
      dailyViews = await prisma.$queryRaw<{ date: Date; views: bigint }[]>`
        SELECT DATE("createdAt") AS date, COUNT(*) AS views
        FROM "page_views"
        WHERE "createdAt" >= ${startDate}
        GROUP BY DATE("createdAt")
        ORDER BY date DESC
      `;
    }

    const stats = {
      totalViews,
      uniqueVisitors: Math.ceil(totalViews * 0.5),
      topPages: pageViews.map(pv => ({
        path: pv.path,
        views: pv._count?.path ?? 0,
      })),
      dailyViews: dailyViews.map(dv => ({
        date: dv.date.toISOString().split("T")[0],
        views: Number(dv.views),
      })),
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
