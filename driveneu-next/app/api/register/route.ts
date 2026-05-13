export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8).max(100),
});

function generatePartnerId() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `DRV-${year}-${random}`;
}

function generateId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = RegisterSchema.parse(body);

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ ok: false, error: "Email already registered" }, { status: 400 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Create user, driver profile and wallet in one transaction
    const userId = generateId("usr");
    const driverId = generateId("drv");
    const walletId = generateId("wal");

    await prisma.$transaction([
      prisma.user.create({
        data: {
          id: userId,
          email: data.email,
          name: data.name,
          phone: data.phone || null,
          passwordHash,
          role: "DRIVER",
        },
      }),
      prisma.driverProfile.create({
        data: {
          id: driverId,
          userId,
          partnerId: generatePartnerId(),
          tier: "Silver Partner",
          status: "OFFLINE",
          rating: 5.0,
          streakDays: 0,
        },
      }),
      prisma.wallet.create({
        data: {
          id: walletId,
          driverId,
          balance: 0,
        },
      }),
    ]);

    return NextResponse.json({ ok: true, message: "Account created successfully" });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: "Invalid input", issues: e.issues }, { status: 422 });
    }
    console.error("Registration error:", e);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}
