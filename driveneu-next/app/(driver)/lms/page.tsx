import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Bell, ChevronRight, Clock, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LMSPage() {
  const s = await getServerSession(authOptions);
  if (!s) redirect("/login");

  const driver = await prisma.driverProfile.findUnique({ where: { userId: s.user.id } });
  if (!driver) return null;

  const courses = await prisma.course.findMany({
    include: {
      modules: { orderBy: { order: "asc" } },
      enrollments: {
        where: { driverId: driver.id },
        include: { progress: true },
      },
    },
  });

  const totalModules = courses.reduce((s, c) => s + c.modules.length, 0);
  const completedModules = courses.reduce((s, c) => {
    const enr = c.enrollments[0];
    return s + (enr?.progress.filter((p) => p.completed).length ?? 0);
  }, 0);
  const globalPct = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
  const completedCourses = courses.filter((c) => c.enrollments[0]?.completedAt).length;

  const inProgress = courses.find((c) => {
    const enr = c.enrollments[0];
    return enr && !enr.completedAt;
  });

  const categoryIcons: Record<string, string> = {
    Safety: "🛡️",
    Service: "⭐",
    Finance: "📈",
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDash = circumference - (globalPct / 100) * circumference;

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#D4A017", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>LMS</p>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>Learning Hub</h1>
          <p style={{ fontSize: 14, color: "#9ca3af", marginTop: 4 }}>Master your route and maximize earnings.</p>
        </div>
        <Link href="/updates" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: "50%", background: "#fff", border: "1px solid #f0ede8", textDecoration: "none" }}>
          <Bell style={{ width: 20, height: 20, color: "#374151" }} />
        </Link>
      </div>

      {/* Progress card */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #f0ede8", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{ position: "relative", width: 120, height: 120 }}>
            <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="60" cy="60" r="45" fill="none" stroke="#f3f4f6" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="45" fill="none"
                stroke="#F5A623" strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDash}
                strokeLinecap="round"
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>{globalPct}%</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" }}>Global</span>
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Courses Completed</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>{completedCourses}</p>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Hours Learned</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>
              {(completedModules * 0.25).toFixed(1)}
            </p>
          </div>
        </div>
        <div style={{ background: "#f9fafb", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🏆</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Top 5% of Partners this month</span>
        </div>
      </div>

      {/* Continue learning */}
      {inProgress && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Continue Learning</h2>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#F5A623", display: "inline-block" }} />
          </div>
          <div style={{ background: "#1a1a2e", borderRadius: 20, padding: "20px", overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: "linear-gradient(135deg, rgba(245,166,35,0.1) 0%, transparent 60%)" }} />
            <span style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
              In Progress
            </span>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 12, lineHeight: 1.3 }}>
              {inProgress.title}
            </h3>
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                <Clock style={{ width: 14, height: 14 }} />
                15m left
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                <BookOpen style={{ width: 14, height: 14 }} />
                Module {(inProgress.enrollments[0]?.progress.filter(p => p.completed).length ?? 0) + 1} of {inProgress.modules.length}
              </span>
            </div>
            <Link href="/lms" style={{ display: "block", background: "#F5A623", borderRadius: 12, padding: "14px", textAlign: "center", fontSize: 15, fontWeight: 800, color: "#1a1a1a", textDecoration: "none" }}>
              Resume Lesson ▶
            </Link>
          </div>
        </div>
      )}

      {/* Available modules */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Available Modules</h2>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#D4A017" }}>View All</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {courses.map((course) => {
            const enr = course.enrollments[0];
            const done = enr?.progress.filter((p) => p.completed).length ?? 0;
            const total = course.modules.length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            const totalMins = course.modules.reduce((s, m) => s + m.durationMin, 0);
            const isCompleted = enr?.completedAt != null;

            return (
              <div key={course.id} style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #f0ede8" }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "#FFF3CD", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>
                    {categoryIcons[course.category] ?? "📚"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{course.title}</h4>
                    <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 10, lineHeight: 1.5 }}>{course.description}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        {totalMins >= 60 ? `${(totalMins / 60).toFixed(1)} Hours` : `${totalMins} Minutes`}
                        {course.category === "Finance" && " • ADVANCED"}
                      </span>
                      {isCompleted ? (
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#22C55E" }}>✓ Completed</span>
                      ) : (
                        <ChevronRight style={{ width: 18, height: 18, color: "#D4A017" }} />
                      )}
                    </div>
                    {!isCompleted && pct > 0 && (
                      <div style={{ marginTop: 10 }}>
                        <div style={{ height: 4, background: "#f3f4f6", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: "#F5A623", borderRadius: 2 }} />
                        </div>
                        <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>{pct}% complete</p>
                      </div>
                    )}
                    {!isCompleted && pct === 0 && (
                      <div style={{ marginTop: 10, background: "#f9fafb", borderRadius: 10, padding: "10px 14px", textAlign: "center" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Start Course</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
