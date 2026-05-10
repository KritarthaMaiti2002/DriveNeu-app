import { z } from "zod";
import { withApi } from "@/lib/api";
import { prisma } from "@/lib/prisma";

const Query = z.object({ status: z.enum(["SCHEDULED", "ONGOING", "COMPLETED", "CANCELLED"]).optional() });

export const GET = withApi({
  schema: Query,
  handler: async ({ data, userId }) => {
    const driver = await prisma.driverProfile.findUnique({ where: { userId } });
    if (!driver) return [];
    return prisma.booking.findMany({
      where: { driverId: driver.id, ...(data.status ? { status: data.status } : {}) },
      orderBy: { scheduledAt: "desc" },
      take: 50,
    });
  },
});

const Create = z.object({
  passenger: z.string().min(1).max(120),
  pickup: z.string().min(1).max(255),
  dropoff: z.string().min(1).max(255),
  scheduledAt: z.string().datetime(),
  fare: z.number().min(0).max(1_000_000),
  distanceKm: z.number().min(0).max(10_000),
});

export const POST = withApi({
  schema: Create,
  rateLimit: { limit: 20, windowMs: 60_000 },
  handler: async ({ data, userId }) => {
    const driver = await prisma.driverProfile.findUnique({ where: { userId } });
    if (!driver) throw new Error("No driver profile");
    return prisma.booking.create({
      data: { ...data, scheduledAt: new Date(data.scheduledAt), driverId: driver.id },
    });
  },
});
