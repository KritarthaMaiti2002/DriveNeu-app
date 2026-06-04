import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";
export const dynamic = "force-dynamic";
export default async function DashboardPage() {
  const s = await getServerSession(authOptions);
  if (!s) redirect("/login");
  const driver = await prisma.driverProfile.findUnique({ where: { userId: s.user.id }, include: { wallet: true, user: { select: { name: true } } } });
  if (!driver) return null;
  const todayStart = new Date(); todayStart.setHours(0,0,0,0);
  const todayBookings = await prisma.booking.findMany({ where: { driverId: driver.id, scheduledAt: { gte: todayStart }, status: "COMPLETED" } });
  const upcoming = await prisma.booking.findFirst({ where: { driverId: driver.id, status: "SCHEDULED", scheduledAt: { gte: new Date() } }, orderBy: { scheduledAt: "asc" } });
  const initials = driver.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  return (
    <DashboardClient
      driverName={driver.user.name}
      partnerId={driver.partnerId}
      tier={driver.tier}
      initials={initials}
      balance={driver.wallet?.balance ?? 0}
      todayTrips={todayBookings.length}
      todayEarnings={todayBookings.reduce((s, b) => s + b.fare, 0)}
      streakDays={driver.streakDays}
      status={driver.status}
      nextTime={upcoming ? `Next: ${new Date(upcoming.scheduledAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}` : ""}
      showAlert={(driver.wallet?.balance ?? 0) < 200}
    />
  );
}
