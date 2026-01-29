import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { slugify } from "@/lib/utils"

const updateProjectSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
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
  order: z.number().optional(),
})

interface Params {
  params: Promise<{ id: string }>
}

// GET single project
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ data: project })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    )
  }
}

// PUT update project
export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateProjectSchema.parse(body)

    // Check if project exists
    const existingProject = await prisma.project.findUnique({ where: { id } })
    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // If title changed, update slug
    let updateData: Record<string, unknown> = { ...validatedData }
    if (validatedData.title && validatedData.title !== existingProject.title) {
      let newSlug = slugify(validatedData.title)
      const slugExists = await prisma.project.findFirst({
        where: { slug: newSlug, id: { not: id } },
      })
      if (slugExists) {
        newSlug = `${newSlug}-${Date.now()}`
      }
      updateData.slug = newSlug
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(project)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error },
        { status: 400 }
      )
    }

    console.error("Error updating project:", error)
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    )
  }
}

// DELETE project
export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Check if project exists
    const existingProject = await prisma.project.findUnique({ where: { id } })
    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    await prisma.project.delete({ where: { id } })

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    )
  }
}
