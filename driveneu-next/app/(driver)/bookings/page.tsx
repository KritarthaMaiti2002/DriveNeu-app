import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const s = await getServerSession(authOptions); if (!s) redirect("/login");
  const driver = await prisma.driverProfile.findUnique({ where: { userId: s.user.id } });
  if (!driver) return null;
  const bookings = await prisma.booking.findMany({ where: { driverId: driver.id }, orderBy: { scheduledAt: "desc" }, take: 50 });
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold">Bookings</h1>
      {bookings.length === 0 && <p className="text-muted-foreground text-sm">No bookings yet.</p>}
      {bookings.map((b) => (
        <div key={b.id} className="rounded-2xl bg-card p-4 shadow-card space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{new Date(b.scheduledAt).toLocaleString()}</span>
            <span className="font-bold">{b.status}</span>
          </div>
          <div className="font-semibold">{b.passenger}</div>
          <div className="text-xs text-muted-foreground">📍 {b.pickup}</div>
          <div className="text-xs text-muted-foreground">🏁 {b.dropoff}</div>
          <div className="flex justify-between pt-2 border-t border-border text-sm">
            <span>{b.distanceKm} km</span>
            <span className="text-primary font-bold">{formatINR(b.fare)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
