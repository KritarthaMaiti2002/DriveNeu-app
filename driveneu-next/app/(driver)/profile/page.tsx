import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
export const dynamic = "force-dynamic";
export default async function ProfilePage() {
  const s = await getServerSession(authOptions);
  if (!s) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: s.user.id }, include: { driver: true } });
  if (!user || !user.driver) return null;
  const driver = user.driver;
  const initials = user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  const sections = [
    { title: "Account", items: [
      { icon: "person", label: "Personal Information", sub: "Name, email, phone" },
      { icon: "badge", label: "Your ID Card", sub: `ID: ${driver.partnerId}` },
      { icon: "lock", label: "Security", sub: "Password, 2FA", href: "/forgot-password" },
    ]},
    { title: "Performance", items: [
      { icon: "star", label: "My Ratings", sub: `${driver.rating.toFixed(2)} average rating` },
      { icon: "trending_up", label: "Performance Stats", sub: `${driver.streakDays} day streak` },
    ]},
    { title: "Support", items: [
      { icon: "help", label: "Help & Support", sub: "FAQs, contact us", href: "/help" },
    ]},
  ];
  return (
    <div style={{ background: "#f9f9f9", minHeight: "100dvh", paddingBottom: 128 }}>
      <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(24px)", boxShadow: "0 1px 0 rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 64, maxWidth: 480, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 20, color: "#1a1c1c" }}>Profile</h1>
          <span className="material-symbols-outlined" style={{ color: "#4a473d", cursor: "pointer" }}>settings</span>
        </div>
      </header>
      <main style={{ paddingTop: 80, paddingLeft: 16, paddingRight: 16, maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ background: "#fff", borderRadius: 14, padding: "20px", boxShadow: "0 4px 16px rgba(26,28,28,0.04)", display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #fbc02d, #fcc934)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 900, fontSize: 24, color: "#1a1a1a" }}>{initials}</span>
            </div>
            <div style={{ position: "absolute", bottom: 2, right: 2, width: 14, height: 14, borderRadius: "50%", background: "#22C55E", border: "2.5px solid #fff" }} />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 18, color: "#1a1c1c", marginBottom: 4 }}>{user.name}</h2>
            <p style={{ fontSize: 13, color: "#fbc02d", fontWeight: 700, marginBottom: 2 }}>{driver.tier}</p>
            <p style={{ fontSize: 12, color: "#9ca3af" }}>ID: {driver.partnerId}</p>
          </div>
          <span className="material-symbols-outlined" style={{ color: "#9ca3af" }}>chevron_right</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[{ label: "Rating", value: driver.rating.toFixed(1), color: "#fbc02d" }, { label: "Day Streak", value: String(driver.streakDays), color: "#1a1c1c" }, { label: "Status", value: driver.status === "ONLINE" ? "ON" : "OFF", color: driver.status === "ONLINE" ? "#22C55E" : "#9ca3af" }].map((stat) => (
            <div key={stat.label} style={{ background: "#fff", borderRadius: 12, padding: "14px 10px", boxShadow: "0 2px 8px rgba(26,28,28,0.04)", textAlign: "center" }}>
              <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 22, fontWeight: 900, color: stat.color, marginBottom: 4 }}>{stat.value}</p>
              <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05rem" }}>{stat.label}</p>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 8px rgba(26,28,28,0.04)" }}>
          {[{ icon: "mail", label: "Email", value: user.email }, { icon: "phone", label: "Phone", value: user.phone ?? "Not added" }].map((item, i) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderBottom: i === 0 ? "1px solid #f9f9f9" : "none" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(251,192,45,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="material-symbols-outlined" style={{ color: "#fbc02d", fontSize: 20, fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
              </div>
              <div>
                <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04rem" }}>{item.label}</p>
                <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, fontWeight: 600, color: "#1a1c1c" }}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
        {sections.map((section) => (
          <div key={section.title}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05rem", marginBottom: 10, paddingLeft: 4 }}>{section.title}</p>
            <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 8px rgba(26,28,28,0.04)" }}>
              {section.items.map((item, i) => (
                <Link key={item.label} href={(item as any).href ?? "#"} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderBottom: i < section.items.length - 1 ? "1px solid #f9f9f9" : "none" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "#f3f3f3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="material-symbols-outlined" style={{ color: "#fbc02d", fontSize: 20, fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 15, fontWeight: 600, color: "#1a1c1c" }}>{item.label}</p>
                    <p style={{ fontSize: 12, color: "#9ca3af" }}>{item.sub}</p>
                  </div>
                  <span className="material-symbols-outlined" style={{ color: "#9ca3af" }}>chevron_right</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
        <div style={{ background: "rgba(239,68,68,0.06)", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(239,68,68,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="material-symbols-outlined" style={{ color: "#EF4444", fontSize: 20 }}>logout</span>
            </div>
            <div style={{ flex: 1 }}><LogoutButton /></div>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af" }}>DriveNeu v1.0.0 · Partner App</p>
      </main>
    </div>
  );
}
