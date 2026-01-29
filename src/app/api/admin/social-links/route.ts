import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Valid URL is required"),
  icon: z.string().optional(),
  order: z.number().optional(),
  isPublished: z.boolean().optional(),
})

// GET all social links
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get("published")

    const where: Record<string, unknown> = {}

    if (published !== null && published !== undefined) {
      where.isPublished = published === "true"
    }

    const socialLinks = await prisma.socialLink.findMany({
      where,
      orderBy: [{ order: "asc" }],
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    })

    return NextResponse.json({ data: socialLinks })
  } catch (error) {
    console.error("Error fetching social links:", error)
    return NextResponse.json(
      { error: "Failed to fetch social links" },
      { status: 500 }
    )
  }
}

// POST create new social link
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = socialLinkSchema.parse(body)

    const socialLink = await prisma.socialLink.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ data: socialLink }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error },
        { status: 400 }
      )
    }

    console.error("Error creating social link:", error)
    return NextResponse.json(
      { error: "Failed to create social link" },
      { status: 500 }
    )
  }
}
