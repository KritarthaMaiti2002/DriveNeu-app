export const dynamic = "force-dynamic";

import { withApi } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export const GET = withApi({
  handler: async ({ userId }) => {
    const driver = await prisma.driverProfile.findUnique({ where: { userId } });
    if (!driver) return [];
    return prisma.notification.findMany({ where: { driverId: driver.id }, orderBy: { createdAt: "desc" }, take: 50 });
  },
});
