import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

const updateSocialLinkSchema = z.object({
  platform: z.string().min(1).optional(),
  url: z.string().url().optional(),
  icon: z.string().optional(),
  order: z.number().optional(),
  isPublished: z.boolean().optional(),
})

interface Params {
  params: Promise<{ id: string }>
}

// GET single social link
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params

    const socialLink = await prisma.socialLink.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    })

    if (!socialLink) {
      return NextResponse.json({ error: "Social link not found" }, { status: 404 })
    }

    return NextResponse.json(socialLink)
  } catch (error) {
    console.error("Error fetching social link:", error)
    return NextResponse.json(
      { error: "Failed to fetch social link" },
      { status: 500 }
    )
  }
}

// PUT update social link
export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateSocialLinkSchema.parse(body)

    const socialLink = await prisma.socialLink.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json({ data: socialLink })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error },
        { status: 400 }
      )
    }

    console.error("Error updating social link:", error)
    return NextResponse.json(
      { error: "Failed to update social link" },
      { status: 500 }
    )
  }
}

// DELETE social link
export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await prisma.socialLink.delete({ where: { id } })

    return NextResponse.json({ message: "Social link deleted successfully" })
  } catch (error) {
    console.error("Error deleting social link:", error)
    return NextResponse.json(
      { error: "Failed to delete social link" },
      { status: 500 }
    )
  }
}
