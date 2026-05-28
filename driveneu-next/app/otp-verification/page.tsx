"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OTPVerificationPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(45);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  function handleChange(i: number, val: string) {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val.slice(-1);
    setOtp(newOtp);
    if (val && i < 3) inputs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    router.push("/work-selection");
  }

  const filled = otp.filter(Boolean).length;

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", background: "#0e0e0e", minHeight: "100dvh", display: "flex", flexDirection: "column", color: "#fff" }}>
      {/* Header */}
      <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, display: "flex", alignItems: "center", padding: "0 24px", height: 64, background: "#131313" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/register" style={{ textDecoration: "none" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#FFD700" }}>
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          </Link>
          <h1 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 18, color: "#FFD700", textTransform: "uppercase", letterSpacing: "0.05em" }}>Verify Phone</h1>
        </div>
      </header>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: 96, paddingLeft: 32, paddingRight: 32, maxWidth: 480, width: "100%", margin: "0 auto" }}>
        {/* Copy Block */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 28, color: "#fff", marginBottom: 12, lineHeight: 1.2 }}>Verify Phone</h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: 280 }}>
            Enter the 4-digit code sent to{" "}
            <span style={{ color: "#FFD700", fontWeight: 600 }}>+91 98765 43210</span>
          </p>
        </section>

        {/* OTP Inputs */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          <div style={{ display: "flex", gap: 16, justifyContent: "space-between" }}>
            {otp.map((digit, i) => (
              <div key={i} style={{ flex: 1, maxWidth: 72, aspectRatio: "1" }}>
                <input
                  ref={(el) => { inputs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  placeholder="-"
                  style={{
                    width: "100%", height: "100%",
                    background: "#e8e8e8",
                    textAlign: "center",
                    fontSize: 28, fontWeight: 700,
                    color: "#FFD700",
                    border: "none",
                    borderBottom: digit ? "2px solid #FFD700" : "2px solid transparent",
                    borderRadius: 8,
                    outline: "none",
                    fontFamily: "'Manrope', sans-serif",
                    boxShadow: digit ? "0 4px 20px rgba(255,231,146,0.1)" : "none",
                    transition: "all 0.2s",
                    cursor: "text",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <button
              type="submit"
              disabled={filled < 4 || loading}
              style={{
                width: "100%", padding: "16px", background: filled === 4 ? "linear-gradient(135deg, #FFD700, #facc15)" : "#2a2a2a",
                color: filled === 4 ? "#000" : "#555",
                fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 18,
                border: "none", borderRadius: 8, cursor: filled === 4 ? "pointer" : "not-allowed",
                boxShadow: filled === 4 ? "0 8px 24px rgba(255,215,0,0.2)" : "none",
                transition: "all 0.2s",
              }}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
                <span>Resend Code in</span>
                <span style={{ color: "#FFD700", fontVariantNumeric: "tabular-nums" }}>
                  00:{String(timer).padStart(2, "0")}
                </span>
              </div>
              {timer === 0 && (
                <button
                  type="button"
                  onClick={() => setTimer(45)}
                  style={{ background: "none", border: "none", borderBottom: "1px solid #FFD700", color: "#FFD700", fontWeight: 700, fontSize: 14, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'Manrope', sans-serif" }}
                >
                  Resend Code
                </button>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
