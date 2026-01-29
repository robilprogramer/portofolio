import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/public/certificates
 * Get all published certificates
 */
export async function GET(req: Request) {
  try {
    const certificates = await prisma.certificate.findMany({
      where: {
        isPublished: true,
      },
      select: {
        id: true,
        name: true,
        issuer: true,
        description: true,
        credentialId: true,
        credentialUrl: true,
        issueDate: true,
        expiryDate: true,
        image: true,
        order: true,
      },
      orderBy: [
        { order: 'asc' },
        { issueDate: 'desc' },
      ],
    });

    return NextResponse.json({
      success: true,
      data: certificates,
    });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch certificates",
    }, { status: 500 });
  }
}
