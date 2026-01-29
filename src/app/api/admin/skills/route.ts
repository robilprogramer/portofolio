import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["FRONTEND", "BACKEND", "DATABASE", "DEVOPS", "MOBILE", "TOOLS", "SOFT_SKILLS", "OTHER"]),
  level: z.number().min(0).max(100).optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  order: z.number().optional(),
  isPublished: z.boolean().optional(),
})

// GET all skills
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || ""
    const published = searchParams.get("published")

    const where: Record<string, unknown> = {}

    if (category) {
      where.category = category
    }

    if (published !== null && published !== undefined) {
      where.isPublished = published === "true"
    }

    const skills = await prisma.skill.findMany({
      where,
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    })

    return NextResponse.json({ data: skills })
  } catch (error) {
    console.error("Error fetching skills:", error)
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    )
  }
}

// POST create new skill
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = skillSchema.parse(body)

    const skill = await prisma.skill.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ data: skill }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error },
        { status: 400 }
      )
    }

    console.error("Error creating skill:", error)
    return NextResponse.json(
      { error: "Failed to create skill" },
      { status: 500 }
    )
  }
}
