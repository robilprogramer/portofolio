import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

const settingSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
  type: z.string().optional(),
  description: z.string().optional(),
})

// GET all settings or single setting by key
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key")

    if (key) {
      // Get single setting by key
      const setting = await prisma.setting.findUnique({
        where: { key },
      })

      if (!setting) {
        return NextResponse.json({ error: "Setting not found" }, { status: 404 })
      }

      return NextResponse.json(setting)
    }

    // Get all settings
    const settings = await prisma.setting.findMany({
      orderBy: { key: "asc" },
    })

    return NextResponse.json({ data:settings })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

// POST create new setting
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = settingSchema.parse(body)

    // Check if key already exists
    const existingSetting = await prisma.setting.findUnique({
      where: { key: validatedData.key },
    })

    if (existingSetting) {
      return NextResponse.json(
        { error: "Setting with this key already exists" },
        { status: 400 }
      )
    }

    const setting = await prisma.setting.create({
      data: validatedData,
    })

    return NextResponse.json({ data: setting }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error },
        { status: 400 }
      )
    }

    console.error("Error creating setting:", error)
    return NextResponse.json(
      { error: "Failed to create setting" },
      { status: 500 }
    )
  }
}
