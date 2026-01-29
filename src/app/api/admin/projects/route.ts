import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { slugify } from "@/lib/utils"

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  shortDesc: z.string().optional(),
  thumbnail: z.string().url().optional().or(z.literal("")),
  images: z.array(z.string()).optional(),
  liveUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  techStack: z.array(z.string()).optional(),
  category: z.string().optional(),
  featured: z.boolean().optional(),
  status: z.enum(["IN_PROGRESS", "COMPLETED", "ON_HOLD", "ARCHIVED"]).optional(),
  isPublished: z.boolean().optional(),
})

// GET all projects
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const status = searchParams.get("status") || ""
    const featured = searchParams.get("featured")
    const published = searchParams.get("published")

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    if (category) {
      where.category = category
    }

    if (status) {
      where.status = status
    }

    if (featured !== null && featured !== undefined) {
      where.featured = featured === "true"
    }

    if (published !== null && published !== undefined) {
      where.isPublished = published === "true"
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.project.count({ where }),
    ])

    return NextResponse.json({
     data: projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    )
  }
}

// POST create new project
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = projectSchema.parse(body)

    // Generate unique slug
    let slug = slugify(validatedData.title)
    const existingProject = await prisma.project.findUnique({ where: { slug } })
    if (existingProject) {
      slug = `${slug}-${Date.now()}`
    }

    const project = await prisma.project.create({
      data: {
        ...validatedData,
        slug,
        userId: session.user.id,
        images: validatedData.images || [],
        techStack: validatedData.techStack || [],
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error },
        { status: 400 }
      )
    }

    console.error("Error creating project:", error)
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    )
  }
}
