import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Bell, ChevronRight, TrendingUp, AlertTriangle, Calendar, BookOpen, HelpCircle, User } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const s = await getServerSession(authOptions);
  if (!s) redirect("/login");

  const driver = await prisma.driverProfile.findUnique({
    where: { userId: s.user.id },
    include: { wallet: true, user: { select: { name: true } } },
  });
  if (!driver) return null;

  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const todayBookings = await prisma.booking.findMany({
    where: { driverId: driver.id, scheduledAt: { gte: todayStart }, status: "COMPLETED" },
  });
  const todayEarnings = todayBookings.reduce((s, b) => s + b.fare, 0);
  const upcoming = await prisma.booking.findMany({
    where: { driverId: driver.id, status: "SCHEDULED", scheduledAt: { gte: new Date() } },
    orderBy: { scheduledAt: "asc" },
    take: 2,
  });
  const unread = await prisma.notification.count({ where: { driverId: driver.id, read: false } });
  const balance = driver.wallet?.balance ?? 0;
  const firstName = driver.user.name.split(" ")[0];

  const quickLinks = [
    { href: "/bookings", icon: Calendar, label: "Bookings", color: "#FFF3CD", iconColor: "#D4A017" },
    { href: "/updates", icon: Bell, label: "Updates", color: "#FEF3F2", iconColor: "#E74C3C", badge: unread > 0 ? unread : null },
    { href: "/lms", icon: BookOpen, label: "Learning", color: "#F0FDF4", iconColor: "#22C55E" },
    { href: "/help", icon: HelpCircle, label: "Help", color: "#EFF6FF", iconColor: "#3B82F6" },
    { href: "/profile", icon: User, label: "Profile", color: "#FDF4FF", iconColor: "#A855F7" },
  ];

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 13, color: "#9ca3af", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
            {driver.partnerId} · {driver.tier}
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>
            Welcome, {firstName} 👋
          </h1>
        </div>
        <Link href="/updates" style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: "50%", background: "#fff", border: "1px solid #f0ede8", textDecoration: "none" }}>
          <Bell style={{ width: 20, height: 20, color: "#374151" }} />
          {unread > 0 && (
            <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }} />
          )}
        </Link>
      </div>

      {/* Status badge */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f9fafb", border: "1px solid #f0ede8", borderRadius: 20, padding: "6px 14px", marginBottom: 20 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: driver.status === "ONLINE" ? "#22C55E" : "#9ca3af", display: "inline-block" }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{driver.status}</span>
      </div>

      {/* Wallet card */}
      <div style={{
        background: "linear-gradient(135deg, #F5A623 0%, #E8941A 100%)",
        borderRadius: 20,
        padding: "24px 20px",
        marginBottom: 16,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        <div style={{ position: "absolute", bottom: -30, right: 20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.6)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
          Total Wallet Balance
        </p>
        <h2 style={{ fontSize: 40, fontWeight: 800, color: "#1a1a1a", marginBottom: 20, lineHeight: 1 }}>
          ₹{balance.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: "rgba(255,255,255,0.4)", borderRadius: 12, padding: "12px 14px" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.5)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>Streak</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a" }}>{driver.streakDays}d</p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.4)", borderRadius: 12, padding: "12px 14px" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.5)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>Rating</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a" }}>{driver.rating.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Today stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #f0ede8" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Today's Earnings</p>
          <p style={{ fontSize: 26, fontWeight: 800, color: "#D4A017" }}>₹{todayEarnings.toLocaleString("en-IN")}</p>
          <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>{todayBookings.length} trips</p>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #f0ede8" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Upcoming</p>
          <p style={{ fontSize: 26, fontWeight: 800, color: "#111827" }}>{upcoming.length}</p>
          <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
            {upcoming[0] ? `Next: ${new Date(upcoming[0].scheduledAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}` : "None"}
          </p>
        </div>
      </div>

      {/* Low balance warning */}
      {balance < 200 && (
        <div style={{ background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 16, padding: "14px 16px", marginBottom: 24, display: "flex", gap: 12, alignItems: "flex-start" }}>
          <AlertTriangle style={{ width: 20, height: 20, color: "#E53E3E", flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#C53030" }}>Maintain Minimum Balance</p>
            <p style={{ fontSize: 13, color: "#E53E3E", marginTop: 2 }}>Ensure a minimum wallet balance of ₹200 to continue receiving high-priority premium bookings.</p>
          </div>
        </div>
      )}

      {/* Upcoming bookings */}
      {upcoming.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Upcoming</h3>
            <Link href="/bookings" style={{ fontSize: 13, fontWeight: 600, color: "#D4A017", textDecoration: "none" }}>View All</Link>
          </div>
          {upcoming.map((b) => (
            <div key={b.id} style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #f0ede8", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#FFF3CD", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Calendar style={{ width: 16, height: 16, color: "#D4A017" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{b.passenger}</p>
                    <p style={{ fontSize: 12, color: "#9ca3af" }}>{new Date(b.scheduledAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#D4A017" }}>₹{b.fare.toLocaleString("en-IN")}</p>
              </div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                <p>📍 {b.pickup}</p>
                <p style={{ marginTop: 4 }}>🏁 {b.dropoff}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick links */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 14 }}>Quick Access</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href} style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", borderRadius: 16, padding: "16px 12px", border: "1px solid #f0ede8", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, position: "relative" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: link.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <link.icon style={{ width: 20, height: 20, color: link.iconColor }} />
                </div>
                {link.badge && (
                  <span style={{ position: "absolute", top: 10, right: 10, background: "#EF4444", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {link.badge}
                  </span>
                )}
                <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", textAlign: "center" }}>{link.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Check in button */}
      <Link href="/bookings" style={{ textDecoration: "none", display: "block", marginBottom: 8 }}>
        <div style={{ background: "#F5A623", borderRadius: 16, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", letterSpacing: "0.04em" }}>CHECK IN</span>
          <ChevronRight style={{ width: 20, height: 20, color: "#1a1a1a" }} />
        </div>
      </Link>

      {/* Earn more promo */}
      <div style={{ background: "#1a1a2e", borderRadius: 20, padding: "20px", marginTop: 16, marginBottom: 8 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#F5A623", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>PRO TIP</p>
        <h4 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Earn more with Add-On Services</h4>
        <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 14 }}>Provide car cleaning & basic maintenance to increase your payout per trip.</p>
        <Link href="/lms" style={{ display: "inline-block", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, color: "#fff", textDecoration: "none" }}>
          Learn More
        </Link>
      </div>
    </div>
  );
}
