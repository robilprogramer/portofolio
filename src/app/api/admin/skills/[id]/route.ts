import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

const updateSkillSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.enum(["FRONTEND", "BACKEND", "DATABASE", "DEVOPS", "MOBILE", "TOOLS", "SOFT_SKILLS", "OTHER"]).optional(),
  level: z.number().min(0).max(100).optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  order: z.number().optional(),
  isPublished: z.boolean().optional(),
})

interface Params {
  params: Promise<{ id: string }>
}

// GET single skill
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params

    const skill = await prisma.skill.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    })

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 })
    }

    return NextResponse.json(skill)
  } catch (error) {
    console.error("Error fetching skill:", error)
    return NextResponse.json(
      { error: "Failed to fetch skill" },
      { status: 500 }
    )
  }
}

// PUT update skill
export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateSkillSchema.parse(body)

    const skill = await prisma.skill.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json({ data: skill })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error },
        { status: 400 }
      )
    }

    console.error("Error updating skill:", error)
    return NextResponse.json(
      { error: "Failed to update skill" },
      { status: 500 }
    )
  }
}

// DELETE skill
export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await prisma.skill.delete({ where: { id } })

    return NextResponse.json({ message: "Skill deleted successfully" })
  } catch (error) {
    console.error("Error deleting skill:", error)
    return NextResponse.json(
      { error: "Failed to delete skill" },
      { status: 500 }
    )
  }
}
