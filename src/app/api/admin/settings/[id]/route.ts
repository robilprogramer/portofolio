import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

const updateSettingSchema = z.object({
  value: z.string().min(1).optional(),
  type: z.string().optional(),
  description: z.string().optional(),
})

interface Params {
  params: Promise<{ id: string }>
}

// GET single setting
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params

    const setting = await prisma.setting.findUnique({
      where: { id },
    })

    if (!setting) {
      return NextResponse.json({ error: "Setting not found" }, { status: 404 })
    }

    return NextResponse.json(setting)
  } catch (error) {
    console.error("Error fetching setting:", error)
    return NextResponse.json(
      { error: "Failed to fetch setting" },
      { status: 500 }
    )
  }
}

// PUT update setting
export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateSettingSchema.parse(body)

    const setting = await prisma.setting.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json({ data: setting })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error },
        { status: 400 }
      )
    }

    console.error("Error updating setting:", error)
    return NextResponse.json(
      { error: "Failed to update setting" },
      { status: 500 }
    )
  }
}

// DELETE setting
export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await prisma.setting.delete({ where: { id } })

    return NextResponse.json({ message: "Setting deleted successfully" })
  } catch (error) {
    console.error("Error deleting setting:", error)
    return NextResponse.json(
      { error: "Failed to delete setting" },
      { status: 500 }
    )
  }
}
