import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * POST /api/public/posts/[slug]/view
 * Increment post view count
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Unwrap params promise
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Slug is required" },
        { status: 400 }
      );
    }

    // First, find the post to ensure it exists and is published
    const post = await prisma.post.findUnique({
      where: { slug },
      select: { views: true, isPublished: true },
    });

    if (!post || !post.isPublished) {
      return NextResponse.json(
        { success: false, message: "Post not found or not published" },
        { status: 404 }
      );
    }

    // Increment views safely
    const updatedPost = await prisma.post.update({
      where: { slug },
      data: { views: { increment: 1 } },
      select: { views: true },
    });

    return NextResponse.json({
      success: true,
      message: "View count updated",
      data: { views: updatedPost.views },
    });
  } catch (error) {
    console.error("Error updating post views:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update view count" },
      { status: 500 }
    );
  }
}
