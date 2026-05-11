export const dynamic = "force-dynamic";

import { z } from "zod";
import { withApi } from "@/lib/api";
import { prisma } from "@/lib/prisma";

const Body = z.object({ moduleId: z.string().min(1).max(64) });

export const POST = withApi({
  schema: Body,
  handler: async ({ data, userId }) => {
    const driver = await prisma.driverProfile.findUnique({ where: { userId } });
    if (!driver) throw new Error("No driver");
    const mod = await prisma.module.findUnique({ where: { id: data.moduleId } });
    if (!mod) throw new Error("Module not found");
    const enr = await prisma.enrollment.upsert({
      where: { driverId_courseId: { driverId: driver.id, courseId: mod.courseId } },
      update: {},
      create: { driverId: driver.id, courseId: mod.courseId },
    });
    const prog = await prisma.moduleProgress.upsert({
      where: { enrollmentId_moduleId: { enrollmentId: enr.id, moduleId: mod.id } },
      update: { completed: true, completedAt: new Date() },
      create: { enrollmentId: enr.id, moduleId: mod.id, completed: true, completedAt: new Date() },
    });
    const total = await prisma.module.count({ where: { courseId: mod.courseId } });
    const done = await prisma.moduleProgress.count({ where: { enrollmentId: enr.id, completed: true } });
    if (done >= total) await prisma.enrollment.update({ where: { id: enr.id }, data: { completedAt: new Date() } });
    return { progressPct: Math.round((done / total) * 100), prog };
  },
});
