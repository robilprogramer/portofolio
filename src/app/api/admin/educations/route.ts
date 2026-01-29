import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().min(1, "Field is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  gpa: z.number().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  isCurrent: z.boolean().optional(),
  achievements: z.array(z.string()).optional(),
  logo: z.string().url().optional().or(z.literal("")),
  order: z.number().optional(),
  isPublished: z.boolean().optional(),
})

// GET all education
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const published = searchParams.get("published")
    const current = searchParams.get("current")

    const where: Record<string, unknown> = {}

    if (published !== null && published !== undefined) {
      where.isPublished = published === "true"
    }

    if (current !== null && current !== undefined) {
      where.isCurrent = current === "true"
    }

    const [educations, total] = await Promise.all([
      prisma.education.findMany({
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
      prisma.education.count({ where }),
    ])

    return NextResponse.json({
      data:educations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching educations:", error)
    return NextResponse.json(
      { error: "Failed to fetch educations" },
      { status: 500 }
    )
  }
}

// POST create new education
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = educationSchema.parse(body)

    const education = await prisma.education.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        achievements: validatedData.achievements || [],
      },
    })

    return NextResponse.json(education, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error },
        { status: 400 }
      )
    }

    console.error("Error creating education:", error)
    return NextResponse.json(
      { error: "Failed to create education" },
      { status: 500 }
    )
  }
}
