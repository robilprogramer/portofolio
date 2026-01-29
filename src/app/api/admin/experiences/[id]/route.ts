import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

const updateExperienceSchema = z.object({
  company: z.string().min(1).optional(),
  position: z.string().min(1).optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "FREELANCE", "INTERNSHIP"]).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  isCurrent: z.boolean().optional(),
  technologies: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
  companyLogo: z.string().url().optional().or(z.literal("")),
  order: z.number().optional(),
  isPublished: z.boolean().optional(),
})

interface Params {
  params: Promise<{ id: string }>
}

// GET single experience
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params

    const experience = await prisma.experience.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    if (!experience) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 })
    }

    return NextResponse.json({ data: experience })
  } catch (error) {
    console.error("Error fetching experience:", error)
    return NextResponse.json(
      { error: "Failed to fetch experience" },
      { status: 500 }
    )
  }
}

// PUT update experience
export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateExperienceSchema.parse(body)

    let updateData: Record<string, unknown> = { ...validatedData }

    if (validatedData.startDate) {
      updateData.startDate = new Date(validatedData.startDate)
    }

    if (validatedData.endDate) {
      updateData.endDate = new Date(validatedData.endDate)
    }

    const experience = await prisma.experience.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(experience)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error },
        { status: 400 }
      )
    }

    console.error("Error updating experience:", error)
    return NextResponse.json(
      { error: "Failed to update experience" },
      { status: 500 }
    )
  }
}

// DELETE experience
export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await prisma.experience.delete({ where: { id } })

    return NextResponse.json({ message: "Experience deleted successfully" })
  } catch (error) {
    console.error("Error deleting experience:", error)
    return NextResponse.json(
      { error: "Failed to delete experience" },
      { status: 500 }
    )
  }
}
