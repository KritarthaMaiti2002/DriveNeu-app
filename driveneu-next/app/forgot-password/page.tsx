"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function ForgotForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.ok) { setStatus("sent"); }
      else { setStatus("error"); setMsg(data.error || "Something went wrong"); }
    } catch {
      setStatus("error");
      setMsg("Something went wrong. Please try again.");
    }
  }

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", background: "#f9fafb" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#D4A017", textDecoration: "none", fontWeight: 600, fontSize: 14, marginBottom: 32 }}>
          <ArrowLeft style={{ width: 18, height: 18 }} />
          Back to login
        </Link>

        {status === "sent" ? (
          <div style={{ background: "#fff", borderRadius: 20, padding: "32px 24px", border: "1px solid #f0ede8", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Check your email</h1>
            <p style={{ fontSize: 15, color: "#6b7280", marginBottom: 24, lineHeight: 1.6 }}>
              We sent a password reset link to <strong>{email}</strong>. Check your inbox and click the link.
            </p>
            <p style={{ fontSize: 13, color: "#9ca3af" }}>
              Didn't receive it? Check your spam folder or{" "}
              <button onClick={() => setStatus("idle")} style={{ color: "#D4A017", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>
                try again
              </button>
            </p>
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 20, padding: "32px 24px", border: "1px solid #f0ede8" }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Forgot password?</h1>
            <p style={{ fontSize: 15, color: "#6b7280", marginBottom: 28, lineHeight: 1.6 }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={onSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Email address</label>
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ width: "100%", background: "#f9fafb", border: "1px solid #f0ede8", borderRadius: 12, padding: "12px 14px", fontSize: 15, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {status === "error" && (
                <p style={{ color: "#EF4444", fontSize: 13, marginBottom: 12 }}>{msg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                style={{ width: "100%", background: "#F5A623", border: "none", borderRadius: 12, padding: "14px", fontSize: 16, fontWeight: 800, color: "#1a1a1a", cursor: "pointer", opacity: status === "loading" ? 0.7 : 1 }}
              >
                {status === "loading" ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotForm />
    </Suspense>
  );
}
