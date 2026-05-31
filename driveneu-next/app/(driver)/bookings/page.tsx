import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
export const dynamic = "force-dynamic";
export default async function BookingsPage() {
  const s = await getServerSession(authOptions);
  if (!s) redirect("/login");
  const driver = await prisma.driverProfile.findUnique({ where: { userId: s.user.id } });
  if (!driver) return null;
  const bookings = await prisma.booking.findMany({ where: { driverId: driver.id }, orderBy: { scheduledAt: "desc" }, take: 20 });
  const upcoming = bookings.filter((b) => b.status === "SCHEDULED" && new Date(b.scheduledAt) >= new Date());
  const past = bookings.filter((b) => b.status !== "SCHEDULED" || new Date(b.scheduledAt) < new Date());
  const sc = (status: string) => {
    if (status === "COMPLETED") return { bg: "rgba(34,197,94,0.1)", color: "#16a34a" };
    if (status === "CANCELLED") return { bg: "rgba(239,68,68,0.1)", color: "#dc2626" };
    return { bg: "rgba(251,192,45,0.1)", color: "#d97706" };
  };
  return (
    <div style={{ background: "#f9f9f9", minHeight: "100dvh", paddingBottom: 128 }}>
      <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(24px)", boxShadow: "0 1px 0 rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 64, maxWidth: 480, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/dashboard" style={{ textDecoration: "none" }}><span className="material-symbols-outlined" style={{ color: "#fbc02d" }}>arrow_back</span></Link>
            <h1 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 18, color: "#1a1c1c", textTransform: "uppercase", letterSpacing: "0.03em" }}>Future Bookings</h1>
          </div>
          <span className="material-symbols-outlined" style={{ color: "#4a473d" }}>info</span>
        </div>
      </header>
      <main style={{ paddingTop: 80, paddingLeft: 16, paddingRight: 16, maxWidth: 480, margin: "0 auto" }}>
        <div style={{ display: "flex", background: "#eee", borderRadius: 12, padding: 4, marginBottom: 20 }}>
          <div style={{ flex: 1, textAlign: "center", padding: "10px", borderRadius: 10, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}><span style={{ fontSize: 14, fontWeight: 700, color: "#1a1c1c" }}>Immediate</span></div>
          <div style={{ flex: 1, textAlign: "center", padding: "10px", borderRadius: 10, background: "linear-gradient(135deg, #fbc02d, #fcc934)" }}><span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>Reservation</span></div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #eee", borderRadius: 20, padding: "8px 16px", fontSize: 14, fontWeight: 600, color: "#4a473d", cursor: "pointer" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>tune</span>Filters
          </button>
        </div>
        {upcoming.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 16, padding: "32px", textAlign: "center", marginBottom: 20, boxShadow: "0 4px 16px rgba(26,28,28,0.04)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#9ca3af", display: "block", marginBottom: 12 }}>calendar_today</span>
            <p style={{ fontSize: 15, color: "#9ca3af" }}>No more bookings for today</p>
          </div>
        ) : upcoming.map((b) => (
          <div key={b.id} style={{ background: "#fff", borderRadius: 16, padding: "20px", boxShadow: "0 4px 16px rgba(26,28,28,0.06)", marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ background: "#f3f3f3", borderRadius: 999, padding: "4px 12px", fontSize: 12, fontWeight: 700, color: "#4a473d" }}>{b.distanceKm.toFixed(0)} KM</span>
                <span style={{ background: "#f3f3f3", borderRadius: 999, padding: "4px 12px", fontSize: 12, fontWeight: 700, color: "#4a473d" }}>B2C</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" }}>Payment</p>
                <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 14, fontWeight: 800, color: "#1a1c1c" }}>Online</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 14, marginBottom: 12, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f3f3f3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="material-symbols-outlined" style={{ color: "#4a473d", fontSize: 20 }}>anchor</span>
              </div>
              <div>
                <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 16, fontWeight: 800, color: "#1a1c1c" }}>{new Date(b.scheduledAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} Today</p>
                <p style={{ fontSize: 12, color: "#9ca3af" }}>Scheduled start time</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 14, marginBottom: 16, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f3f3f3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="material-symbols-outlined" style={{ color: "#4a473d", fontSize: 20, fontVariationSettings: "'FILL' 1" }}>location_on</span>
              </div>
              <div>
                <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 15, fontWeight: 600, color: "#1a1c1c" }}>{b.pickup}</p>
                <p style={{ fontSize: 12, color: "#9ca3af" }}>Pickup Location</p>
              </div>
            </div>
            <div style={{ background: "#f9f9f9", borderRadius: 10, padding: "10px 14px", marginBottom: 16, display: "flex", gap: 8, alignItems: "center", border: "1px solid #eee" }}>
              <span className="material-symbols-outlined" style={{ color: "#9ca3af", fontSize: 16 }}>info</span>
              <p style={{ fontSize: 13, color: "#4a473d" }}>₹50 will be deducted as a token amount.</p>
            </div>
            <button style={{ width: "100%", background: "linear-gradient(135deg, #fbc02d, #fcc934)", border: "none", borderRadius: 14, padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", boxShadow: "0 4px 16px rgba(252,201,52,0.3)" }}>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>Check In</span>
              <span className="material-symbols-outlined" style={{ color: "#1a1a1a" }}>chevron_right</span>
            </button>
          </div>
        ))}
        {past.length > 0 && (
          <div>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05rem", marginBottom: 14 }}>Recent Activity</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {past.slice(0, 8).map((b) => {
                const s = sc(b.status);
                return (
                  <div key={b.id} style={{ background: "#fff", borderRadius: 14, padding: "16px", boxShadow: "0 2px 8px rgba(26,28,28,0.04)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 15, fontWeight: 700, color: "#1a1c1c" }}>{b.passenger}</p>
                        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{new Date(b.scheduledAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}, {new Date(b.scheduledAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                        <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 17, fontWeight: 800, color: "#fbc02d" }}>₹{b.fare.toLocaleString("en-IN")}</p>
                        <span style={{ background: s.bg, color: s.color, fontSize: 10, fontWeight: 700, borderRadius: 999, padding: "3px 10px", textTransform: "uppercase" }}>{b.status}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: "#4a473d", display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: "#fbc02d", flexShrink: 0, display: "inline-block" }} /><span>{b.pickup}</span></div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: "#1a1c1c", flexShrink: 0, display: "inline-block" }} /><span>{b.dropoff}</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
