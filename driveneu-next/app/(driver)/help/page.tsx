"use client";
import { useEffect, useState } from "react";

type Faq = { id: string; category: string; question: string; answer: string };

export default function HelpPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cat) params.set("category", cat);
    fetch(`/api/help/faqs?${params}`).then((r) => r.json()).then((j) => setFaqs(j.data ?? []));
  }, [q, cat]);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold">Help Center</h1>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search FAQs..." className="w-full bg-card rounded-xl px-3 py-2" />
      <div className="flex gap-2 text-xs">
        {["", "earnings", "safety", "account"].map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`px-3 py-1 rounded-full ${cat === c ? "bg-primary text-primary-foreground" : "bg-card"}`}>
            {c || "All"}
          </button>
        ))}
      </div>
      {faqs.map((f) => (
        <details key={f.id} className="bg-card rounded-xl p-3">
          <summary className="cursor-pointer font-semibold">{f.question}</summary>
          <p className="text-sm text-muted-foreground mt-2">{f.answer}</p>
        </details>
      ))}
      <a href="/help/ticket" className="block text-center bg-primary text-primary-foreground py-3 rounded-xl font-bold">Raise a ticket</a>
    </div>
  );
}
