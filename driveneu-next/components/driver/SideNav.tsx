"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/app/(driver)/profile/LogoutButton";

interface SideNavProps {
  driverName: string;
  partnerId: string;
  tier: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SideNav({ driverName, partnerId, tier, isOpen, onClose }: SideNavProps) {
  const path = usePathname();

  const navItems = [
    { icon: "logout", label: "Checked Out", href: "#", isStatus: true },
    { icon: "local_taxi", label: "Current Booking", href: "/current-booking" },
    { icon: "calendar_month", label: "Future Bookings", href: "/bookings" },
    { icon: "history", label: "History", href: "/activity-history" },
    { icon: "person", label: "My Account", href: "/profile" },
    { icon: "location_on", label: "Home Location", href: "/home-location" },
    { icon: "notifications", label: "Updates", href: "/updates", badge: 4 },
    { icon: "school", label: "LMS", href: "/lms" },
    { icon: "person_add", label: "Refer and Earn", href: "#" },
    { icon: "beach_access", label: "Plan Vacation", href: "#" },
    { icon: "confirmation_number", label: "View Tickets", href: "/help" },
    { icon: "help", label: "Help", href: "/help" },
  ];

  const initials = driverName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, backdropFilter: "blur(4px)" }}
      />

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0, width: 320, zIndex: 101,
        background: "#1a1a1a",
        display: "flex", flexDirection: "column",
        overflowY: "auto",
        boxShadow: "8px 0 40px rgba(0,0,0,0.3)",
      }}>
        {/* Profile Section */}
        <div style={{ padding: "48px 24px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ position: "relative", width: 64, height: 64, marginBottom: 12 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #333" }}>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 900, fontSize: 24, color: "#fff" }}>{initials}</span>
            </div>
            <div style={{ position: "absolute", bottom: 2, right: 2, width: 14, height: 14, borderRadius: "50%", background: "#fbc02d", border: "2px solid #1a1a1a" }} />
          </div>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 20, color: "#fff" }}>{driverName}</h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>ID: {partnerId}</p>
          <p style={{ fontSize: 13, color: "#fbc02d", fontWeight: 600 }}>{tier}</p>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((item) => {
            const active = path === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                style={{ textDecoration: "none" }}
              >
                <div style={{
                  display: "flex", alignItems: "center", gap: 16, padding: "12px 16px", borderRadius: 12,
                  background: item.isStatus ? "rgba(160,61,68,0.2)" : active ? "rgba(251,192,45,0.1)" : "transparent",
                  cursor: "pointer",
                }}>
                  <span className="material-symbols-outlined" style={{
                    color: item.isStatus ? "#e37075" : active ? "#fbc02d" : "rgba(255,255,255,0.7)",
                    fontSize: 22,
                  }}>{item.icon}</span>
                  <span style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 500,
                    color: item.isStatus ? "#e37075" : active ? "#fbc02d" : "rgba(255,255,255,0.85)",
                    flex: 1,
                  }}>{item.label}</span>
                  {item.badge && (
                    <span style={{ background: "#fbc02d", color: "#000", fontSize: 11, fontWeight: 800, borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Check In Button */}
        <div style={{ padding: 24 }}>
          <button style={{ width: "100%", background: "linear-gradient(135deg, #fbc02d, #fcc934)", border: "none", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", boxShadow: "0 4px 16px rgba(251,192,45,0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="material-symbols-outlined" style={{ color: "#000" }}>login</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 15, color: "#000", textTransform: "uppercase", letterSpacing: "0.05rem" }}>Check In</span>
            </div>
            <span className="material-symbols-outlined" style={{ color: "#000" }}>chevron_right</span>
          </button>
          <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 24, textTransform: "uppercase", letterSpacing: "0.05rem" }}>Version 4.12.0 • Pro Navigator</p>
        </div>
      </div>
    </>
  );
}
