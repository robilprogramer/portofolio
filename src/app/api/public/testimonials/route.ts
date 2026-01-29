import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/public/testimonials
 * Get all published testimonials, optionally filter featured
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get('featured');

    const where = {
      isPublished: true,
      ...(featured ? { featured: featured === 'true' } : {}),
    };

    const testimonials = await prisma.testimonial.findMany({
      where,
      select: {
        id: true,
        name: true,
        position: true,
        company: true,
        content: true,
        avatar: true,
        rating: true,
        featured: true,
        order: true,
      },
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch testimonials",
      },
      { status: 500 }
    );
  }
}
