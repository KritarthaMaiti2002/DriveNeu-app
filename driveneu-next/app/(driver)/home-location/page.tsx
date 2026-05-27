"use client";
import Link from "next/link";
import { useState } from "react";

export default function HomeLocationPage() {
  const [address, setAddress] = useState("");
  const recent = [
    { name: "2842 Webster St", sub: "San Francisco, CA 94123" },
    { name: "1140 Valencia St", sub: "San Francisco, CA 94110" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#f9f9f9", minHeight: "100dvh" }}>
      {/* TopAppBar */}
      <header style={{ position: "fixed", top: 0, left: 0, width: "100%", display: "flex", alignItems: "center", padding: "0 16px", height: 64, background: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", boxShadow: "0 1px 0 rgba(0,0,0,0.05)", zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
          <Link href="/dashboard" style={{ textDecoration: "none" }}>
            <button style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: "50%", background: "none", border: "none", cursor: "pointer" }}>
              <span className="material-symbols-outlined" style={{ color: "#ca8a04" }}>arrow_back</span>
            </button>
          </Link>
          <h1 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 18, color: "#ca8a04", letterSpacing: "-0.01em" }}>Home Location</h1>
        </div>
      </header>

      <main style={{ paddingTop: 64, paddingBottom: 128, minHeight: "100dvh" }}>
        {/* Map */}
        <section style={{ position: "relative", width: "100%", height: 397, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "#e8e8e8" }}>
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #d4d4d4 0%, #c8c8c8 50%, #d0d0d0 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 80, color: "#9ca3af" }}>map</span>
            </div>
          </div>

          {/* Map Center Pin */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ background: "#EAB308", padding: 12, borderRadius: "50%", boxShadow: "0 4px 16px rgba(234,179,8,0.4)", border: "4px solid #fff" }}>
                <span className="material-symbols-outlined" style={{ color: "#000", fontVariationSettings: "'FILL' 1" }}>home</span>
              </div>
              <div style={{ width: 4, height: 32, background: "#EAB308", marginTop: -4, borderRadius: 2 }} />
            </div>
          </div>

          {/* Floating Controls */}
          <div style={{ position: "absolute", right: 16, bottom: 48, display: "flex", flexDirection: "column", gap: 8 }}>
            {["my_location", "add", "remove"].map((icon) => (
              <button key={icon} style={{ background: "#fff", padding: 12, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="material-symbols-outlined" style={{ color: "#3d4a41" }}>{icon}</span>
              </button>
            ))}
          </div>

          {/* Gradient overlay */}
          <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 96, background: "linear-gradient(to bottom, transparent, #f9f9f9)" }} />
        </section>

        {/* Address Panel */}
        <section style={{ padding: "0 24px", marginTop: -32, position: "relative", zIndex: 10 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 8px 24px rgba(26,28,28,0.06)", display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Search */}
            <div>
              <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 14, color: "#3d4a41", textTransform: "uppercase", letterSpacing: "0.05rem", marginBottom: 8 }}>Home Address</label>
              <div style={{ position: "relative" }}>
                <span className="material-symbols-outlined" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#6d7a71" }}>search</span>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Search for your street address..."
                  style={{ width: "100%", background: "#f3f3f3", border: "none", borderRadius: 12, padding: "16px 16px 16px 48px", fontSize: 15, outline: "none", fontFamily: "'Inter', sans-serif", boxSizing: "border-box" }}
                />
              </div>
            </div>

            {/* Recent Searches */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h3 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 14, color: "#1a1c1c" }}>Recent Searches</h3>
              {recent.map((r) => (
                <button key={r.name} style={{ width: "100%", display: "flex", alignItems: "center", gap: 16, padding: 16, borderRadius: 12, background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                  onClick={() => setAddress(r.name)}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#e8e8e8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ color: "#6d7a71" }}>history</span>
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 14, color: "#1a1c1c" }}>{r.name}</p>
                    <p style={{ fontSize: 12, color: "#3d4a41" }}>{r.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Set Location Button */}
      <div style={{ position: "fixed", bottom: 24, left: 24, right: 24, zIndex: 40 }}>
        <button style={{ width: "100%", background: "linear-gradient(135deg, #EAB308, #facc15)", border: "none", borderRadius: 999, padding: "18px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 8px 24px rgba(234,179,8,0.3)", cursor: "pointer" }}>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 16, color: "#000" }}>Set as Home Location</span>
          <span className="material-symbols-outlined" style={{ color: "#000" }}>chevron_right</span>
        </button>
      </div>
    </div>
  );
}
