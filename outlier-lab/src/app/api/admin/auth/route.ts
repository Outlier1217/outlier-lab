// src/app/api/admin/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET!.toLowerCase();
const JWT_SECRET = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!);

export async function POST(req: NextRequest) {
  const { walletAddress } = await req.json();

  if (!walletAddress) {
    return NextResponse.json({ error: "No wallet address" }, { status: 400 });
  }

  if (walletAddress.toLowerCase() !== ADMIN_WALLET) {
    return NextResponse.json({ error: "Unauthorized wallet" }, { status: 401 });
  }

  // Issue JWT valid for 24h
  const token = await new SignJWT({ wallet: walletAddress, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  return NextResponse.json({ ok: true });
}