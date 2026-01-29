import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Simple ApiResponse helper
const ApiResponse = {
  success: (data: any = null, message: string = "Success") => ({ success: true, message, data }),
  error: (message: string, status: number = 400) => ({ success: false, message, status }),
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { path, referrer, userAgent } = body;

    if (!path || !path.trim()) {
      return NextResponse.json(ApiResponse.error("Path is required", 400), { status: 400 });
    }

    // Get client IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip")?.trim() ||
      "unknown";

    // Create page view
    await prisma.pageView.create({
      data: {
        path: path.trim(),
        referrer: referrer?.trim() || null,
        userAgent: userAgent?.trim() || null,
        ip,
        // country: geo?.country || null,
        // city: geo?.city || null,
      },
    });

    return NextResponse.json(ApiResponse.success(null, "Page view tracked"), { status: 201 });
  } catch (error) {
    console.error("Analytics error:", error);
    // Jangan gagal, cukup skip analytics
    return NextResponse.json(ApiResponse.success(null, "Analytics tracking skipped"), { status: 200 });
  }
}
