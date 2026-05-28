"use client";
import { useState } from "react";

interface AvailableForWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (hours: number) => void;
}

export function AvailableForWorkModal({ isOpen, onClose, onSubmit }: AvailableForWorkModalProps) {
  const [hours, setHours] = useState(1);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 200,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        right: 0,
        zIndex: 201,
        background: "#fff",
        borderRadius: "24px 24px 0 0",
        padding: "32px 24px 48px",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
        maxWidth: 480,
        width: "100%",
      }}>
        {/* Handle */}
        <div style={{
          width: 40, height: 4,
          background: "#e0e0e0",
          borderRadius: 999,
          margin: "0 auto 32px",
        }} />

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800, fontSize: 24,
            color: "#1a1c1c", marginBottom: 8,
          }}>
            Available for Work
          </h2>
          <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>
            How many hours will you be available for work today?
          </p>
        </div>

        {/* Hours Selector */}
        <div style={{ marginBottom: 32 }}>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11, fontWeight: 700,
            color: "#9ca3af", textTransform: "uppercase",
            letterSpacing: "0.1em", marginBottom: 12,
          }}>
            Hours Available *
          </p>
          <div style={{
            display: "flex", alignItems: "center",
            gap: 0, background: "#f3f3f3",
            borderRadius: 16, padding: "8px",
          }}>
            {/* Minus */}
            <button
              onClick={() => setHours(Math.max(1, hours - 1))}
              style={{
                width: 56, height: 56,
                borderRadius: "50%",
                background: "#1a1c1c",
                border: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0,
              }}
            >
              <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: 24 }}>remove</span>
            </button>

            {/* Count */}
            <div style={{ flex: 1, textAlign: "center" }}>
              <p style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 900, fontSize: 40,
                color: "#1a1c1c", lineHeight: 1,
              }}>
                {hours}
              </p>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11, fontWeight: 700,
                color: "#9ca3af", textTransform: "uppercase",
                letterSpacing: "0.1em", marginTop: 4,
              }}>
                Hours
              </p>
            </div>

            {/* Plus */}
            <button
              onClick={() => setHours(Math.min(12, hours + 1))}
              style={{
                width: 56, height: 56,
                borderRadius: "50%",
                background: "#1a1c1c",
                border: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0,
              }}
            >
              <span className="material-symbols-outlined" style={{ color: "#fff", fontSize: 24 }}>add</span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={() => { onSubmit(hours); onClose(); }}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #fbc02d, #fcc934)",
            border: "none", borderRadius: 14, padding: "18px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(252,201,52,0.3)",
          }}
        >
          <span style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800, fontSize: 16,
            color: "#1a1a1a", textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}>
            Submit
          </span>
          <span className="material-symbols-outlined" style={{ color: "#1a1a1a" }}>chevron_right</span>
        </button>
      </div>
    </>
  );
}
