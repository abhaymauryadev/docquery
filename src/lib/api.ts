import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  request: NextRequest,
  key: string,
  limit = 5,
  windowMs = 15 * 60 * 1000,
): NextResponse | null {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const storeKey = `${key}:${ip}`;
  const now = Date.now();
  const entry = rateLimitStore.get(storeKey);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(storeKey, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (entry.count >= limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  entry.count += 1;
  return null;
}

export async function getSessionUser() {
  const session = await auth();
  return session?.user ?? null;
}
