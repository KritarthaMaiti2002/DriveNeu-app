"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const plans = [
  {
    id: "basic",
    name: "Basic Partner",
    price: 999,
    period: "/ year",
    features: ["Up to 50 bookings/month", "Standard support", "Basic analytics", "DriveNeu ID card"],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro Navigator",
    price: 1999,
    period: "/ year",
    features: ["Unlimited bookings", "Priority support 24/7", "Advanced analytics", "Premium ID card", "Incentive programs", "Airport priority queue"],
    popular: true,
  },
  {
    id: "elite",
    name: "Elite Partner",
    price: 3999,
    period: "/ year",
    features: ["Everything in Pro", "Dedicated account manager", "Corporate tie-ups", "Top placement in app", "Luxury vehicle badge"],
    popular: false,
  },
];

export default function RegistrationFeePage() {
  const router = useRouter();
  const [selected, setSelected] = useState("pro");

  const selectedPlan = plans.find((p) => p.id === selected)!;

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", background: "#0e0e0e", minHeight: "100dvh", color: "#fff", display: "flex", flexDirection: "column", paddingBottom: 140 }}>
      {/* Header */}
      <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: 64, background: "rgba(14,14,14,0.9)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/driving-experience" style={{ textDecoration: "none" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.6)" }}>
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          </Link>
          <div>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "#FFD700", textTransform: "uppercase", display: "block" }}>Step 5 of 5</span>
            <h1 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 16, color: "#fff" }}>Choose Your Plan</h1>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, paddingTop: 96, paddingLeft: 24, paddingRight: 24, maxWidth: 480, width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>

        {/* Intro */}
        <section>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.02em", marginBottom: 8 }}>Registration Plan</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.6 }}>
            Select the plan that fits your goals. Upgrade anytime from your profile.
          </p>
        </section>

        {/* Progress */}
        <div style={{ height: 4, background: "#1e1e1e", borderRadius: 999, overflow: "hidden" }}>
          <div style={{ height: "100%", width: "100%", background: "linear-gradient(to right, #FFD700, #facc15)", borderRadius: 999 }} />
        </div>

        {/* Plan Cards */}
        <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {plans.map((plan) => {
            const isSelected = selected === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                style={{
                  background: isSelected ? "rgba(255,215,0,0.08)" : "#1a1a1a",
                  border: isSelected ? "2px solid #FFD700" : "2px solid #2a2a2a",
                  borderRadius: 16, padding: "24px", textAlign: "left", cursor: "pointer",
                  position: "relative", transition: "all 0.2s",
                  boxShadow: isSelected ? "0 0 40px rgba(255,215,0,0.08)" : "none",
                }}
              >
                {plan.popular && (
                  <div style={{ position: "absolute", top: -1, right: 20, background: "#FFD700", color: "#000", fontSize: 10, fontWeight: 800, padding: "4px 12px", borderRadius: "0 0 8px 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Most Popular
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: 18, color: isSelected ? "#FFD700" : "#fff", marginBottom: 4 }}>{plan.name}</p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                      <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 900, fontSize: 32, color: isSelected ? "#FFD700" : "#fff" }}>₹{plan.price.toLocaleString("en-IN")}</span>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>{plan.period}</span>
                    </div>
                  </div>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", border: isSelected ? "none" : "2px solid #3a3a3a", background: isSelected ? "#FFD700" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                    {isSelected && <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#000", fontVariationSettings: "'FILL' 1" }}>check</span>}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16, color: isSelected ? "#FFD700" : "rgba(255,255,255,0.3)", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <span style={{ fontSize: 13, color: isSelected ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)", fontWeight: 500 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </section>

        {/* Token note */}
        <div style={{ background: "#1a1a1a", borderRadius: 12, padding: "14px 16px", display: "flex", gap: 10, alignItems: "flex-start", border: "1px solid #2a2a2a" }}>
          <span className="material-symbols-outlined" style={{ color: "#FFD700", fontSize: 18, flexShrink: 0 }}>info</span>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
            ₹50 token amount will be collected now. The remaining balance will be deducted after your first completed trip.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ position: "fixed", bottom: 0, left: 0, width: "100%", padding: "24px", background: "linear-gradient(to top, #0e0e0e 70%, transparent)", zIndex: 40 }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Selected Plan</p>
              <p style={{ fontWeight: 800, fontSize: 16, color: "#FFD700" }}>{selectedPlan.name}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Pay Now</p>
              <p style={{ fontWeight: 800, fontSize: 20, color: "#fff" }}>₹50 <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>token</span></p>
            </div>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            style={{ width: "100%", background: "linear-gradient(135deg, #FFD700, #facc15)", color: "#000", fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 16, padding: "18px 32px", borderRadius: 12, border: "none", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em", boxShadow: "0 8px 32px rgba(255,215,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>lock</span>
            Pay ₹50 & Complete Registration
          </button>
        </div>
      </footer>
    </div>
  );
}
