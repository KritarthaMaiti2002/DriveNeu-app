"use client";
import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function update(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");

    if (form.password !== form.confirm) {
      setErr("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      setErr("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      });
      const data = await res.json();
      if (!data.ok) { setErr(data.error || "Registration failed"); setLoading(false); return; }

      // Auto login after registration
      const login = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      if (login?.error) { setErr("Registered but login failed. Please login manually."); setLoading(false); return; }
      router.push("/dashboard");
    } catch {
      setErr("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 bg-card rounded-2xl p-6 shadow-card">
      <h1 className="font-display text-2xl font-bold">Create account</h1>
      <p className="text-sm text-muted-foreground">Join DriveNeu as a driver partner</p>

      <input
        className="w-full bg-muted rounded-lg px-3 py-2"
        name="name" value={form.name} onChange={update}
        placeholder="Full name" type="text" required
      />
      <input
        className="w-full bg-muted rounded-lg px-3 py-2"
        name="email" value={form.email} onChange={update}
        placeholder="Email address" type="email" required
      />
      <input
        className="w-full bg-muted rounded-lg px-3 py-2"
        name="phone" value={form.phone} onChange={update}
        placeholder="Phone number (optional)" type="tel"
      />
      <input
        className="w-full bg-muted rounded-lg px-3 py-2"
        name="password" value={form.password} onChange={update}
        placeholder="Password (min 8 characters)" type="password" required
      />
      <input
        className="w-full bg-muted rounded-lg px-3 py-2"
        name="confirm" value={form.confirm} onChange={update}
        placeholder="Confirm password" type="password" required
      />

      {err && <p className="text-red-400 text-sm">{err}</p>}

      <button
        className="w-full bg-primary text-primary-foreground rounded-lg py-2 font-semibold disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-semibold">Sign in</Link>
      </p>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen grid place-items-center px-5">
      <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </main>
  );
}
