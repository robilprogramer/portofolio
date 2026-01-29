import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/public/settings/public
 * Get public site settings
 */
export async function GET(req: Request) {
  try {
    // Define which settings are public
    const publicKeys = [
      'siteName',
      'siteDescription',
      'siteUrl',
      'socialImage',
      'googleAnalytics',
      'theme',
      'primaryColor',
      'secondaryColor',
    ];

    const settings = await prisma.setting.findMany({
      where: {
        key: {
          in: publicKeys,
        },
      },
      select: {
        key: true,
        value: true,
        type: true,
      },
    });

    // Transform array to object
    const settingsObject = settings.reduce<Record<string, any>>((acc, setting) => {
      let value: any = setting.value;

      // Parse value based on type
      if (setting.type === 'number') {
        value = parseFloat(value);
      } else if (setting.type === 'boolean') {
        value = value === 'true';
      } else if (setting.type === 'json') {
        try {
          value = JSON.parse(value);
        } catch {
          // Keep as string if parse fails
        }
      }

      acc[setting.key] = value;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: settingsObject,
    });
  } catch (error) {
    console.error("Error fetching public settings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch public settings" },
      { status: 500 }
    );
  }
}
