import { withApi } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export const GET = withApi({
  handler: async ({ userId }) => {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, driver: true },
    });
  },
});
