import { z } from "zod";
import { withApi } from "@/lib/api";
import { prisma } from "@/lib/prisma";

const Q = z.object({ q: z.string().max(120).optional(), category: z.string().max(40).optional() });

export const GET = withApi({
  auth: false,
  schema: Q,
  handler: async ({ data }) => {
    return prisma.fAQ.findMany({
      where: {
        ...(data.category ? { category: data.category } : {}),
        ...(data.q ? { OR: [{ question: { contains: data.q, mode: "insensitive" } }, { answer: { contains: data.q, mode: "insensitive" } }] } : {}),
      },
      take: 50,
    });
  },
});
