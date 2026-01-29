import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

const updateCertificateSchema = z.object({
  name: z.string().min(1).optional(),
  issuer: z.string().min(1).optional(),
  description: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url().optional().or(z.literal("")),
  issueDate: z.string().datetime().optional(),
  expiryDate: z.string().datetime().optional(),
  image: z.string().url().optional().or(z.literal("")),
  order: z.number().optional(),
  isPublished: z.boolean().optional(),
})

interface Params {
  params: Promise<{ id: string }>
}

// GET single certificate
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params

    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    })

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    return NextResponse.json({ data: certificate })
  } catch (error) {
    console.error("Error fetching certificate:", error)
    return NextResponse.json(
      { error: "Failed to fetch certificate" },
      { status: 500 }
    )
  }
}

// PUT update certificate
export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateCertificateSchema.parse(body)

    let updateData: Record<string, unknown> = { ...validatedData }

    if (validatedData.issueDate) {
      updateData.issueDate = new Date(validatedData.issueDate)
    }

    if (validatedData.expiryDate) {
      updateData.expiryDate = new Date(validatedData.expiryDate)
    }

    const certificate = await prisma.certificate.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(certificate)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error },
        { status: 400 }
      )
    }

    console.error("Error updating certificate:", error)
    return NextResponse.json(
      { error: "Failed to update certificate" },
      { status: 500 }
    )
  }
}

// DELETE certificate
export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await prisma.certificate.delete({ where: { id } })

    return NextResponse.json({ message: "Certificate deleted successfully" })
  } catch (error) {
    console.error("Error deleting certificate:", error)
    return NextResponse.json(
      { error: "Failed to delete certificate" },
      { status: 500 }
    )
  }
}
