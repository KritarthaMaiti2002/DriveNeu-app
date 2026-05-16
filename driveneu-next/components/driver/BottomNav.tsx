"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart2, Bell, User, BookOpen } from "lucide-react";

export function BottomNav() {
  const path = usePathname();
  const items = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/bookings", icon: BarChart2, label: "Bookings" },
    { href: "/updates", icon: Bell, label: "Updates" },
    { href: "/lms", icon: BookOpen, label: "Learning" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50" style={{
      background: "#fff",
      borderTop: "1px solid #f0ede8",
      boxShadow: "0 -4px 20px rgba(0,0,0,0.06)"
    }}>
      <div className="mx-auto max-w-md grid grid-cols-5 px-1 py-2">
        {items.map((it) => {
          const active = path === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              className="flex flex-col items-center gap-1 py-1.5"
              style={{ textDecoration: "none" }}
            >
              <div style={{
                width: 44,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 16,
                background: active ? "#FFF3CD" : "transparent",
              }}>
                <it.icon
                  style={{
                    width: 20,
                    height: 20,
                    color: active ? "#D4A017" : "#9ca3af",
                    strokeWidth: active ? 2.5 : 1.8,
                  }}
                />
              </div>
              <span style={{
                fontSize: 10,
                fontWeight: active ? 600 : 400,
                color: active ? "#D4A017" : "#9ca3af",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}>
                {it.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
