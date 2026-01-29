import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/public/experiences
 * Get all published work experiences
 */
export async function GET(req: Request) {
  try {
    const experiences = await prisma.experience.findMany({
      where: {
        isPublished: true,
      },
      select: {
        id: true,
        company: true,
        position: true,
        description: true,
        location: true,
        type: true,
        startDate: true,
        endDate: true,
        isCurrent: true,
        technologies: true,
        achievements: true,
        companyLogo: true,
        order: true,
      },
      orderBy: [
        { isCurrent: 'desc' },
        { order: 'asc' },
        { startDate: 'desc' },
      ],
    });

    return NextResponse.json({
      success: true,
      data: experiences,
    });
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch experiences",
    }, { status: 500 });
  }
}
