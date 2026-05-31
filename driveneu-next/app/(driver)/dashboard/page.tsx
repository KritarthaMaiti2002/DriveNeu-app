import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

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
  const upcoming = await prisma.booking.findFirst({
    where: { driverId: driver.id, status: "SCHEDULED", scheduledAt: { gte: new Date() } },
    orderBy: { scheduledAt: "asc" },
  });
  const unread = await prisma.notification.count({ where: { driverId: driver.id, read: false } });
  const balance = driver.wallet?.balance ?? 0;
  const initials = driver.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#f9f9f9", minHeight: "100dvh" }}>

      {/* TopAppBar */}
      <header style={{
        position: "fixed", top: 0, width: "100%", zIndex: 50,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 24px", height: 64,
        background: "rgba(249,249,249,0.9)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button style={{ width: 40, height: 40, borderRadius: "50%", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="material-symbols-outlined" style={{ color: "#fbc02d" }}>menu</span>
          </button>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 20, color: "#fbc02d" }}>Navigator</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: "#eeeeee", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05rem", color: "#4a473d" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: driver.status === "ONLINE" ? "#22C55E" : "#9ca3af", display: "inline-block" }} />
            {driver.status === "ONLINE" ? "On Duty" : "Off Duty"}
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14, color: "#fbc02d" }}>
            EN <span className="material-symbols-outlined" style={{ fontSize: 14 }}>language</span>
          </button>
        </div>
      </header>

      <main style={{ paddingTop: 80, paddingBottom: 160, paddingLeft: 16, paddingRight: 16, maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* ID Card Section */}
        <Link href="/profile" style={{ textDecoration: "none" }}>
          <section style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 8px 24px rgba(26,28,28,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#fbc02d", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 900, fontSize: 18, color: "#1a1a1a" }}>{initials}</span>
              </div>
              <div>
                <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 15, color: "#1a1c1c", marginBottom: 2 }}>Show DriveNeu ID</h2>
                <p style={{ fontSize: 12, color: "#4a473d" }}>{driver.user.name} • {driver.tier}</p>
              </div>
            </div>
            <span className="material-symbols-outlined" style={{ color: "#7a776d" }}>chevron_right</span>
          </section>
        </Link>

        {/* Stats Bento Grid */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Wallet Balance - Full Width */}
          <div style={{ gridColumn: "span 2", background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 8px 24px rgba(26,28,28,0.04)", display: "flex", flexDirection: "column", justifyContent: "space-between", height: 128, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -16, top: -16, width: 96, height: 96, background: "rgba(251,192,45,0.1)", borderRadius: "50%", filter: "blur(32px)" }} />
            <div>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05rem", fontWeight: 700, color: "#9ca3af" }}>Wallet balance</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 30, fontWeight: 800, color: "#1a1c1c" }}>₹{balance.toLocaleString("en-IN")}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#fbc02d" }}>Available</span>
              </div>
            </div>
            <Link href="/wallet" style={{ fontSize: 14, fontWeight: 700, color: "#fbc02d", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              Go to Wallet <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
            </Link>
          </div>

          {/* Today's Bookings */}
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 8px 24px rgba(26,28,28,0.04)", display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05rem", fontWeight: 700, color: "#9ca3af" }}>Todays Bookings</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 28, fontWeight: 800, color: "#1a1c1c" }}>{String(todayBookings.length).padStart(2, "0")}</span>
            <div style={{ marginTop: "auto", paddingTop: 8, display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#4a473d" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>schedule</span>
              {upcoming ? `Next: ${new Date(upcoming.scheduledAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}` : "No upcoming"}
            </div>
          </div>

          {/* Today's Earnings */}
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 8px 24px rgba(26,28,28,0.04)", display: "flex", flexDirection: "column", gap: 8, borderLeft: "4px solid #fbc02d" }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05rem", fontWeight: 700, color: "#9ca3af" }}>Todays Earning</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 28, fontWeight: 800, color: "#1a1c1c" }}>₹{todayEarnings.toLocaleString("en-IN")}</span>
            <div style={{ marginTop: "auto", paddingTop: 8, display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#534600", fontWeight: 700 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>trending_up</span>
              +{driver.streakDays} day streak
            </div>
          </div>
        </section>

        {/* Earn More Banner */}
        <section style={{ position: "relative", background: "#1a1c1c", borderRadius: 12, overflow: "hidden", minHeight: 160, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 24 }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 18, color: "#fff", lineHeight: 1.3, marginBottom: 4 }}>Earn more with Add-On Services</h3>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>Provide car cleaning & basic maintenance to increase your payout per trip.</p>
            <Link href="/lms" style={{ display: "inline-block", background: "#fbc02d", color: "#1a1a1a", padding: "6px 16px", borderRadius: 999, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
              Learn More
            </Link>
          </div>
        </section>

        {/* Alert Card */}
        {balance < 200 && (
          <section style={{ background: "rgba(160,61,68,0.08)", borderRadius: 12, padding: 16, display: "flex", gap: 16, alignItems: "flex-start", border: "1px solid rgba(160,61,68,0.15)" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(160,61,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ color: "#a03d44" }}>warning</span>
            </div>
            <div>
              <h4 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 14, color: "#1a1c1c", marginBottom: 4 }}>Maintain Minimum Balance</h4>
              <p style={{ fontSize: 12, color: "#4a473d", lineHeight: 1.6 }}>Ensure a minimum wallet balance of ₹200 to continue receiving high-priority premium bookings.</p>
            </div>
          </section>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, width: "100%", zIndex: 50,
        display: "flex", justifyContent: "space-around", alignItems: "center",
        padding: "8px 16px 12px", height: 80,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        boxShadow: "0 -8px 24px rgba(26,28,28,0.06)",
        borderTop: "1px solid rgba(204,200,188,0.15)",
      }}>
        {[
          { href: "/dashboard", icon: "home", label: "Home", active: true },
          { href: "/wallet", icon: "account_balance_wallet", label: "Wallet", active: false },
          { href: "/bookings", icon: "calendar_month", label: "Bookings", active: false },
          { href: "/profile", icon: "person", label: "Account", active: false },
        ].map((item) => (
          <Link key={item.href} href={item.href} style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 12px", borderRadius: 12, background: item.active ? "rgba(251,192,45,0.15)" : "transparent" }}>
            <span className="material-symbols-outlined" style={{ color: item.active ? "#fbc02d" : "#9ca3af", fontSize: 24, fontVariationSettings: item.active ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
            <span style={{ fontSize: 10, fontWeight: item.active ? 700 : 500, textTransform: "uppercase", letterSpacing: "0.05rem", color: item.active ? "#fbc02d" : "#9ca3af" }}>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* CHECK IN FAB */}
      <div style={{ position: "fixed", bottom: 88, left: 0, right: 0, padding: "0 24px", zIndex: 40 }}>
        <button style={{
          width: "100%", height: 56,
          background: "linear-gradient(135deg, #fbc02d, #fcc934)",
          color: "#1a1a1a", border: "none", borderRadius: 999,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 32px",
          boxShadow: "0 8px 24px rgba(252,201,52,0.3)",
          cursor: "pointer",
          fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 15,
          letterSpacing: "0.1rem", textTransform: "uppercase",
        }}>
          CHECK IN
          <div style={{ display: "flex", gap: 2 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, opacity: 0.4 }}>chevron_right</span>
            <span className="material-symbols-outlined" style={{ fontSize: 18, opacity: 0.7 }}>chevron_right</span>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
          </div>
        </button>
      </div>
    </div>
  );
}
