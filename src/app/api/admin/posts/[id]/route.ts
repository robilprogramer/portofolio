import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { slugify } from "@/lib/utils"

const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1).optional(),
  thumbnail: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  featured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  publishedAt: z.string().datetime().optional(),
  readTime: z.number().optional(),
})

interface Params {
  params: Promise<{ id: string }>
}

// GET single post
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Increment views
    await prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } },
    })

    return NextResponse.json({ data: post })
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    )
  }
}

// PUT update post
export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updatePostSchema.parse(body)

    // Check if post exists
    const existingPost = await prisma.post.findUnique({ where: { id } })
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // If title changed, update slug
    let updateData: Record<string, unknown> = { ...validatedData }
    if (validatedData.title && validatedData.title !== existingPost.title) {
      let newSlug = slugify(validatedData.title)
      const slugExists = await prisma.post.findFirst({
        where: { slug: newSlug, id: { not: id } },
      })
      if (slugExists) {
        newSlug = `${newSlug}-${Date.now()}`
      }
      updateData.slug = newSlug
    }

    if (validatedData.publishedAt) {
      updateData.publishedAt = new Date(validatedData.publishedAt)
    }

    const post = await prisma.post.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(post)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error },
        { status: 400 }
      )
    }

    console.error("Error updating post:", error)
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    )
  }
}

// DELETE post
export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await prisma.post.delete({ where: { id } })

    return NextResponse.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    )
  }
}
