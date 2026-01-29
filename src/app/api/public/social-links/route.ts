import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/public/social-links
 * Get all published social media links
 */
export async function GET(req: Request) {
  try {
    const socialLinks = await prisma.socialLink.findMany({
      where: {
        isPublished: true,
      },
      select: {
        id: true,
        platform: true,
        url: true,
        icon: true,
        order: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: socialLinks,
    });
  } catch (error) {
    console.error("Error fetching social links:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch social links",
      },
      { status: 500 }
    );
  }
}
