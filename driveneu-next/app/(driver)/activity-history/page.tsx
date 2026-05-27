import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ActivityHistoryPage() {
  const s = await getServerSession(authOptions);
  if (!s) redirect("/login");

  const driver = await prisma.driverProfile.findUnique({ where: { userId: s.user.id } });
  if (!driver) return null;

  const bookings = await prisma.booking.findMany({
    where: { driverId: driver.id },
    orderBy: { scheduledAt: "desc" },
    take: 50,
  });

  const totalTrips = bookings.filter((b) => b.status === "COMPLETED").length;
  const totalEarned = bookings.filter((b) => b.status === "COMPLETED").reduce((s, b) => s + b.fare, 0);

  function formatDate(date: Date) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const d = new Date(date); d.setHours(0, 0, 0, 0);
    if (d.getTime() === today.getTime()) return "Today";
    if (d.getTime() === yesterday.getTime()) return "Yesterday";
    return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }

  function formatTime(date: Date) {
    return new Date(date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  }

  // Group by date
  const grouped: Record<string, typeof bookings> = {};
  bookings.forEach((b) => {
    const key = formatDate(new Date(b.scheduledAt));
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(b);
  });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#f9f9f9", minHeight: "100dvh", paddingBottom: 128 }}>
      {/* TopAppBar */}
      <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, background: "rgba(249,249,249,0.8)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/dashboard" style={{ textDecoration: "none" }}>
            <button style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "none", border: "none", cursor: "pointer" }}>
              <span className="material-symbols-outlined" style={{ color: "#A16207" }}>arrow_back</span>
            </button>
          </Link>
          <h1 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 18, color: "#1a1c1c", letterSpacing: "-0.01em" }}>Activity History</h1>
        </div>
        <button style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "none", border: "none", cursor: "pointer" }}>
          <span className="material-symbols-outlined" style={{ color: "#A16207" }}>filter_list</span>
        </button>
      </header>

      <main style={{ paddingTop: 96, paddingLeft: 24, paddingRight: 24, maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", gap: 40 }}>
        {/* Summary Stats */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: "#f3f3f3", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05rem", color: "#656464" }}>Total Trips</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 36, fontWeight: 800, color: "#1a1c1c", marginTop: 8 }}>{totalTrips}</span>
          </div>
          <div style={{ background: "#FEF9C3", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between", border: "1px solid rgba(161,98,7,0.1)" }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05rem", color: "#A16207" }}>Total Earned</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 36, fontWeight: 800, color: "#A16207", marginTop: 8 }}>₹{totalEarned.toLocaleString("en-IN")}</span>
          </div>
        </section>

        {/* History List */}
        <section style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05rem", color: "#3d4a41" }}>Recent Activity</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {bookings.length === 0 && (
              <div style={{ textAlign: "center", padding: 48, color: "#9ca3af" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, display: "block", marginBottom: 12 }}>history</span>
                <p>No activity yet</p>
              </div>
            )}
            {bookings.map((b) => {
              const isCompleted = b.status === "COMPLETED";
              const isCancelled = b.status === "CANCELLED";
              const initials = b.passenger.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

              return (
                <div key={b.id} style={{
                  background: isCancelled ? "rgba(249,249,249,0.4)" : "#fff",
                  borderRadius: 12,
                  padding: 24,
                  boxShadow: isCancelled ? "none" : "0 4px 12px rgba(26,28,28,0.03)",
                  border: "1px solid rgba(188,202,191,0.15)",
                  opacity: isCancelled ? 0.7 : 1,
                }}>
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: isCancelled ? "#e8e8e8" : "#fbc02d", display: "flex", alignItems: "center", justifyContent: "center", filter: isCancelled ? "grayscale(1)" : "none" }}>
                        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 16, color: isCancelled ? "#9ca3af" : "#1a1a1a" }}>{initials}</span>
                      </div>
                      <div>
                        <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 15, color: isCancelled ? "#9ca3af" : "#1a1c1c" }}>{b.passenger}</h3>
                        <p style={{ fontSize: 12, color: "#3d4a41" }}>{formatDate(new Date(b.scheduledAt))}, {formatTime(new Date(b.scheduledAt))}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 20, color: isCancelled ? "#9ca3af" : "#A16207" }}>
                        ₹{b.fare.toLocaleString("en-IN")}
                      </p>
                      <span style={{
                        display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: 999,
                        fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05rem",
                        background: isCompleted ? "#FEF9C3" : isCancelled ? "#e8e8e8" : "#f3f3f3",
                        color: isCompleted ? "#A16207" : isCancelled ? "#9ca3af" : "#5f5e5e",
                      }}>
                        {b.status}
                      </span>
                    </div>
                  </div>

                  {/* Route */}
                  <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ position: "absolute", left: 11, top: 12, bottom: 12, width: 1.5, background: "rgba(188,202,191,0.3)" }} />
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: isCancelled ? "#9ca3af" : "#A16207", zIndex: 10, background: isCancelled ? "rgba(249,249,249,0.4)" : "#fff", fontVariationSettings: "'FILL' 1" }}>radio_button_checked</span>
                      <div>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05rem", color: "#3d4a41" }}>Pickup</p>
                        <p style={{ fontSize: 14, color: "#1a1c1c", fontWeight: 500 }}>{b.pickup}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: isCancelled ? "#9ca3af" : "#ba1a1a", zIndex: 10, background: isCancelled ? "rgba(249,249,249,0.4)" : "#fff", fontVariationSettings: "'FILL' 1" }}>location_on</span>
                      <div>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05rem", color: "#3d4a41" }}>Drop-off</p>
                        <p style={{ fontSize: 14, color: "#1a1c1c", fontWeight: 500 }}>{b.dropoff}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
