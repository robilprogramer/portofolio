import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * POST /api/public/projects/[slug]/view
 * Increment project view count
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Increment views safely only if project exists and is published
    const result = await prisma.project.updateMany({
      where: {
        slug,
        isPublished: true,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { success: false, message: "Project not found or not published" },
        { status: 404 }
      );
    }

    // Fetch updated view count
    const project = await prisma.project.findFirst({
      where: { slug, isPublished: true },
      select: { views: true },
    });

    return NextResponse.json({
      success: true,
      message: "View count updated",
      data: { views: project?.views ?? 0 },
    });
  } catch (error) {
    console.error("Error updating project views:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update view count" },
      { status: 500 }
    );
  }
}
