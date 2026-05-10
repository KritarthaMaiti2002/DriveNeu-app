"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("chandan@driveneu.test");
  const [password, setPassword] = useState("driver123");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) setErr("Invalid email or password");
    else router.push(params.get("from") || "/dashboard");
  }

  return (
    <main className="min-h-screen grid place-items-center px-5">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 bg-card rounded-2xl p-6 shadow-card">
        <h1 className="font-display text-2xl font-bold">Driver login</h1>
        <input className="w-full bg-muted rounded-lg px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required />
        <input className="w-full bg-muted rounded-lg px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required />
        {err && <p className="text-red-400 text-sm">{err}</p>}
        <button className="w-full bg-primary text-primary-foreground rounded-lg py-2 font-semibold">Sign in</button>
        <p className="text-xs text-muted-foreground">Seeded demo: chandan@driveneu.test / driver123</p>
      </form>
    </main>
  );
}
