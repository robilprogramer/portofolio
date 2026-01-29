import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/public/profile
 * Get public profile information
 */
export async function GET(req: Request) {
  try {
    const profile = await prisma.profile.findFirst({
      orderBy: {
        updatedAt: 'desc',
      },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, message: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
