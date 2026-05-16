import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search, Calendar, DollarSign, Shield, Lock, ChevronRight, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HelpPage() {
  const s = await getServerSession(authOptions);
  if (!s) redirect("/login");

  const faqs = await prisma.fAQ.findMany({ take: 6 });

  const categories = [
    { label: "Current Booking", icon: Calendar, color: "#FFF3CD", iconColor: "#D4A017" },
    { label: "Earnings & Payments", icon: DollarSign, color: "#FFF3CD", iconColor: "#D4A017" },
    { label: "Account & Security", icon: Lock, color: "#FFF3CD", iconColor: "#D4A017" },
    { label: "Safety", icon: Shield, color: "#FFF3CD", iconColor: "#D4A017" },
  ];

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "50%", background: "#fff", border: "1px solid #f0ede8", textDecoration: "none" }}>
            <ArrowLeft style={{ width: 18, height: 18, color: "#F5A623" }} />
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#F5A623" }}>Help Center</h1>
        </div>
        <button style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "50%", background: "transparent", border: "none", cursor: "pointer" }}>
          <Search style={{ width: 20, height: 20, color: "#374151" }} />
        </button>
      </div>

      {/* Hero */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#D4A017", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Velocity Support</p>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 16 }}>How can we help?</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: "1px solid #f0ede8", borderRadius: 14, padding: "12px 16px" }}>
          <Search style={{ width: 18, height: 18, color: "#9ca3af" }} />
          <span style={{ fontSize: 15, color: "#9ca3af" }}>Search help topics...</span>
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
        {categories.map((cat) => (
          <div key={cat.label} style={{ background: "#fff", borderRadius: 16, padding: "20px 16px", border: "1px solid #f0ede8", cursor: "pointer" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: cat.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <cat.icon style={{ width: 22, height: 22, color: cat.iconColor }} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", lineHeight: 1.3 }}>{cat.label}</p>
          </div>
        ))}
      </div>

      {/* FAQs */}
      <div style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 14 }}>Frequently Asked Questions</h3>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f0ede8", overflow: "hidden" }}>
          {faqs.map((faq, i) => (
            <div key={faq.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderBottom: i < faqs.length - 1 ? "1px solid #f9fafb" : "none", cursor: "pointer" }}>
              <span style={{ fontSize: 15, color: "#374151", fontWeight: 500 }}>{faq.question}</span>
              <ChevronRight style={{ width: 18, height: 18, color: "#9ca3af", flexShrink: 0, marginLeft: 8 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Safety guide banner */}
      <div style={{ background: "#1a1a2e", borderRadius: 20, padding: "20px", marginBottom: 28, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(245,166,35,0.15), transparent)" }} />
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Velocity Partner Safety Guide</h3>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 14 }}>Everything you need to know about staying safe on the road.</p>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#F5A623", cursor: "pointer" }}>Read more →</span>
      </div>

      {/* Still need help */}
      <div style={{ marginBottom: 8 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 6 }}>Still need help?</h3>
        <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 16 }}>Our support team is available 24/7.</p>
        <Link href="/help/ticket" style={{ textDecoration: "none", display: "block" }}>
          <div style={{ background: "#F5A623", borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <MessageCircle style={{ width: 20, height: 20, color: "#1a1a1a" }} />
            <span style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>Contact Support</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
