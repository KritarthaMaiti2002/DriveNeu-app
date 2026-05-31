import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LMSPage() {
  const s = await getServerSession(authOptions);
  if (!s) redirect("/login");

  const driver = await prisma.driverProfile.findUnique({ where: { userId: s.user.id } });
  if (!driver) return null;

  const courses = await prisma.course.findMany({
    include: {
      modules: { orderBy: { order: "asc" } },
      enrollments: { where: { driverId: driver.id }, include: { progress: true } },
    },
  });

  const totalModules = courses.reduce((s, c) => s + c.modules.length, 0);
  const completedModules = courses.reduce((s, c) => s + (c.enrollments[0]?.progress.filter((p) => p.completed).length ?? 0), 0);
  const globalPct = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 75;
  const completedCourses = courses.filter((c) => c.enrollments[0]?.completedAt).length;
  const hoursLearned = (completedModules * 0.25 + 24).toFixed(1);
  const inProgress = courses.find((c) => c.enrollments[0] && !c.enrollments[0].completedAt);
  const circumference = 2 * Math.PI * 54;
  const strokeDash = circumference - (globalPct / 100) * circumference;
  const categoryIcons: Record<string, string> = { Safety: "security", Service: "volunteer_activism", Finance: "trending_up" };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#f9f9f9", minHeight: "100dvh" }}>
      {/* TopAppBar */}
      <header style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", position: "fixed", top: 0, width: "100%", zIndex: 50, boxShadow: "0 1px 0 rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer" }}>
              <span className="material-symbols-outlined" style={{ color: "#9ca3af" }}>menu</span>
            </button>
            <h1 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 900, fontSize: 20, color: "#755b00" }}>LMS</h1>
          </div>
          <span className="material-symbols-outlined" style={{ color: "#755b00", cursor: "pointer" }}>notifications</span>
        </div>
        <div style={{ height: 1, background: "linear-gradient(to right, #f3f3f3, transparent)" }} />
      </header>

      <main style={{ paddingTop: 96, paddingBottom: 128, paddingLeft: 24, paddingRight: 24, maxWidth: 640, margin: "0 auto" }}>
        {/* Header */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 30, letterSpacing: "-0.02em", color: "#1a1c1c", marginBottom: 8 }}>Learning Hub</h2>
          <p style={{ color: "#5f5e5e", fontWeight: 500 }}>Master your route and maximize earnings.</p>
        </section>

        {/* Progress Card */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 32, display: "flex", flexDirection: "column", gap: 32, border: "1px solid rgba(204,200,188,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
              {/* Progress Ring */}
              <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="128" height="128">
                  <circle cx="64" cy="64" r="54" fill="transparent" stroke="#e8e8e8" strokeWidth="8" />
                  <circle cx="64" cy="64" r="54" fill="transparent" stroke="#f4c63d" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={circumference} strokeDashoffset={strokeDash}
                    style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }} />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 24, color: "#1a1c1c" }}>{globalPct}%</span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1rem", color: "#5f5e5e" }}>Global</span>
                </div>
              </div>

              {/* Stats */}
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1rem", fontWeight: 700, color: "#5f5e5e", display: "block", marginBottom: 4 }}>Courses Completed</span>
                  <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 30, color: "#1a1c1c" }}>{completedCourses || 12}</p>
                </div>
                <div>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1rem", fontWeight: 700, color: "#5f5e5e", display: "block", marginBottom: 4 }}>Hours Learned</span>
                  <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 30, color: "#1a1c1c" }}>{hoursLearned}</p>
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <div style={{ background: "#f3f3f3", borderRadius: 8, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="material-symbols-outlined" style={{ color: "#f4c63d", fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "#4a473d" }}>Top 5% of Partners this month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Continue Learning */}
        {inProgress && (
          <section style={{ marginBottom: 48 }}>
            <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 20, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
              Continue Learning
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f4c63d", display: "inline-block" }} />
            </h3>
            <div style={{ background: "#1a1c1c", borderRadius: 12, overflow: "hidden", boxShadow: "0 16px 40px rgba(0,0,0,0.15)" }}>
              <div style={{ position: "relative", padding: 32, minHeight: 256, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 12px", borderRadius: 999, background: "#f4c63d", color: "#000", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1rem", marginBottom: 16 }}>In Progress</span>
                  <h4 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 24, color: "#fff", marginBottom: 8, lineHeight: 1.3 }}>{inProgress.title}</h4>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 24 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>schedule</span> 15m left
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>layers</span>
                      Module {(inProgress.enrollments[0]?.progress.filter(p => p.completed).length ?? 0) + 1} of {inProgress.modules.length}
                    </span>
                  </div>
                  <button style={{ width: "100%", background: "linear-gradient(135deg, #f4c63d, #eec24b)", color: "#000", fontFamily: "'Manrope', sans-serif", fontWeight: 700, padding: "16px", borderRadius: 999, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 15, boxShadow: "0 8px 24px rgba(244,198,61,0.3)" }}>
                    Resume Lesson <span className="material-symbols-outlined">play_arrow</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Available Modules */}
        <section>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 20 }}>Available Modules</h3>
            <button style={{ fontSize: 14, fontWeight: 700, color: "#755b00", background: "none", border: "none", cursor: "pointer" }}>View All</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {courses.map((course, idx) => {
              const isWide = idx === courses.length - 1 && courses.length % 2 !== 0;
              const totalMins = course.modules.reduce((s, m) => s + m.durationMin, 0);
              const icon = categoryIcons[course.category] ?? "book";
              return (
                <div key={course.id} style={{ gridColumn: isWide ? "span 2" : "span 1", background: "#f3f3f3", borderRadius: 12, padding: 24, cursor: "pointer", display: "flex", flexDirection: isWide ? "row" : "column", alignItems: isWide ? "center" : "flex-start", gap: isWide ? 24 : 0 }}>
                  <div style={{ width: isWide ? 64 : 48, height: isWide ? 64 : 48, borderRadius: isWide ? 16 : 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: isWide ? 0 : 24, flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <span className="material-symbols-outlined" style={{ color: "#f4c63d", fontSize: isWide ? 32 : 24, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 17, marginBottom: 8, color: "#1a1c1c" }}>{course.title}</h4>
                    <p style={{ fontSize: 13, color: "#656464", lineHeight: 1.5, marginBottom: isWide ? 0 : 24 }}>{course.description}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: isWide ? "auto" : "100%" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#5f5e5e", textTransform: "uppercase", letterSpacing: "0.05rem" }}>
                      {totalMins >= 60 ? `${(totalMins / 60).toFixed(1)} Hours` : `${totalMins} Minutes`}
                    </span>
                    <span className="material-symbols-outlined" style={{ color: "#f4c63d" }}>arrow_forward</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
