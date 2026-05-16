import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Settings, ChevronRight, Star, TrendingUp, Shield, HelpCircle, LogOut, User, Phone, Mail, CreditCard } from "lucide-react";
import { LogoutButton } from "./LogoutButton";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const s = await getServerSession(authOptions);
  if (!s) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: s.user.id },
    include: { driver: true },
  });
  if (!user || !user.driver) return null;

  const driver = user.driver;
  const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const menuItems = [
    { section: "Account", items: [
      { icon: User, label: "Personal Information", sub: "Name, email, phone", color: "#FFF3CD", iconColor: "#D4A017" },
      { icon: CreditCard, label: "Your ID Card", sub: `ID: ${driver.partnerId}`, color: "#FFF3CD", iconColor: "#D4A017" },
      { icon: Shield, label: "Security", sub: "Password, 2FA", color: "#EFF6FF", iconColor: "#3B82F6" },
    ]},
    { section: "Performance", items: [
      { icon: Star, label: "My Ratings", sub: `${driver.rating.toFixed(2)} average rating`, color: "#FFF3CD", iconColor: "#D4A017" },
      { icon: TrendingUp, label: "Performance Stats", sub: `${driver.streakDays} day streak`, color: "#F0FDF4", iconColor: "#22C55E" },
    ]},
    { section: "Support", items: [
      { icon: HelpCircle, label: "Help & Support", sub: "FAQs, contact us", color: "#EFF6FF", iconColor: "#3B82F6", href: "/help" },
    ]},
  ];

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>Profile</h1>
        <button style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "50%", background: "#fff", border: "1px solid #f0ede8", cursor: "pointer" }}>
          <Settings style={{ width: 18, height: 18, color: "#374151" }} />
        </button>
      </div>

      {/* Profile card */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #f0ede8", marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#F5A623", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#1a1a1a" }}>{initials}</span>
          <div style={{ position: "absolute", bottom: 2, right: 2, width: 14, height: 14, borderRadius: "50%", background: "#22C55E", border: "2px solid #fff" }} />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 4 }}>{user.name}</h2>
          <p style={{ fontSize: 13, color: "#D4A017", fontWeight: 600, marginBottom: 4 }}>{driver.tier}</p>
          <p style={{ fontSize: 12, color: "#9ca3af" }}>ID: {driver.partnerId}</p>
        </div>
        <ChevronRight style={{ width: 20, height: 20, color: "#9ca3af" }} />
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "14px 10px", border: "1px solid #f0ede8", textAlign: "center" }}>
          <p style={{ fontSize: 22, fontWeight: 800, color: "#F5A623", marginBottom: 4 }}>{driver.rating.toFixed(1)}</p>
          <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>Rating</p>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: "14px 10px", border: "1px solid #f0ede8", textAlign: "center" }}>
          <p style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 4 }}>{driver.streakDays}</p>
          <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>Day Streak</p>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: "14px 10px", border: "1px solid #f0ede8", textAlign: "center" }}>
          <p style={{ fontSize: 22, fontWeight: 800, color: "#22C55E", marginBottom: 4 }}>
            {driver.status === "ONLINE" ? "ON" : "OFF"}
          </p>
          <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>Status</p>
        </div>
      </div>

      {/* Contact info */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f0ede8", overflow: "hidden", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderBottom: "1px solid #f9fafb" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "#FFF3CD", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Mail style={{ width: 18, height: 18, color: "#D4A017" }} />
          </div>
          <div>
            <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Email</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{user.email}</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "#FFF3CD", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Phone style={{ width: 18, height: 18, color: "#D4A017" }} />
          </div>
          <div>
            <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Phone</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{user.phone ?? "Not added"}</p>
          </div>
        </div>
      </div>

      {/* Menu sections */}
      {menuItems.map((section) => (
        <div key={section.section} style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10, paddingLeft: 4 }}>
            {section.section}
          </p>
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f0ede8", overflow: "hidden" }}>
            {section.items.map((item, i) => (
              <Link
                key={item.label}
                href={(item as any).href ?? "#"}
                style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderBottom: i < section.items.length - 1 ? "1px solid #f9fafb" : "none" }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, background: item.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <item.icon style={{ width: 18, height: 18, color: item.iconColor }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{item.label}</p>
                  <p style={{ fontSize: 12, color: "#9ca3af" }}>{item.sub}</p>
                </div>
                <ChevronRight style={{ width: 18, height: 18, color: "#9ca3af" }} />
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* Logout */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ background: "#FEF2F2", borderRadius: 16, border: "1px solid #FECACA", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LogOut style={{ width: 18, height: 18, color: "#EF4444" }} />
            </div>
            <div style={{ flex: 1 }}>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Version */}
      <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>
        DriveNeu v1.0.0 · Partner App
      </p>
    </div>
  );
}
