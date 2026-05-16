import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ArrowLeft, MoreVertical, DollarSign, Settings, Star, BookOpen } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

function timeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function getNotifStyle(title: string) {
  if (title.toLowerCase().includes("earn") || title.toLowerCase().includes("wallet")) {
    return { bg: "#FFF3CD", icon: DollarSign, color: "#D4A017", iconBg: "#FFF3CD" };
  }
  if (title.toLowerCase().includes("maintenance") || title.toLowerCase().includes("system")) {
    return { bg: "#FEF2F2", icon: Settings, color: "#EF4444", iconBg: "#FEF2F2" };
  }
  if (title.toLowerCase().includes("refer") || title.toLowerCase().includes("bonus")) {
    return { bg: "#FFF3CD", icon: Star, color: "#D4A017", iconBg: "#FFF3CD" };
  }
  return { bg: "#f3f4f6", icon: BookOpen, color: "#6b7280", iconBg: "#f3f4f6" };
}

export default async function UpdatesPage() {
  const s = await getServerSession(authOptions);
  if (!s) redirect("/login");

  const driver = await prisma.driverProfile.findUnique({ where: { userId: s.user.id } });
  if (!driver) return null;

  const items = await prisma.notification.findMany({
    where: { driverId: driver.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "50%", background: "#fff", border: "1px solid #f0ede8", textDecoration: "none" }}>
            <ArrowLeft style={{ width: 18, height: 18, color: "#374151" }} />
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>Updates</h1>
        </div>
        <button style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "50%", background: "transparent", border: "none", cursor: "pointer" }}>
          <MoreVertical style={{ width: 20, height: 20, color: "#374151" }} />
        </button>
      </div>

      {/* Featured banner */}
      <div style={{ background: "#1a1a2e", borderRadius: 20, padding: "20px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: "radial-gradient(circle at 70% 50%, rgba(245,166,35,0.15), transparent 60%)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <span style={{ background: "#F5A623", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 800, color: "#1a1a1a", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Major Update
          </span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Today</span>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8, lineHeight: 1.3 }}>
          New Earnings Dashboard is Live
        </h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>
          Track your performance with real-time heatmaps and personalized goal-setting tools.
        </p>
        <Link href="/wallet" style={{ display: "inline-block", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 700, color: "#fff", textDecoration: "none" }}>
          Explore New Features
        </Link>
      </div>

      {/* Notifications list */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>Recent Notifications</h3>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#D4A017", cursor: "pointer" }}>Mark all as read</span>
        </div>

        {items.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af" }}>
            <p style={{ fontSize: 16 }}>You're all caught up! 🎉</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((n) => {
            const style = getNotifStyle(n.title);
            const IconComp = style.icon;
            return (
              <div key={n.id} style={{
                background: "#fff",
                borderRadius: 16,
                padding: "16px",
                border: `1px solid ${n.read ? "#f0ede8" : "#FDE68A"}`,
                position: "relative",
              }}>
                {!n.read && (
                  <span style={{ position: "absolute", top: 16, right: 16, width: 8, height: 8, borderRadius: "50%", background: "#F5A623" }} />
                )}
                <div style={{ display: "flex", gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: style.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <IconComp style={{ width: 22, height: 22, color: style.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: "#111827", paddingRight: 24 }}>{n.title}</h4>
                      <span style={{ fontSize: 11, color: "#9ca3af", whiteSpace: "nowrap", marginLeft: 8 }}>{timeAgo(new Date(n.createdAt))}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5, marginBottom: 8 }}>{n.body}</p>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#D4A017", cursor: "pointer" }}>View Details ›</span>
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
