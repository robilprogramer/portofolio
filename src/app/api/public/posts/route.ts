import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/public/posts
 * Get all published blog posts with pagination and filters
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
    const tag = searchParams.get('tag');
    const featured = searchParams.get('featured');

    // Build where clause
    const where: any = {
      isPublished: true,
    };
    if (category) where.category = category;
    if (tag) where.tags = { has: tag };
    if (featured) where.featured = featured === 'true';

    // Fetch posts and total count
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          thumbnail: true,
          tags: true,
          category: true,
          featured: true,
          publishedAt: true,
          views: true,
          readTime: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: [
          { featured: 'desc' },
          { publishedAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch posts",
    }, { status: 500 });
  }
}
