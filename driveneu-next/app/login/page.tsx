"use client";
import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) { setErr("Invalid email or password"); setLoading(false); }
    else router.push(params.get("from") || "/dashboard");
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100dvh", background: "#f9f9f9", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "24px 24px 0", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fbc02d", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 900, fontSize: 18, color: "#1a1a1a" }}>DN</span>
        </div>
        <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: 18, color: "#1a1c1c" }}>DriveNeu</span>
      </header>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ maxWidth: 400, width: "100%", margin: "0 auto" }}>
          <h1 style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: 32, color: "#1a1c1c", marginBottom: 8 }}>Welcome back</h1>
          <p style={{ fontSize: 15, color: "#5f5e5e", marginBottom: 40 }}>Sign in to your DriveNeu partner account</p>

          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4a473d", marginBottom: 8 }}>Email address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                style={{ width: "100%", background: "#fff", border: "1.5px solid #eee", borderRadius: 12, padding: "14px 16px", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#4a473d" }}>Password</label>
                <Link href="/forgot-password" style={{ fontSize: 13, fontWeight: 600, color: "#fbc02d", textDecoration: "none" }}>Forgot password?</Link>
              </div>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"
                style={{ width: "100%", background: "#fff", border: "1.5px solid #eee", borderRadius: 12, padding: "14px 16px", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
            </div>

            {err && <p style={{ color: "#dc2626", fontSize: 13 }}>{err}</p>}

            <button type="submit" disabled={loading}
              style={{ width: "100%", background: "linear-gradient(135deg, #fbc02d, #fcc934)", border: "none", borderRadius: 14, padding: "16px", fontSize: 16, fontWeight: 800, color: "#1a1a1a", cursor: "pointer", marginTop: 8, fontFamily: "Manrope, sans-serif" }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#5f5e5e" }}>
            New driver? <Link href="/register" style={{ color: "#fbc02d", fontWeight: 700, textDecoration: "none" }}>Create account</Link>
          </p>

          <div style={{ marginTop: 32, padding: "12px 16px", background: "rgba(251,192,45,0.08)", borderRadius: 10, border: "1px solid rgba(251,192,45,0.2)" }}>
            <p style={{ fontSize: 12, color: "#755b00", textAlign: "center" }}>Demo: chandan@driveneu.test / driver123</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
