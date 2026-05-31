import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
export const dynamic = "force-dynamic";
export default async function WalletPage() {
  const s = await getServerSession(authOptions);
  if (!s) redirect("/login");
  const driver = await prisma.driverProfile.findUnique({ where: { userId: s.user.id }, include: { wallet: { include: { transactions: { orderBy: { createdAt: "desc" }, take: 20 } } } } });
  if (!driver) return null;
  const balance = driver.wallet?.balance ?? 0;
  const transactions = driver.wallet?.transactions ?? [];
  const menu = [
    { icon: "add_card", label: "Recharge Wallet" },
    { icon: "receipt_long", label: "Your Wallet Statement" },
    { icon: "badge", label: "Your ID Card" },
    { icon: "insights", label: "My Performance" },
    { icon: "account_balance", label: "Your Plan and Bank Details" },
  ];
  return (
    <div style={{ background: "#f9f9f9", minHeight: "100dvh", paddingBottom: 128 }}>
      <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(24px)", boxShadow: "0 1px 0 rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 64, maxWidth: 480, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/dashboard" style={{ textDecoration: "none" }}><span className="material-symbols-outlined" style={{ color: "#fbc02d" }}>arrow_back</span></Link>
            <h1 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 20, color: "#1a1c1c" }}>Account</h1>
          </div>
          <span className="material-symbols-outlined" style={{ color: "#4a473d", cursor: "pointer" }}>settings</span>
        </div>
      </header>
      <main style={{ paddingTop: 80, paddingLeft: 16, paddingRight: 16, maxWidth: 480, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 0, marginBottom: 32, borderBottom: "2px solid #eee" }}>
          <div style={{ flex: 1, textAlign: "center", paddingBottom: 12, borderBottom: "2px solid #fbc02d", marginBottom: -2 }}><span style={{ fontSize: 13, fontWeight: 700, color: "#fbc02d", textTransform: "uppercase", letterSpacing: "0.05rem" }}>Balance</span></div>
          <Link href="/transactions" style={{ flex: 1, textAlign: "center", paddingBottom: 12, textDecoration: "none" }}><span style={{ fontSize: 13, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05rem" }}>Transactions</span></Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(251,192,45,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <span className="material-symbols-outlined" style={{ color: "#fbc02d", fontSize: 32, fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
          </div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1rem", marginBottom: 8 }}>Current Balance</p>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 48, fontWeight: 900, color: "#1a1c1c" }}>₹{balance.toLocaleString("en-IN")}</h2>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", marginBottom: 24, boxShadow: "0 4px 16px rgba(26,28,28,0.04)" }}>
          {menu.map((item, i) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px", borderBottom: i < menu.length - 1 ? "1px solid #f9f9f9" : "none", cursor: "pointer" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(251,192,45,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ color: "#fbc02d", fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
              </div>
              <span style={{ flex: 1, fontFamily: "'Manrope', sans-serif", fontSize: 15, fontWeight: 600, color: "#1a1c1c" }}>{item.label}</span>
              <span className="material-symbols-outlined" style={{ color: "#9ca3af" }}>chevron_right</span>
            </div>
          ))}
        </div>
        <div style={{ background: "#1a1c1c", borderRadius: 12, padding: 24, marginBottom: 8 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#fbc02d", marginBottom: 8 }}>Professional Grade</p>
          <h4 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 14 }}>Partner Benefits</h4>
          <button style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 999, padding: "8px 20px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Explore Benefits</button>
        </div>
      </main>
    </div>
  );
}
