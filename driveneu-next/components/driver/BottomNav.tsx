"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BottomNavProps {
  onMenuClick?: () => void;
}

const items = [
  { href: "/dashboard", icon: "home", label: "Home" },
  { href: "/bookings", icon: "calendar_month", label: "Bookings" },
  { href: "/updates", icon: "notifications", label: "Updates" },
  { href: "/lms", icon: "school", label: "Learning" },
  { href: "/profile", icon: "account_circle", label: "Profile" },
];

export function BottomNav({ onMenuClick }: BottomNavProps) {
  const path = usePathname();

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, width: "100%", zIndex: 50,
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      boxShadow: "0 -8px 24px rgba(26,28,28,0.06)",
      borderTop: "1px solid rgba(204,200,188,0.15)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "8px 16px 12px", maxWidth: 480, margin: "0 auto" }}>
        {items.map((item) => {
          const active = path === item.href || path.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 12px", borderRadius: 12, background: active ? "rgba(251,192,45,0.15)" : "transparent", transition: "all 0.2s" }}>
              <span className="material-symbols-outlined" style={{
                color: active ? "#fbc02d" : "#9ca3af",
                fontSize: 24,
                fontVariationSettings: active ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 300",
              }}>
                {item.icon}
              </span>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 10,
                fontWeight: active ? 700 : 500,
                textTransform: "uppercase",
                letterSpacing: "0.05rem",
                color: active ? "#fbc02d" : "#9ca3af",
              }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
