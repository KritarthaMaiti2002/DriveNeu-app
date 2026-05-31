import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

function timeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function getIcon(title: string) {
  if (title.toLowerCase().includes("earn") || title.toLowerCase().includes("wallet")) return { icon: "payments", bg: "rgba(251,192,45,0.15)", color: "#fbc02d" };
  if (title.toLowerCase().includes("maintenance") || title.toLowerCase().includes("system")) return { icon: "build", bg: "rgba(160,61,68,0.1)", color: "#a03d44" };
  if (title.toLowerCase().includes("refer") || title.toLowerCase().includes("bonus")) return { icon: "star", bg: "rgba(251,192,45,0.15)", color: "#fbc02d" };
  return { icon: "school", bg: "#f3f3f3", color: "#5f5e5e" };
}

export default async function UpdatesPage() {
  const s = await getServerSession(authOptions);
  if (!s) redirect("/login");
  const driver = await prisma.driverProfile.findUnique({ where: { userId: s.user.id } });
  if (!driver) return null;
  const items = await prisma.notification.findMany({ where: { driverId: driver.id }, orderBy: { createdAt: "desc" }, take: 50 });

  return (
    <div style={{ background: "#f9f9f9", minHeight: "100dvh", paddingBottom: 128 }}>
      <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", boxShadow: "0 1px 0 rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 64, maxWidth: 480, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <span className="material-symbols-outlined" style={{ color: "#fbc02d" }}>arrow_back</span>
            </Link>
            <h1 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 20, color: "#1a1c1c" }}>Updates</h1>
          </div>
          <span className="material-symbols-outlined" style={{ color: "#4a473d", cursor: "pointer" }}>more_vert</span>
        </div>
      </header>

      <main style={{ paddingTop: 80, paddingLeft: 16, paddingRight: 16, maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Featured Banner */}
        <section style={{ position: "relative", background: "#fcc934", borderRadius: 12, padding: 24, overflow: "hidden", boxShadow: "0 8px 24px rgba(252,201,52,0.2)" }}>
          <div style={{ position: "absolute", top: 0, right: -48, width: 192, height: 192, background: "rgba(255,255,255,0.2)", borderRadius: "50%", opacity: 0.3 }} />
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ background: "rgba(0,0,0,0.1)", backdropFilter: "blur(8px)", padding: "4px 12px", borderRadius: 999, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05rem", color: "#1a1a1a" }}>Major Update</span>
              <span style={{ fontSize: 12, color: "rgba(0,0,0,0.5)", fontWeight: 500 }}>Today</span>
            </div>
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 22, color: "#1a1a1a", lineHeight: 1.3 }}>New Earnings Dashboard is Live</h2>
            <p style={{ fontSize: 13, color: "rgba(0,0,0,0.6)", lineHeight: 1.6 }}>Track your performance with real-time heatmaps and personalized goal-setting tools.</p>
            <Link href="/wallet" style={{ display: "inline-block", background: "#1a1a1a", color: "#fcc934", padding: "10px 20px", borderRadius: 999, fontSize: 13, fontWeight: 700, textDecoration: "none", alignSelf: "flex-start" }}>
              Explore New Features
            </Link>
          </div>
        </section>

        {/* Notifications */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05rem", color: "#9ca3af" }}>Recent Notifications</h3>
            <button style={{ fontSize: 13, fontWeight: 700, color: "#fbc02d", background: "none", border: "none", cursor: "pointer" }}>Mark all as read</button>
          </div>
          {items.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 20px", color: "#9ca3af" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 48, display: "block", marginBottom: 12 }}>notifications_none</span>
              <p>You're all caught up!</p>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {items.map((n) => {
              const { icon, bg, color } = getIcon(n.title);
              return (
                <div key={n.id} style={{ background: "#fff", borderRadius: 12, padding: 16, position: "relative", boxShadow: n.read ? "none" : "0 0 0 1.5px rgba(251,192,45,0.4)", border: n.read ? "1px solid #f3f3f3" : "none" }}>
                  {!n.read && <span style={{ position: "absolute", top: 16, right: 16, width: 8, height: 8, borderRadius: "50%", background: "#fcc934" }} />}
                  <div style={{ display: "flex", gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span className="material-symbols-outlined" style={{ color, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                        <h4 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 15, color: "#1a1c1c", paddingRight: 20 }}>{n.title}</h4>
                        <span style={{ fontSize: 11, color: "#9ca3af", whiteSpace: "nowrap" }}>{timeAgo(new Date(n.createdAt))}</span>
                      </div>
                      <p style={{ fontSize: 13, color: "#4a473d", lineHeight: 1.5, marginBottom: 8 }}>{n.body}</p>
                      <button style={{ fontSize: 13, fontWeight: 700, color: "#fbc02d", background: "none", border: "none", cursor: "pointer", padding: 0 }}>View Details ›</button>
                    </div>
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
