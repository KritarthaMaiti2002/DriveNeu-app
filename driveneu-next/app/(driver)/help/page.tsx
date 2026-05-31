import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
export const dynamic = "force-dynamic";
export default async function HelpPage() {
  const s = await getServerSession(authOptions);
  if (!s) redirect("/login");
  const faqs = await prisma.fAQ.findMany({ take: 6 });
  const cats = [
    { label: "Current Booking", icon: "calendar_month" },
    { label: "Earnings & Payments", icon: "payments" },
    { label: "Account & Security", icon: "lock" },
    { label: "Safety", icon: "security" },
  ];
  return (
    <div style={{ background: "#f9f9f9", minHeight: "100dvh", paddingBottom: 128 }}>
      <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(24px)", boxShadow: "0 1px 0 rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 64, maxWidth: 480, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/dashboard" style={{ textDecoration: "none" }}><span className="material-symbols-outlined" style={{ color: "#fbc02d" }}>arrow_back</span></Link>
            <h1 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 20, color: "#fbc02d" }}>Help Center</h1>
          </div>
          <span className="material-symbols-outlined" style={{ color: "#4a473d", cursor: "pointer" }}>search</span>
        </div>
      </header>
      <main style={{ paddingTop: 80, paddingLeft: 16, paddingRight: 16, maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>
        <section>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#fbc02d", textTransform: "uppercase", letterSpacing: "0.1rem", marginBottom: 8 }}>Velocity Support</p>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 30, fontWeight: 800, color: "#1a1c1c", marginBottom: 16 }}>How can we help?</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: "14px 16px" }}>
            <span className="material-symbols-outlined" style={{ color: "#9ca3af" }}>search</span>
            <span style={{ fontSize: 15, color: "#9ca3af" }}>Search help topics...</span>
          </div>
        </section>
        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {cats.map((cat) => (
            <div key={cat.label} style={{ background: "#fff", borderRadius: 14, padding: "20px 16px", boxShadow: "0 2px 8px rgba(26,28,28,0.04)", cursor: "pointer", border: "1px solid #eee" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(251,192,45,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <span className="material-symbols-outlined" style={{ color: "#fbc02d", fontSize: 24, fontVariationSettings: "'FILL' 1" }}>{cat.icon}</span>
              </div>
              <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 15, fontWeight: 700, color: "#1a1c1c", lineHeight: 1.3 }}>{cat.label}</p>
            </div>
          ))}
        </section>
        <section>
          <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 20, fontWeight: 700, color: "#1a1c1c", marginBottom: 16 }}>Frequently Asked Questions</h3>
          <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 8px rgba(26,28,28,0.04)", border: "1px solid #eee" }}>
            {faqs.map((faq, i) => (
              <div key={faq.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: i < faqs.length - 1 ? "1px solid #f9f9f9" : "none", cursor: "pointer" }}>
                <span style={{ fontSize: 14, color: "#1a1c1c", fontWeight: 500, flex: 1 }}>{faq.question}</span>
                <span className="material-symbols-outlined" style={{ color: "#9ca3af", flexShrink: 0, marginLeft: 8 }}>chevron_right</span>
              </div>
            ))}
          </div>
        </section>
        <section style={{ position: "relative", background: "#1a1c1c", borderRadius: 14, padding: "24px", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(251,192,45,0.15), transparent)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Velocity Partner Safety Guide</h3>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 16, lineHeight: 1.6 }}>Everything you need to know about staying safe on the road.</p>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, color: "#fbc02d", padding: 0, display: "flex", alignItems: "center", gap: 4 }}>Read more <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span></button>
          </div>
        </section>
        <section>
          <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 18, fontWeight: 700, color: "#1a1c1c", marginBottom: 6 }}>Still need help?</h3>
          <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 16 }}>Our support team is available 24/7.</p>
          <Link href="/help/ticket" style={{ textDecoration: "none", display: "block" }}>
            <button style={{ width: "100%", background: "linear-gradient(135deg, #fbc02d, #fcc934)", border: "none", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer", boxShadow: "0 4px 16px rgba(252,201,52,0.3)" }}>
              <span className="material-symbols-outlined" style={{ color: "#1a1a1a" }}>support_agent</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>Contact Support</span>
            </button>
          </Link>
        </section>
      </main>
    </div>
  );
}
