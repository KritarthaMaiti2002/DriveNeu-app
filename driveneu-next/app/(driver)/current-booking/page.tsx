import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CurrentBookingPage() {
  const s = await getServerSession(authOptions);
  if (!s) redirect("/login");

  const driver = await prisma.driverProfile.findUnique({ where: { userId: s.user.id } });
  if (!driver) return null;

  const booking = await prisma.booking.findFirst({
    where: { driverId: driver.id, status: "ONGOING" },
    orderBy: { scheduledAt: "desc" },
  });

  const upcoming = await prisma.booking.findFirst({
    where: { driverId: driver.id, status: "SCHEDULED", scheduledAt: { gte: new Date() } },
    orderBy: { scheduledAt: "asc" },
  });

  const active = booking ?? upcoming;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#f9f9f9", minHeight: "100dvh" }}>
      {/* TopAppBar */}
      <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, background: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/bookings" style={{ textDecoration: "none" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: "50%" }}>
              <span className="material-symbols-outlined" style={{ color: "#eab308" }}>arrow_back</span>
            </button>
          </Link>
          <h1 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 18, color: "#eab308", letterSpacing: "-0.01em" }}>Current Booking</h1>
        </div>
        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: "50%" }}>
          <span className="material-symbols-outlined" style={{ color: "#eab308" }}>more_vert</span>
        </button>
      </header>

      <main style={{ paddingTop: 64, paddingBottom: 96, minHeight: "100dvh" }}>
        {/* Map Section */}
        <section style={{ position: "relative", height: 397, width: "100%", overflow: "hidden", background: "#e8e8e8" }}>
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #e8e8e8 0%, #d4d4d4 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 64, color: "#9ca3af" }}>map</span>
          </div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 0%, #f9f9f9 100%)", pointerEvents: "none" }} />
          {/* Floating nav cue */}
          <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)", padding: "8px 16px", borderRadius: 999, boxShadow: "0 4px 16px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(188,202,191,0.1)" }}>
            <span className="material-symbols-outlined" style={{ color: "#eab308", fontVariationSettings: "'FILL' 1" }}>navigation</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 14, color: "#1a1c1c" }}>4 min to pickup</span>
          </div>
        </section>

        {/* Booking Details */}
        <div style={{ padding: "0 24px", marginTop: -48, position: "relative", zIndex: 10, display: "flex", flexDirection: "column", gap: 24 }}>
          {active ? (
            <>
              {/* Main Trip Card */}
              <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 8px 24px rgba(26,28,28,0.04)", border: "1px solid rgba(188,202,191,0.1)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ position: "relative" }}>
                      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#fbc02d", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #facc15" }}>
                        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 900, fontSize: 20, color: "#1a1a1a" }}>
                          {active.passenger.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </span>
                      </div>
                      <div style={{ position: "absolute", bottom: -4, right: -4, background: "#eab308", color: "#000", borderRadius: "50%", padding: 4, border: "2px solid #fff" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 12, fontVariationSettings: "'FILL' 1" }}>star</span>
                      </div>
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05rem", color: "#5f5e5e" }}>Passenger</p>
                      <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 20, color: "#1a1c1c", letterSpacing: "-0.01em" }}>{active.passenger}</h2>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05rem", color: "#5f5e5e" }}>Estimated Fare</p>
                    <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 24, color: "#eab308", letterSpacing: "-0.02em" }}>₹{active.fare.toLocaleString("en-IN")}</p>
                  </div>
                </div>

                {/* Route Timeline */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#eab308", boxShadow: "0 0 0 4px rgba(234,179,8,0.2)" }} />
                      <div style={{ width: 2, height: 48, background: "#e8e8e8", margin: "4px 0" }} />
                    </div>
                    <div style={{ paddingBottom: 24 }}>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05rem", color: "#5f5e5e", marginBottom: 4 }}>Pickup Location</p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: "#1a1c1c", fontSize: 14, lineHeight: 1.4 }}>{active.pickup}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#3d4a41" }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05rem", color: "#5f5e5e", marginBottom: 4 }}>Destination</p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: "#1a1c1c", fontSize: 14, lineHeight: 1.4 }}>{active.dropoff}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Bento */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ background: "#f3f3f3", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between", height: 112 }}>
                  <span className="material-symbols-outlined" style={{ color: "#eab308", fontVariationSettings: "'FILL' 1" }}>distance</span>
                  <div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05rem", color: "#5f5e5e" }}>Distance</p>
                    <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 18, color: "#1a1c1c" }}>{active.distanceKm.toFixed(1)} km</p>
                  </div>
                </div>
                <div style={{ background: "#f3f3f3", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between", height: 112 }}>
                  <span className="material-symbols-outlined" style={{ color: "#e37075", fontVariationSettings: "'FILL' 1" }}>schedule</span>
                  <div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05rem", color: "#5f5e5e" }}>Status</p>
                    <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 18, color: "#1a1c1c" }}>{active.status}</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button style={{ width: "100%", height: 64, background: "linear-gradient(to right, #eab308, #facc15)", border: "none", borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", boxShadow: "0 8px 24px rgba(234,179,8,0.2)", cursor: "pointer", transition: "all 0.15s" }}>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 18, color: "#000", letterSpacing: "-0.01em" }}>I Have Arrived</span>
                  <div style={{ background: "rgba(0,0,0,0.1)", borderRadius: "50%", padding: 8 }}>
                    <span className="material-symbols-outlined" style={{ color: "#000" }}>chevron_right</span>
                  </div>
                </button>
                <p style={{ textAlign: "center", color: "#9ca3af", fontFamily: "'Inter', sans-serif", fontSize: 11, marginTop: 16, textTransform: "uppercase", letterSpacing: "0.1rem", fontWeight: 500 }}>Swipe for emergency contact</p>
              </div>
            </>
          ) : (
            <div style={{ background: "#fff", borderRadius: 12, padding: 48, textAlign: "center", boxShadow: "0 8px 24px rgba(26,28,28,0.04)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 64, color: "#9ca3af", display: "block", marginBottom: 16 }}>local_taxi</span>
              <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 20, color: "#1a1c1c", marginBottom: 8 }}>No Active Booking</h2>
              <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 24 }}>You don't have any active or upcoming bookings right now.</p>
              <Link href="/bookings" style={{ display: "inline-block", background: "#eab308", color: "#000", fontWeight: 700, padding: "12px 24px", borderRadius: 999, textDecoration: "none", fontSize: 14 }}>
                View All Bookings
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
