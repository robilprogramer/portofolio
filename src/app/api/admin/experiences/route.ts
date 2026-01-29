import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "FREELANCE", "INTERNSHIP"]).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  isCurrent: z.boolean().optional(),
  technologies: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
  companyLogo: z.string().url().optional().or(z.literal("")),
  order: z.number().optional(),
  isPublished: z.boolean().optional(),
})

// GET all experiences
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const type = searchParams.get("type") || ""
    const published = searchParams.get("published")
    const current = searchParams.get("current")

    const where: Record<string, unknown> = {}

    if (type) {
      where.type = type
    }

    if (published !== null && published !== undefined) {
      where.isPublished = published === "true"
    }

    if (current !== null && current !== undefined) {
      where.isCurrent = current === "true"
    }

    const [experiences, total] = await Promise.all([
      prisma.experience.findMany({
        where,
        orderBy: [{ order: "asc" }, { startDate: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.experience.count({ where }),
    ])

    return NextResponse.json({
      data: experiences,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching experiences:", error)
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
      { status: 500 }
    )
  }
}

// POST create new experience
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = experienceSchema.parse(body)

    const experience = await prisma.experience.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        technologies: validatedData.technologies || [],
        achievements: validatedData.achievements || [],
      },
    })

    return NextResponse.json(experience, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error },
        { status: 400 }
      )
    }

    console.error("Error creating experience:", error)
    return NextResponse.json(
      { error: "Failed to create experience" },
      { status: 500 }
    )
  }
}
