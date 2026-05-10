import { withApi } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export const GET = withApi({
  handler: async ({ userId }) => {
    const driver = await prisma.driverProfile.findUnique({ where: { userId } });
    if (!driver) return [];
    const courses = await prisma.course.findMany({
      include: {
        modules: { orderBy: { order: "asc" } },
        enrollments: {
          where: { driverId: driver.id },
          include: { progress: true },
        },
      },
    });
    return courses.map((c) => {
      const enr = c.enrollments[0];
      const total = c.modules.length;
      const done = enr?.progress.filter((p) => p.completed).length ?? 0;
      return {
        id: c.id,
        title: c.title,
        description: c.description,
        category: c.category,
        modulesCount: total,
        progressPct: total ? Math.round((done / total) * 100) : 0,
        completed: enr?.completedAt != null,
      };
    });
  },
});
