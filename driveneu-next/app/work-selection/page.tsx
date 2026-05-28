"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const workTypes = [
  {
    id: "b2b",
    title: "B2B COMMERCIAL",
    desc: "Enterprise-level operations focusing on corporate clients, institutional travel, and business logistics.",
    icon: "business",
  },
  {
    id: "b2c",
    title: "B2C CONSUMER",
    desc: "Consumer-facing rides for individual passengers, airport transfers, and personal travel.",
    icon: "person",
  },
  {
    id: "both",
    title: "BOTH",
    desc: "Maximize earnings by accepting both business and consumer bookings based on availability.",
    icon: "swap_horiz",
  },
];

export default function WorkSelectionPage() {
  const router = useRouter();
  const [selected, setSelected] = useState("b2b");

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", background: "#131313", minHeight: "100dvh", display: "flex", flexDirection: "column", color: "#fff", paddingBottom: 120 }}>
      {/* Header */}
      <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: 80, background: "rgba(19,19,19,0.8)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span className="material-symbols-outlined" style={{ color: "#ffe792", cursor: "pointer" }}>menu</span>
          <h1 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 20, color: "#ffe792", textTransform: "uppercase", letterSpacing: "0.1em" }}>SERVICE</h1>
        </div>
      </header>

      <main style={{ flex: 1, paddingTop: 128, paddingLeft: 24, paddingRight: 24, maxWidth: 600, width: "100%", margin: "0 auto", paddingBottom: 48 }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <span style={{ color: "#ffe792", fontWeight: 700, letterSpacing: "0.2em", fontSize: 12, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Step 04 / Selection</span>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 40, letterSpacing: "-0.02em", marginBottom: 16, lineHeight: 1.1 }}>Work Scope</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, maxWidth: 480, lineHeight: 1.6 }}>
            Define your operational target. Choose the sector that best aligns with your current portfolio strategy.
          </p>
        </div>

        {/* Selection Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
          {workTypes.map((type) => {
            const isSelected = selected === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelected(type.id)}
                style={{
                  background: isSelected ? "#FFD700" : "#1e1e1e",
                  color: isSelected ? "#000" : "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "32px",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  position: "relative",
                  boxShadow: isSelected ? "0 8px 32px rgba(255,215,0,0.2)" : "none",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 48 }}>
                  <div style={{ background: isSelected ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.05)", padding: 8, borderRadius: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: isSelected ? "#000" : "#FFD700" }}>{type.icon}</span>
                  </div>
                  {isSelected && (
                    <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.7 }}>SELECTED</span>
                  )}
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 900, fontSize: 28, letterSpacing: "-0.02em", marginBottom: 8 }}>{type.title}</h3>
                  <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.6, opacity: 0.8 }}>{type.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* Footer Button */}
      <footer style={{ position: "fixed", bottom: 0, left: 0, width: "100%", padding: "32px 24px", background: "linear-gradient(to top, #131313 60%, transparent)", zIndex: 40 }}>
        <button
          onClick={() => router.push("/vehicle-selection")}
          style={{ width: "100%", maxWidth: 600, margin: "0 auto", display: "block", background: "linear-gradient(135deg, #FFD700, #facc15)", color: "#000", fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 16, padding: "18px 32px", borderRadius: 12, border: "none", cursor: "pointer", letterSpacing: "0.05em", textTransform: "uppercase", boxShadow: "0 8px 32px rgba(255,215,0,0.3)" }}
        >
          Continue →
        </button>
      </footer>
    </div>
  );
}
