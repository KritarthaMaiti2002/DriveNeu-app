import { formatINR } from "@/lib/utils";
export function UpcomingBooking({ b }: { b: { passenger: string; pickup: string; dropoff: string; scheduledAt: string | Date; fare: number; distanceKm: number } | null }) {
  if (!b) return <div className="rounded-2xl bg-card p-4 text-sm text-muted-foreground shadow-card">No upcoming bookings.</div>;
  const t = new Date(b.scheduledAt);
  return (
    <div className="rounded-2xl bg-card p-4 shadow-card space-y-3">
      <div className="flex justify-between text-[10px] tracking-widest font-bold text-muted-foreground uppercase">
        <span>Next Booking</span><span>{t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
      <div className="font-semibold">{b.passenger}</div>
      <div className="text-xs text-muted-foreground">📍 {b.pickup}</div>
      <div className="text-xs text-muted-foreground">🏁 {b.dropoff}</div>
      <div className="flex justify-between pt-2 border-t border-border">
        <span className="text-xs">{b.distanceKm} km</span>
        <span className="font-bold text-primary">{formatINR(b.fare)}</span>
      </div>
    </div>
  );
}
