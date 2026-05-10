import { withApi } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export const GET = withApi({
  handler: async ({ userId }) => {
    const driver = await prisma.driverProfile.findUnique({
      where: { userId },
      include: { wallet: { include: { transactions: { orderBy: { createdAt: "desc" }, take: 50 } } } },
    });
    return { balance: driver?.wallet?.balance ?? 0, transactions: driver?.wallet?.transactions ?? [] };
  },
});
