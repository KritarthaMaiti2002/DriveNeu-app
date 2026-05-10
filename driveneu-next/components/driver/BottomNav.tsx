import Link from "next/link";
import { Home, Calendar, Wallet, GraduationCap, User } from "lucide-react";

export function BottomNav() {
  const items = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/bookings", icon: Calendar, label: "Bookings" },
    { href: "/wallet", icon: Wallet, label: "Wallet" },
    { href: "/lms", icon: GraduationCap, label: "Learn" },
    { href: "/profile", icon: User, label: "Profile" },
  ];
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-card/95 backdrop-blur border-t border-border">
      <div className="mx-auto max-w-md grid grid-cols-5 px-2 py-2">
        {items.map((it) => (
          <Link key={it.href} href={it.href} className="flex flex-col items-center gap-1 py-1 text-xs text-muted-foreground hover:text-primary">
            <it.icon className="h-5 w-5" />
            {it.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
