"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const experiences = [
  { id: "experienced", label: "Experienced", sub: "3–7 years", icon: "workspace_premium" },
  { id: "professional", label: "Professional", sub: "7+ years", icon: "military_tech" },
  { id: "intermediate", label: "Intermediate", sub: "1–3 years", icon: "trending_up" },
];

const specializations = [
  { id: "airport", label: "Airport Transfers", icon: "flight" },
  { id: "corporate", label: "Corporate Travel", icon: "business_center" },
  { id: "outstation", label: "Outstation", icon: "map" },
  { id: "local", label: "Local City", icon: "location_city" },
  { id: "luxury", label: "Luxury Service", icon: "star" },
  { id: "night", label: "Night Shifts", icon: "nights_stay" },
];

export default function DrivingExperiencePage() {
  const router = useRouter();
  const [selectedExp, setSelectedExp] = useState("experienced");
  const [selectedSpec, setSelectedSpec] = useState<string[]>(["airport", "corporate"]);

  function toggleSpec(id: string) {
    setSelectedSpec((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", background: "#0e0e0e", minHeight: "100dvh", color: "#fff", display: "flex", flexDirection: "column", paddingBottom: 120 }}>
      {/* Header */}
      <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: 64, background: "rgba(19,19,19,0.8)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/vehicle-selection" style={{ textDecoration: "none" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.6)" }}>
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          </Link>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "#FFD700", textTransform: "uppercase" }}>Step 4 of 5</span>
            <h1 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 16, color: "#fff", letterSpacing: "-0.01em" }}>Your Driving Experience</h1>
          </div>
        </div>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.6)" }}>
          <span className="material-symbols-outlined">help_outline</span>
        </button>
      </header>

      <main style={{ flex: 1, paddingTop: 96, paddingLeft: 24, paddingRight: 24, maxWidth: 640, width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: 48 }}>

        {/* Intro */}
        <section>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.6 }}>
            Help us match you with the best trips based on your professional driving history and comfort level.
          </p>
        </section>

        {/* Experience Level */}
        <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Experience Level</label>
            <span style={{ fontSize: 10, color: "rgba(255,215,0,0.6)" }}>Select One</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {experiences.map((exp) => {
              const isSelected = selectedExp === exp.id;
              return (
                <button
                  key={exp.id}
                  onClick={() => setSelectedExp(exp.id)}
                  style={{
                    background: "#1e1e1e",
                    border: isSelected ? "2px solid #FFD700" : "2px solid transparent",
                    borderRadius: 12, padding: "20px", textAlign: "left", cursor: "pointer",
                    position: "relative", transition: "all 0.2s",
                  }}
                >
                  {isSelected && (
                    <div style={{ position: "absolute", top: 12, right: 12 }}>
                      <span className="material-symbols-outlined" style={{ color: "#FFD700", fontSize: 18, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  )}
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: isSelected ? "rgba(255,215,0,0.15)" : "#2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                    <span className="material-symbols-outlined" style={{ color: isSelected ? "#FFD700" : "rgba(255,255,255,0.4)", fontSize: 20, fontVariationSettings: "'FILL' 1" }}>{exp.icon}</span>
                  </div>
                  <p style={{ fontWeight: 700, fontSize: 15, color: isSelected ? "#FFD700" : "#fff", marginBottom: 4 }}>{exp.label}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{exp.sub}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Specializations */}
        <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Specializations</label>
            <span style={{ fontSize: 10, color: "rgba(255,215,0,0.6)" }}>Select All That Apply</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {specializations.map((spec) => {
              const isSelected = selectedSpec.includes(spec.id);
              return (
                <button
                  key={spec.id}
                  onClick={() => toggleSpec(spec.id)}
                  style={{
                    background: isSelected ? "rgba(255,215,0,0.1)" : "#1e1e1e",
                    border: isSelected ? "1.5px solid #FFD700" : "1.5px solid transparent",
                    borderRadius: 10, padding: "14px 10px", textAlign: "center", cursor: "pointer", transition: "all 0.2s",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ color: isSelected ? "#FFD700" : "rgba(255,255,255,0.4)", fontSize: 20, display: "block", marginBottom: 6, fontVariationSettings: "'FILL' 1" }}>{spec.icon}</span>
                  <p style={{ fontSize: 11, fontWeight: 600, color: isSelected ? "#FFD700" : "rgba(255,255,255,0.7)", lineHeight: 1.3 }}>{spec.label}</p>
                </button>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ position: "fixed", bottom: 0, left: 0, width: "100%", padding: "32px 24px", background: "linear-gradient(to top, #0e0e0e 60%, transparent)", zIndex: 40 }}>
        <button
          onClick={() => router.push("/registration-fee")}
          style={{ width: "100%", maxWidth: 640, margin: "0 auto", display: "block", background: "linear-gradient(135deg, #FFD700, #facc15)", color: "#000", fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 16, padding: "18px 32px", borderRadius: 12, border: "none", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em", boxShadow: "0 8px 32px rgba(255,215,0,0.3)" }}
        >
          Continue →
        </button>
      </footer>
    </div>
  );
}
