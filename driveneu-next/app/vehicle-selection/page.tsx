"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const vehicles = [
  { id: "sedan", icon: "directions_car", label: "Sedan", sub: "Toyota Camry, Honda City" },
  { id: "suv", icon: "directions_car", label: "SUV", sub: "Fortuner, Innova, XUV700" },
  { id: "hatchback", icon: "directions_car", label: "Hatchback", sub: "Swift, Polo, i20" },
  { id: "van", icon: "airport_shuttle", label: "Van / Tempo", sub: "Kia Carnival, Force Tempo" },
  { id: "luxury", icon: "star", label: "Luxury", sub: "Mercedes, BMW, Audi" },
  { id: "ev", icon: "ev_station", label: "Electric Vehicle", sub: "Tesla, Nexon EV, Atto 3" },
];

export default function VehicleSelectionPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(["sedan"]);
  const [selectAll, setSelectAll] = useState(false);

  function toggle(id: string) {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  }

  function handleSelectAll() {
    if (selectAll) { setSelected([]); setSelectAll(false); }
    else { setSelected(vehicles.map((v) => v.id)); setSelectAll(true); }
  }

  const progress = 60;

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", background: "#131313", minHeight: "100dvh", color: "#fff", display: "flex", flexDirection: "column", paddingBottom: 120 }}>
      {/* Header */}
      <header style={{ width: "100%", position: "sticky", top: 0, zIndex: 50, background: "#131313", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/work-selection" style={{ textDecoration: "none" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#FFD700" }}>
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          </Link>
          <h1 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 18, color: "#FFD700", textTransform: "uppercase", letterSpacing: "0.05em" }}>Select Vehicles</h1>
        </div>
      </header>

      <main style={{ flex: 1, padding: "32px 24px", maxWidth: 640, width: "100%", margin: "0 auto" }}>
        {/* Progress */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "#facc15", textTransform: "uppercase" }}>Step 3 of 5</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{progress}% Complete</span>
          </div>
          <div style={{ height: 6, width: "100%", background: "#2a2a2a", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(to right, #FFD700, #facc15)", borderRadius: 999 }} />
          </div>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 30, letterSpacing: "-0.02em", marginBottom: 8 }}>Select Vehicles You Can Drive</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.6 }}>Choose all vehicle types you are comfortable driving. This helps us match you with the right leads.</p>
        </div>

        {/* Select All */}
        <div
          onClick={handleSelectAll}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px", background: "#1e1e1e", borderRadius: 12, marginBottom: 32, cursor: "pointer" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="material-symbols-outlined" style={{ color: "#FFD700" }}>checklist</span>
            <span style={{ fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: 14 }}>Select All Vehicles</span>
          </div>
          <div style={{ width: 44, height: 24, borderRadius: 999, background: selectAll ? "#FFD700" : "#3a3a3a", position: "relative", transition: "background 0.2s" }}>
            <div style={{ position: "absolute", top: 2, left: selectAll ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
          </div>
        </div>

        {/* Vehicle Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {vehicles.map((v) => {
            const isSelected = selected.includes(v.id);
            return (
              <button
                key={v.id}
                onClick={() => toggle(v.id)}
                style={{
                  background: isSelected ? "rgba(255,215,0,0.1)" : "#1e1e1e",
                  border: isSelected ? "2px solid #FFD700" : "2px solid transparent",
                  borderRadius: 12, padding: "20px 16px", textAlign: "left", cursor: "pointer",
                  position: "relative", transition: "all 0.2s",
                }}
              >
                {isSelected && (
                  <div style={{ position: "absolute", top: 8, right: 8 }}>
                    <span className="material-symbols-outlined" style={{ color: "#FFD700", fontSize: 18, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                )}
                <div style={{ width: 40, height: 40, borderRadius: 10, background: isSelected ? "rgba(255,215,0,0.15)" : "#2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <span className="material-symbols-outlined" style={{ color: isSelected ? "#FFD700" : "rgba(255,255,255,0.4)", fontVariationSettings: "'FILL' 1" }}>{v.icon}</span>
                </div>
                <p style={{ fontWeight: 700, fontSize: 15, color: isSelected ? "#FFD700" : "#fff", marginBottom: 4 }}>{v.label}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.4 }}>{v.sub}</p>
              </button>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ position: "fixed", bottom: 0, left: 0, width: "100%", padding: "32px 24px", background: "linear-gradient(to top, #131313 60%, transparent)", zIndex: 40 }}>
        <button
          onClick={() => router.push("/driving-experience")}
          disabled={selected.length === 0}
          style={{ width: "100%", maxWidth: 640, margin: "0 auto", display: "block", background: selected.length > 0 ? "linear-gradient(135deg, #FFD700, #facc15)" : "#2a2a2a", color: selected.length > 0 ? "#000" : "#555", fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 16, padding: "18px 32px", borderRadius: 12, border: "none", cursor: selected.length > 0 ? "pointer" : "not-allowed", textTransform: "uppercase", letterSpacing: "0.05em", boxShadow: selected.length > 0 ? "0 8px 32px rgba(255,215,0,0.3)" : "none" }}
        >
          Continue with {selected.length} Vehicle{selected.length !== 1 ? "s" : ""} →
        </button>
      </footer>
    </div>
  );
}
