export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ ok: false, error: "Password too short" }, { status: 400 });

    const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });

    if (!resetToken) return NextResponse.json({ ok: false, error: "Invalid or expired reset link" }, { status: 400 });
    if (new Date() > resetToken.expires) {
      await prisma.passwordResetToken.delete({ where: { token } });
      return NextResponse.json({ ok: false, error: "Reset link has expired. Please request a new one." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } });
    await prisma.passwordResetToken.delete({ where: { token } });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Reset password error:", e);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}
