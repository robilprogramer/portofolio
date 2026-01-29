import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

const updateEducationSchema = z.object({
  institution: z.string().min(1).optional(),
  degree: z.string().min(1).optional(),
  field: z.string().min(1).optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  gpa: z.number().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  isCurrent: z.boolean().optional(),
  achievements: z.array(z.string()).optional(),
  logo: z.string().url().optional().or(z.literal("")),
  order: z.number().optional(),
  isPublished: z.boolean().optional(),
})

interface Params {
  params: Promise<{ id: string }>
}

// GET single education
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params

    const education = await prisma.education.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    if (!education) {
      return NextResponse.json({ error: "Education not found" }, { status: 404 })
    }

    return NextResponse.json({ data: education })
  } catch (error) {
    console.error("Error fetching education:", error)
    return NextResponse.json(
      { error: "Failed to fetch education" },
      { status: 500 }
    )
  }
}

// PUT update education
export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateEducationSchema.parse(body)

    let updateData: Record<string, unknown> = { ...validatedData }

    if (validatedData.startDate) {
      updateData.startDate = new Date(validatedData.startDate)
    }

    if (validatedData.endDate) {
      updateData.endDate = new Date(validatedData.endDate)
    }

    const education = await prisma.education.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(education)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error },
        { status: 400 }
      )
    }

    console.error("Error updating education:", error)
    return NextResponse.json(
      { error: "Failed to update education" },
      { status: 500 }
    )
  }
}

// DELETE education
export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await prisma.education.delete({ where: { id } })

    return NextResponse.json({ message: "Education deleted successfully" })
  } catch (error) {
    console.error("Error deleting education:", error)
    return NextResponse.json(
      { error: "Failed to delete education" },
      { status: 500 }
    )
  }
}
