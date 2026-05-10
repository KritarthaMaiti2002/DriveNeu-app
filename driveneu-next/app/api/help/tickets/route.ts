import { z } from "zod";
import { withApi } from "@/lib/api";
import { prisma } from "@/lib/prisma";

const Create = z.object({
  subject: z.string().min(3).max(200),
  body: z.string().min(5).max(5000),
  category: z.enum(["earnings", "safety", "account", "other"]),
});

export const GET = withApi({
  handler: async ({ userId }) => {
    const driver = await prisma.driverProfile.findUnique({ where: { userId } });
    if (!driver) return [];
    return prisma.ticket.findMany({ where: { driverId: driver.id }, orderBy: { createdAt: "desc" }, take: 50 });
  },
});

export const POST = withApi({
  schema: Create,
  rateLimit: { limit: 10, windowMs: 60_000 },
  handler: async ({ data, userId }) => {
    const driver = await prisma.driverProfile.findUnique({ where: { userId } });
    if (!driver) throw new Error("No driver");
    return prisma.ticket.create({ data: { ...data, driverId: driver.id } });
  },
});
