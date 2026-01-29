import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/public/projects/[slug]
 * Get single project by slug
 */
export async function GET(
  req: NextRequest,
 { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Use findFirst to filter by slug AND isPublished
    const project = await prisma.project.findFirst({
      where: {
        slug,
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        shortDesc: true,
        thumbnail: true,
        images: true,
        liveUrl: true,
        githubUrl: true,
        techStack: true,
        category: true,
        featured: true,
        status: true,
        startDate: true,
        endDate: true,
        views: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}
