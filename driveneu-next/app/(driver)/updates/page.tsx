import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function UpdatesPage() {
  const s = await getServerSession(authOptions); if (!s) redirect("/login");
  const driver = await prisma.driverProfile.findUnique({ where: { userId: s.user.id } });
  if (!driver) return null;
  const items = await prisma.notification.findMany({ where: { driverId: driver.id }, orderBy: { createdAt: "desc" }, take: 50 });
  return (
    <div className="space-y-3">
      <h1 className="font-display text-2xl font-bold">Updates</h1>
      {items.length === 0 && <p className="text-sm text-muted-foreground">You're all caught up.</p>}
      {items.map((n) => (
        <div key={n.id} className={`rounded-xl p-3 ${n.read ? "bg-card" : "bg-card border border-primary/40"}`}>
          <div className="flex justify-between text-xs text-muted-foreground"><span>{new Date(n.createdAt).toLocaleString()}</span>{!n.read && <span className="text-primary font-bold">NEW</span>}</div>
          <div className="font-semibold">{n.title}</div>
          <div className="text-sm text-muted-foreground">{n.body}</div>
        </div>
      ))}
    </div>
  );
}
