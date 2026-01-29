// ==================== CERTIFICATES ====================
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

const certificateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  description: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url().optional().or(z.literal("")),
  issueDate: z.string().datetime(),
  expiryDate: z.string().datetime().optional(),
  image: z.string().url().optional().or(z.literal("")),
  order: z.number().optional(),
  isPublished: z.boolean().optional(),
})

// GET all certificates
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get("published")

    const where: Record<string, unknown> = {}

    if (published !== null && published !== undefined) {
      where.isPublished = published === "true"
    }

    const certificates = await prisma.certificate.findMany({
      where,
      orderBy: [{ order: "asc" }, { issueDate: "desc" }],
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    })

    return NextResponse.json({ data: certificates })
  } catch (error) {
    console.error("Error fetching certificates:", error)
    return NextResponse.json(
      { error: "Failed to fetch certificates" },
      { status: 500 }
    )
  }
}

// POST create new certificate
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = certificateSchema.parse(body)

    const certificate = await prisma.certificate.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        issueDate: new Date(validatedData.issueDate),
        expiryDate: validatedData.expiryDate ? new Date(validatedData.expiryDate) : null,
      },
    })

    return NextResponse.json(certificate, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error },
        { status: 400 }
      )
    }

    console.error("Error creating certificate:", error)
    return NextResponse.json(
      { error: "Failed to create certificate" },
      { status: 500 }
    )
  }
}
