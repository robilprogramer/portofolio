// ==================== TESTIMONIALS ====================
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  position: z.string().min(1, "Position is required"),
  company: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  avatar: z.string().url().optional().or(z.literal("")),
  rating: z.number().min(1).max(5).optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
  isPublished: z.boolean().optional(),
})

// GET all testimonials
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured")
    const published = searchParams.get("published")

    const where: Record<string, unknown> = {}

    if (featured !== null && featured !== undefined) {
      where.featured = featured === "true"
    }

    if (published !== null && published !== undefined) {
      where.isPublished = published === "true"
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    })

    return NextResponse.json({ testimonials })
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    )
  }
}

// POST create new testimonial
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = testimonialSchema.parse(body)

    const testimonial = await prisma.testimonial.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
    })

    return NextResponse.json(testimonial, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error },
        { status: 400 }
      )
    }

    console.error("Error creating testimonial:", error)
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    )
  }
}

// ==================== SOCIAL LINKS ====================
const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Valid URL is required"),
  icon: z.string().optional(),
  order: z.number().optional(),
  isPublished: z.boolean().optional(),
})

// GET all social links (di file terpisah)
export async function GET_SOCIAL(request: Request) {
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

    return NextResponse.json({ socialLinks })
  } catch (error) {
    console.error("Error fetching social links:", error)
    return NextResponse.json(
      { error: "Failed to fetch social links" },
      { status: 500 }
    )
  }
}

// POST create new social link
export async function POST_SOCIAL(request: Request) {
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

    return NextResponse.json(socialLink, { status: 201 })
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

// ==================== MESSAGES ====================
const messageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  subject: z.string().optional(),
  content: z.string().min(1, "Content is required"),
})

// GET all messages
export async function GET_MESSAGES(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const isRead = searchParams.get("isRead")
    const isArchived = searchParams.get("isArchived")
    const isStarred = searchParams.get("isStarred")

    const where: Record<string, unknown> = {}

    if (isRead !== null && isRead !== undefined) {
      where.isRead = isRead === "true"
    }

    if (isArchived !== null && isArchived !== undefined) {
      where.isArchived = isArchived === "true"
    }

    if (isStarred !== null && isStarred !== undefined) {
      where.isStarred = isStarred === "true"
    }

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.message.count({ where }),
    ])

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

// POST create new message (public endpoint for contact form)
export async function POST_MESSAGE(request: Request) {
  try {
    const body = await request.json()
    const validatedData = messageSchema.parse(body)

    const message = await prisma.message.create({
      data: validatedData,
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error },
        { status: 400 }
      )
    }

    console.error("Error creating message:", error)
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    )
  }
}
