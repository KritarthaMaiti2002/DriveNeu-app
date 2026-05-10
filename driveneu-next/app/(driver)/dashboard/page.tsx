import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DriverHeader } from "@/components/driver/DriverHeader";
import { StatCard } from "@/components/driver/StatCard";
import { NavCard } from "@/components/driver/NavCard";
import { UpcomingBooking } from "@/components/driver/UpcomingBooking";
import { Bell, GraduationCap, Wallet, HelpCircle, Gift, Plane, Ticket } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const driver = await prisma.driverProfile.findUnique({
    where: { userId: session.user.id },
    include: { wallet: true, user: true },
  });
  if (!driver) return <p>No driver profile.</p>;

  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const todayBookings = await prisma.booking.findMany({
    where: { driverId: driver.id, scheduledAt: { gte: todayStart }, status: "COMPLETED" },
  });
  const upcoming = await prisma.booking.findFirst({
    where: { driverId: driver.id, status: "SCHEDULED", scheduledAt: { gte: new Date() } },
    orderBy: { scheduledAt: "asc" },
  });
  const unread = await prisma.notification.count({ where: { driverId: driver.id, read: false } });
  const todayEarnings = todayBookings.reduce((s, b) => s + b.fare, 0);

  return (
    <div className="space-y-6">
      <DriverHeader name={driver.user.name} partnerId={driver.partnerId} tier={driver.tier} status={driver.status} />

      <section className="rounded-3xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground p-6 shadow-glow">
        <div className="text-[11px] font-bold tracking-widest opacity-70">WALLET BALANCE</div>
        <div className="font-display text-4xl font-bold mt-1">{formatINR(driver.wallet?.balance ?? 0)}</div>
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="rounded-xl bg-white/10 p-3"><div className="text-[10px] opacity-70 font-bold">STREAK</div><div className="text-xl font-bold">{driver.streakDays}d</div></div>
          <div className="rounded-xl bg-white/10 p-3"><div className="text-[10px] opacity-70 font-bold">RATING</div><div className="text-xl font-bold">{driver.rating.toFixed(2)}</div></div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <StatCard label="Today's Earnings" value={formatINR(todayEarnings)} hint={`${todayBookings.length} trips`} />
        <StatCard label="Upcoming" value={String(upcoming ? 1 : 0)} hint={upcoming ? new Date(upcoming.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "None"} />
      </section>

      <UpcomingBooking b={upcoming} />

      <section>
        <h2 className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase mb-3">Quick Access</h2>
        <div className="grid grid-cols-3 gap-3">
          <NavCard href="/lms" label="Learning" icon={<GraduationCap className="h-5 w-5" />} />
          <NavCard href="/wallet" label="Wallet" icon={<Wallet className="h-5 w-5" />} />
          <NavCard href="/help" label="Help" icon={<HelpCircle className="h-5 w-5" />} />
          <NavCard href="/updates" label="Updates" icon={<Bell className="h-5 w-5" />} badge={unread || undefined} />
          <NavCard href="/profile" label="Refer" icon={<Gift className="h-5 w-5" />} />
          <NavCard href="/profile" label="Vacation" icon={<Plane className="h-5 w-5" />} />
        </div>
      </section>
    </div>
  );
}
