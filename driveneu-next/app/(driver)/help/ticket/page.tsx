"use client";
import { useState } from "react";
export default function NewTicket() {
  const [form, setForm] = useState({ subject: "", body: "", category: "account" });
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/help/tickets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const j = await r.json();
    setMsg(j.ok ? "Ticket created" : j.error || "Error");
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <h1 className="font-display text-2xl font-bold">Raise a ticket</h1>
      <input className="w-full bg-card rounded-lg px-3 py-2" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
      <select className="w-full bg-card rounded-lg px-3 py-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
        <option value="earnings">Earnings</option><option value="safety">Safety</option><option value="account">Account</option><option value="other">Other</option>
      </select>
      <textarea className="w-full bg-card rounded-lg px-3 py-2 min-h-32" placeholder="Describe your issue..." value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
      <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-bold">Submit</button>
      {msg && <p className="text-sm">{msg}</p>}
    </form>
  );
}
