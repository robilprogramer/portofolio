import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/public/projects
 * Get all published projects with pagination and filters
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    // Filters
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    // Build where clause
    const where: any = {
      isPublished: true,
      ...(category ? { category } : {}),
      ...(featured ? { featured: featured === 'true' } : {}),
    };

    // Fetch projects and total count in parallel
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
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
        orderBy: [
          { featured: 'desc' },
          { order: 'asc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    // Build paginated response
    const pagination = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return NextResponse.json({
      success: true,
      data: projects,
      pagination,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
