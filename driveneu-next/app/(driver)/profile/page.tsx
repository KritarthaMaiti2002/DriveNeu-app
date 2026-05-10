import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const s = await getServerSession(authOptions); if (!s) redirect("/login");
  const u = await prisma.user.findUnique({ where: { id: s.user.id }, include: { driver: true } });
  if (!u) return null;
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold">Profile</h1>
      <div className="rounded-2xl bg-card p-5 shadow-card space-y-2">
        <div className="text-lg font-semibold">{u.name}</div>
        <div className="text-sm text-muted-foreground">{u.email}</div>
        {u.driver && (
          <>
            <div className="text-sm">Partner ID: <b>{u.driver.partnerId}</b></div>
            <div className="text-sm">Tier: <b>{u.driver.tier}</b></div>
            <div className="text-sm">Rating: <b>{u.driver.rating.toFixed(2)}</b></div>
            <div className="text-sm">Vehicle: <b>{u.driver.vehicleNumber ?? "—"}</b></div>
          </>
        )}
      </div>
      <LogoutButton />
    </div>
  );
}
