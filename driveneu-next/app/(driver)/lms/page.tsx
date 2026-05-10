import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LmsPage() {
  const s = await getServerSession(authOptions); if (!s) redirect("/login");
  const driver = await prisma.driverProfile.findUnique({ where: { userId: s.user.id } });
  if (!driver) return null;
  const courses = await prisma.course.findMany({
    include: { modules: true, enrollments: { where: { driverId: driver.id }, include: { progress: true } } },
  });
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold">Learning</h1>
      {courses.length === 0 && <p className="text-sm text-muted-foreground">No courses available.</p>}
      {courses.map((c) => {
        const total = c.modules.length;
        const done = c.enrollments[0]?.progress.filter((p) => p.completed).length ?? 0;
        const pct = total ? Math.round((done / total) * 100) : 0;
        return (
          <div key={c.id} className="rounded-2xl bg-card p-4 shadow-card">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">{c.category}</div>
            <div className="font-semibold">{c.title}</div>
            <div className="text-xs text-muted-foreground mt-1">{c.description}</div>
            <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
            </div>
            <div className="text-xs mt-1">{done}/{total} modules · {pct}%</div>
          </div>
        );
      })}
    </div>
  );
}
