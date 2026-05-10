import { withApi } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export const GET = withApi({
  handler: async ({ userId }) => {
    const driver = await prisma.driverProfile.findUnique({
      where: { userId },
      include: { wallet: true, user: { select: { name: true } } },
    });
    if (!driver) return null;

    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const todayBookings = await prisma.booking.findMany({
      where: { driverId: driver.id, scheduledAt: { gte: todayStart }, status: "COMPLETED" },
    });
    const todayEarnings = todayBookings.reduce((s, b) => s + b.fare, 0);
    const next = await prisma.booking.findFirst({
      where: { driverId: driver.id, status: "SCHEDULED", scheduledAt: { gte: new Date() } },
      orderBy: { scheduledAt: "asc" },
    });
    const unread = await prisma.notification.count({ where: { driverId: driver.id, read: false } });

    return {
      name: driver.user.name,
      partnerId: driver.partnerId,
      tier: driver.tier,
      status: driver.status,
      rating: driver.rating,
      streakDays: driver.streakDays,
      walletBalance: driver.wallet?.balance ?? 0,
      todayEarnings,
      todayTrips: todayBookings.length,
      upcoming: next,
      unreadNotifications: unread,
    };
  },
});
