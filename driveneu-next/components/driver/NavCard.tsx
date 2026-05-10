import Link from "next/link";
import { ReactNode } from "react";

export function NavCard({ href, label, icon, badge }: { href: string; label: string; icon: ReactNode; badge?: number }) {
  return (
    <Link href={href} className="relative rounded-2xl bg-card p-4 flex flex-col items-center gap-2 hover:bg-accent transition shadow-card">
      <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary grid place-items-center">{icon}</div>
      <span className="text-xs font-semibold">{label}</span>
      {badge ? <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] rounded-full h-5 min-w-5 px-1 grid place-items-center font-bold">{badge}</span> : null}
    </Link>
  );
}
