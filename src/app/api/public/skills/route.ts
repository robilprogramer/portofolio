import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { SkillCategory } from "@prisma/client";

/**
 * GET /api/public/skills
 * Get all published skills, optionally filtered by category
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryParam = searchParams.get('category');

    // Validasi category: pastikan termasuk enum SkillCategory
    const category = Object.values(SkillCategory).includes(categoryParam as SkillCategory)
      ? (categoryParam as SkillCategory)
      : undefined;

    const where = {
      isPublished: true,
      ...(category && { category }),
    };

    const skills = await prisma.skill.findMany({
      where,
      select: {
        id: true,
        name: true,
        category: true,
        level: true,
        icon: true,
        color: true,
        order: true,
      },
      orderBy: [
        { order: 'asc' },
        { level: 'desc' },
      ],
    });

    return NextResponse.json({
      success: true,
      data: skills,
    });
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}
