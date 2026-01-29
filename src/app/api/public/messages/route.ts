import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Simple in-memory rate limiter (use Redis in production)
const rateLimitStore = new Map<string, number[]>();

function checkRateLimit(ip: string, limit = 5, windowMs = 3600000): boolean {
  const now = Date.now();
  const userRequests = rateLimitStore.get(ip) || [];

  // Keep only requests within the time window
  const recentRequests = userRequests.filter(timestamp => now - timestamp < windowMs);

  if (recentRequests.length >= limit) {
    return false;
  }

  recentRequests.push(now);
  rateLimitStore.set(ip, recentRequests);

  return true;
}

/**
 * POST /api/public/messages
 * Send a contact message with rate limiting
 */
export async function POST(req: Request) {
  try {
    // Get client IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip")?.trim() ||
      "unknown";

    // Rate limit: 5 messages per hour
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, subject, content } = body;

    // Basic validation
    const errors: Record<string, string> = {};
    if (!name?.trim()) errors.name = "Name is required";
    if (!email?.trim()) errors.email = "Email is required";
    if (!content?.trim()) errors.content = "Message is required";

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) errors.email = "Invalid email format";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors },
        { status: 400 }
      );
    }

    // Create message in DB
    const message = await prisma.message.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject?.trim() || null,
        content: content.trim(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        createdAt: true,
      },
    });

    // TODO: Send email notification to admin if needed

    return NextResponse.json(
      { success: true, message: "Message sent successfully", data: message },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send message" },
      { status: 500 }
    );
  }
}
