"use client";
import { useState } from "react";
import { SideNav } from "@/components/driver/SideNav";
import { AvailableForWorkModal } from "@/components/driver/AvailableForWorkModal";

interface DashboardClientProps {
  driverName: string;
  partnerId: string;
  tier: string;
  initials: string;
  balance: number;
  todayTrips: number;
  todayEarnings: number;
  streakDays: number;
  status: string;
  nextTime: string;
  showAlert: boolean;
}

export function DashboardClient({ driverName, partnerId, tier, initials, balance, todayTrips, todayEarnings, streakDays, status, nextTime, showAlert }: DashboardClientProps) {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#f9f9f9", minHeight: "100dvh" }}>
      {/* SideNav */}
      <SideNav driverName={driverName} partnerId={partnerId} tier={tier} isOpen={sideNavOpen} onClose={() => setSideNavOpen(false)} />

      {/* AvailableForWorkModal */}
      <AvailableForWorkModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={(hours) => { console.log("Available for", hours, "hours"); setModalOpen(false); }} />

      {/* TopAppBar */}
      <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 24px", height: 64, background: "rgba(249,249,249,0.9)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => setSideNavOpen(true)} style={{ width: 40, height: 40, borderRadius: "50%", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="material-symbols-outlined" style={{ color: "#fbc02d" }}>menu</span>
          </button>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 20, color: "#fbc02d" }}>Navigator</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: "#eeeeee", fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.05rem", color: "#4a473d" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: status === "ONLINE" ? "#22C55E" : "#9ca3af", display: "inline-block" }} />
            {status === "ONLINE" ? "On Duty" : "Off Duty"}
          </div>
        </div>
      </header>

      <main style={{ paddingTop: 80, paddingBottom: 160, paddingLeft: 16, paddingRight: 16, maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* ID Card */}
        <a href="/profile" style={{ textDecoration: "none" }}>
          <section style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 8px 24px rgba(26,28,28,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#fbc02d", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 900, fontSize: 18, color: "#1a1a1a" }}>{initials}</span>
              </div>
              <div>
                <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 15, color: "#1a1c1c", marginBottom: 2 }}>Show DriveNeu ID</h2>
                <p style={{ fontSize: 12, color: "#4a473d" }}>{driverName} • {tier}</p>
              </div>
            </div>
            <span className="material-symbols-outlined" style={{ color: "#7a776d" }}>chevron_right</span>
          </section>
        </a>

        {/* Stats Grid */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ gridColumn: "span 2", background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 8px 24px rgba(26,28,28,0.04)", display: "flex", flexDirection: "column", justifyContent: "space-between", height: 128, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -16, top: -16, width: 96, height: 96, background: "rgba(251,192,45,0.1)", borderRadius: "50%", filter: "blur(32px)" }} />
            <div>
              <span style={{ fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.05rem", fontWeight: 700, color: "#9ca3af" }}>Wallet balance</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 30, fontWeight: 800, color: "#1a1c1c" }}>₹{balance.toLocaleString("en-IN")}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#fbc02d" }}>Available</span>
              </div>
            </div>
            <a href="/wallet" style={{ fontSize: 14, fontWeight: 700, color: "#fbc02d", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              Go to Wallet <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
            </a>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 8px 24px rgba(26,28,28,0.04)", display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.05rem", fontWeight: 700, color: "#9ca3af" }}>Todays Bookings</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 28, fontWeight: 800, color: "#1a1c1c" }}>{String(todayTrips).padStart(2, "0")}</span>
            <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#4a473d" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>schedule</span>
              {nextTime || "No upcoming"}
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 8px 24px rgba(26,28,28,0.04)", display: "flex", flexDirection: "column", gap: 8, borderLeft: "4px solid #fbc02d" }}>
            <span style={{ fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.05rem", fontWeight: 700, color: "#9ca3af" }}>Todays Earning</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 28, fontWeight: 800, color: "#1a1c1c" }}>₹{todayEarnings.toLocaleString("en-IN")}</span>
            <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#534600", fontWeight: 700 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>trending_up</span>
              +{streakDays} day streak
            </div>
          </div>
        </section>

        {/* Earn More Banner */}
        <section style={{ position: "relative", background: "#1a1c1c", borderRadius: 12, overflow: "hidden", minHeight: 160, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 24 }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 18, color: "#fff", lineHeight: 1.3, marginBottom: 4 }}>Earn more with Add-On Services</h3>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>Provide car cleaning & basic maintenance to increase your payout per trip.</p>
            <a href="/lms" style={{ display: "inline-block", background: "#fbc02d", color: "#1a1a1a", padding: "6px 16px", borderRadius: 999, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>Learn More</a>
          </div>
        </section>

        {/* Alert */}
        {showAlert && (
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

      {/* CHECK IN Button */}
      <div style={{ position: "fixed", bottom: 88, left: 0, right: 0, padding: "0 24px", zIndex: 40 }}>
        <button onClick={() => setModalOpen(true)} style={{ width: "100%", height: 56, background: "linear-gradient(135deg, #fbc02d, #fcc934)", color: "#1a1a1a", border: "none", borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", boxShadow: "0 8px 24px rgba(252,201,52,0.3)", cursor: "pointer", fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: "0.1rem", textTransform: "uppercase" as const }}>
          CHECK IN
          <div style={{ display: "flex", gap: 2 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, opacity: 0.4 }}>chevron_right</span>
            <span className="material-symbols-outlined" style={{ fontSize: 18, opacity: 0.7 }}>chevron_right</span>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
          </div>
        </button>
      </div>

      {/* Bottom Nav */}
      <nav style={{ position: "fixed", bottom: 0, left: 0, width: "100%", zIndex: 50, display: "flex", justifyContent: "space-around", alignItems: "center", padding: "8px 16px 12px", height: 80, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", boxShadow: "0 -8px 24px rgba(26,28,28,0.06)", borderTop: "1px solid rgba(204,200,188,0.15)" }}>
        {[
          { href: "/dashboard", icon: "home", label: "Home", active: true },
          { href: "/bookings", icon: "calendar_month", label: "Bookings", active: false },
          { href: "/updates", icon: "notifications", label: "Updates", active: false },
          { href: "/lms", icon: "school", label: "Learning", active: false },
          { href: "/profile", icon: "person", label: "Profile", active: false },
        ].map((item) => (
          <a key={item.href} href={item.href} style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 12px", borderRadius: 12, background: item.active ? "rgba(251,192,45,0.15)" : "transparent" }}>
            <span className="material-symbols-outlined" style={{ color: item.active ? "#fbc02d" : "#9ca3af", fontSize: 24, fontVariationSettings: item.active ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
            <span style={{ fontSize: 10, fontWeight: item.active ? 700 : 500, textTransform: "uppercase" as const, letterSpacing: "0.05rem", color: item.active ? "#fbc02d" : "#9ca3af" }}>{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
