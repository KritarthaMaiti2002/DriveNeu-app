"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setMsg("Passwords do not match"); return; }
    if (password.length < 8) { setMsg("Password must be at least 8 characters"); return; }
    setStatus("loading"); setMsg("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (data.ok) { setStatus("success"); setTimeout(() => router.push("/login"), 2000); }
      else { setStatus("error"); setMsg(data.error || "Something went wrong"); }
    } catch {
      setStatus("error");
      setMsg("Something went wrong. Please try again.");
    }
  }

  if (!token) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <p style={{ color: "#EF4444" }}>Invalid reset link. Please request a new one.</p>
        <Link href="/forgot-password" style={{ color: "#D4A017", fontWeight: 600 }}>Request new link</Link>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", background: "#f9fafb" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#D4A017", textDecoration: "none", fontWeight: 600, fontSize: 14, marginBottom: 32 }}>
          <ArrowLeft style={{ width: 18, height: 18 }} />
          Back to login
        </Link>

        <div style={{ background: "#fff", borderRadius: 20, padding: "32px 24px", border: "1px solid #f0ede8" }}>
          {status === "success" ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Password reset!</h1>
              <p style={{ fontSize: 15, color: "#6b7280" }}>Redirecting you to login...</p>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Set new password</h1>
              <p style={{ fontSize: 15, color: "#6b7280", marginBottom: 28 }}>Choose a strong password for your account.</p>
              <form onSubmit={onSubmit}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>New password</label>
                  <input
                    type="password" required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    style={{ width: "100%", background: "#f9fafb", border: "1px solid #f0ede8", borderRadius: 12, padding: "12px 14px", fontSize: 15, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Confirm password</label>
                  <input
                    type="password" required value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat password"
                    style={{ width: "100%", background: "#f9fafb", border: "1px solid #f0ede8", borderRadius: 12, padding: "12px 14px", fontSize: 15, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                {msg && <p style={{ color: "#EF4444", fontSize: 13, marginBottom: 12 }}>{msg}</p>}
                <button
                  type="submit" disabled={status === "loading"}
                  style={{ width: "100%", background: "#F5A623", border: "none", borderRadius: 12, padding: "14px", fontSize: 16, fontWeight: 800, color: "#1a1a1a", cursor: "pointer", opacity: status === "loading" ? 0.7 : 1 }}
                >
                  {status === "loading" ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetForm />
    </Suspense>
  );
}
