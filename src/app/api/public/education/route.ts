import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/public/education
 * Get all published education records
 */
export async function GET(req: Request) {
  try {
    const education = await prisma.education.findMany({
      where: {
        isPublished: true,
      },
      select: {
        id: true,
        institution: true,
        degree: true,
        field: true,
        description: true,
        location: true,
        gpa: true,
        startDate: true,
        endDate: true,
        isCurrent: true,
        achievements: true,
        logo: true,
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
      data: education,
    });
  } catch (error) {
    console.error("Error fetching education records:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch education records",
    }, { status: 500 });
  }
}
