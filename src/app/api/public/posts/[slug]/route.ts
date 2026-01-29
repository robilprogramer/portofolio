import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/public/posts/[slug]
 * Get single blog post by slug
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params; // ✅ unwrap Promise

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Slug is required" },
        { status: 400 }
      );
    }

    const post = await prisma.post.findFirst({
      where: {
        slug,
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
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
    });

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch post" },
      { status: 500 }
    );
  }
}
