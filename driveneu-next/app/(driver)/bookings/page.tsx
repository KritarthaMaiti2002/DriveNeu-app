import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Info, Filter, MapPin, Clock, CheckCircle, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const s = await getServerSession(authOptions);
  if (!s) redirect("/login");

  const driver = await prisma.driverProfile.findUnique({ where: { userId: s.user.id } });
  if (!driver) return null;

  const bookings = await prisma.booking.findMany({
    where: { driverId: driver.id },
    orderBy: { scheduledAt: "desc" },
    take: 20,
  });

  const upcoming = bookings.filter((b) => b.status === "SCHEDULED" && new Date(b.scheduledAt) >= new Date());
  const past = bookings.filter((b) => b.status !== "SCHEDULED" || new Date(b.scheduledAt) < new Date());

  const statusColor = (status: string) => {
    if (status === "COMPLETED") return { bg: "#F0FDF4", text: "#15803D" };
    if (status === "CANCELLED") return { bg: "#FEF2F2", text: "#DC2626" };
    if (status === "ONGOING") return { bg: "#EFF6FF", text: "#1D4ED8" };
    return { bg: "#FFF3CD", text: "#D4A017" };
  };

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "50%", background: "#fff", border: "1px solid #f0ede8", textDecoration: "none" }}>
            <ArrowLeft style={{ width: 18, height: 18, color: "#374151" }} />
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", textTransform: "uppercase", letterSpacing: "0.03em" }}>Future Bookings</h1>
        </div>
        <button style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "50%", background: "transparent", border: "none", cursor: "pointer" }}>
          <Info style={{ width: 20, height: 20, color: "#374151" }} />
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 12, padding: 4, marginBottom: 20 }}>
        <div style={{ flex: 1, textAlign: "center", padding: "10px", borderRadius: 10, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Immediate</span>
        </div>
        <div style={{ flex: 1, textAlign: "center", padding: "10px", borderRadius: 10, background: "#F5A623" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>Reservation</span>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #f0ede8", borderRadius: 20, padding: "8px 16px", fontSize: 14, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
          <Filter style={{ width: 16, height: 16 }} />
          Filters
        </button>
      </div>

      {/* Upcoming bookings */}
      {upcoming.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, padding: "32px", textAlign: "center", border: "1px solid #f0ede8", marginBottom: 20 }}>
          <p style={{ fontSize: 15, color: "#9ca3af" }}>No more bookings for today</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
          {upcoming.map((b) => (
            <div key={b.id} style={{ background: "#fff", borderRadius: 16, padding: "18px", border: "1px solid #f0ede8" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <span style={{ background: "#f3f4f6", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700, color: "#374151" }}>
                  {b.distanceKm.toFixed(0)} KM
                </span>
                <span style={{ background: "#f3f4f6", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700, color: "#374151" }}>B2C</span>
                <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" }}>Payment</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>Online</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 14, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Clock style={{ width: 18, height: 18, color: "#6b7280" }} />
                </div>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>
                    {new Date(b.scheduledAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} {new Date(b.scheduledAt).toDateString() === new Date().toDateString() ? "Today" : new Date(b.scheduledAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </p>
                  <p style={{ fontSize: 13, color: "#9ca3af" }}>Scheduled start time</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MapPin style={{ width: 18, height: 18, color: "#6b7280" }} />
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{b.pickup}</p>
                  <p style={{ fontSize: 13, color: "#9ca3af" }}>Pickup Location</p>
                </div>
              </div>
              <div style={{ background: "#f9fafb", borderRadius: 10, padding: "10px 14px", marginBottom: 14, display: "flex", gap: 8, alignItems: "center" }}>
                <Info style={{ width: 16, height: 16, color: "#6b7280", flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: "#6b7280" }}>₹50 will be deducted as a token amount.</p>
              </div>
              <div style={{ background: "#F5A623", borderRadius: 14, padding: "14px", textAlign: "center", cursor: "pointer" }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>Check In ›</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Past bookings */}
      {past.length > 0 && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14 }}>Recent Activity</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {past.slice(0, 8).map((b) => {
              const sc = statusColor(b.status);
              return (
                <div key={b.id} style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #f0ede8" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{b.passenger}</p>
                      <p style={{ fontSize: 12, color: "#9ca3af" }}>
                        {new Date(b.scheduledAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}, {new Date(b.scheduledAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                      <p style={{ fontSize: 17, fontWeight: 800, color: b.status === "CANCELLED" ? "#9ca3af" : "#D4A017" }}>
                        ₹{b.fare.toLocaleString("en-IN")}
                      </p>
                      <span style={{ background: sc.bg, color: sc.text, fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "3px 10px", textTransform: "uppercase" }}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F5A623", flexShrink: 0 }} />
                      <span>{b.pickup}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#374151", flexShrink: 0 }} />
                      <span>{b.dropoff}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
