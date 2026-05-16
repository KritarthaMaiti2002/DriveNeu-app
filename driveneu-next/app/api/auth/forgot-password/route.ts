export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ ok: false, error: "Email required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return ok to prevent email enumeration
    if (!user) return NextResponse.json({ ok: true });

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    // Store token in database
    await prisma.passwordResetToken.upsert({
      where: { userId: user.id },
      update: { token, expires },
      create: { userId: user.id, token, expires },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    // Send email
    await resend.emails.send({
      from: "DriveNeu <onboarding@resend.dev>",
      to: email,
      subject: "Reset your DriveNeu password",
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: #F5A623; width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
            <span style="font-size: 24px;">🚗</span>
          </div>
          <h1 style="font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 8px;">Reset your password</h1>
          <p style="font-size: 15px; color: #6b7280; margin-bottom: 24px; line-height: 1.6;">
            Hi ${user.name}, we received a request to reset your DriveNeu password. Click the button below to choose a new password.
          </p>
          <a href="${resetUrl}" style="display: inline-block; background: #F5A623; color: #1a1a1a; font-weight: 800; font-size: 16px; padding: 14px 28px; border-radius: 12px; text-decoration: none; margin-bottom: 24px;">
            Reset Password
          </a>
          <p style="font-size: 13px; color: #9ca3af; margin-bottom: 8px;">This link expires in 1 hour.</p>
          <p style="font-size: 13px; color: #9ca3af;">If you didn't request this, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #f0ede8; margin: 24px 0;" />
          <p style="font-size: 12px; color: #9ca3af;">DriveNeu Partner App</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Forgot password error:", e);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}
