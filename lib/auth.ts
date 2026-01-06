import jwt from "jsonwebtoken";
import type { NextRequest, NextResponse } from "next/server";

const TOKEN_EXPIRES_IN_DAYS = 7;

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export function signToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: `${TOKEN_EXPIRES_IN_DAYS}d`,
  });
}

export function setAuthCookie<T extends NextResponse>(
  response: T,
  token: string
): T {
  response.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60,
    path: "/",
  });
  return response;
}

export function clearAuthCookie<T extends NextResponse>(response: T): T {
  response.cookies.set("token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
  return response;
}

export function getUserIdFromRequest(request: NextRequest): string | null {
  // Prefer cookie, but also support Authorization: Bearer
  const tokenFromCookie = request.cookies.get("token")?.value;

  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  const token = tokenFromCookie || bearer;

  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    return payload.userId;
  } catch {
    return null;
  }
}

