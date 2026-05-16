import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Settings, Wallet, FileText, CreditCard, TrendingUp, Building, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WalletPage() {
  const s = await getServerSession(authOptions);
  if (!s) redirect("/login");

  const driver = await prisma.driverProfile.findUnique({
    where: { userId: s.user.id },
    include: { wallet: { include: { transactions: { orderBy: { createdAt: "desc" }, take: 20 } } } },
  });
  if (!driver) return null;

  const balance = driver.wallet?.balance ?? 0;
  const transactions = driver.wallet?.transactions ?? [];
  const totalEarnings = transactions.filter((t) => t.type === "CREDIT" || t.type === "INCENTIVE").reduce((s, t) => s + t.amount, 0);
  const totalSpend = transactions.filter((t) => t.type === "DEBIT" || t.type === "PAYOUT").reduce((s, t) => s + t.amount, 0);

  const menuItems = [
    { icon: Wallet, label: "Recharge Wallet", color: "#FFF3CD", iconColor: "#D4A017" },
    { icon: FileText, label: "Your Wallet Statement", color: "#FFF3CD", iconColor: "#D4A017" },
    { icon: CreditCard, label: "Your ID Card", color: "#FFF3CD", iconColor: "#D4A017" },
    { icon: TrendingUp, label: "My Performance", color: "#FFF3CD", iconColor: "#D4A017" },
    { icon: Building, label: "Your Plan and Bank Details", color: "#FFF3CD", iconColor: "#D4A017" },
  ];

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "50%", background: "#fff", border: "1px solid #f0ede8", textDecoration: "none" }}>
            <ArrowLeft style={{ width: 18, height: 18, color: "#374151" }} />
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>Account</h1>
        </div>
        <button style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "50%", background: "#fff", border: "1px solid #f0ede8", cursor: "pointer" }}>
          <Settings style={{ width: 18, height: 18, color: "#374151" }} />
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 28, borderBottom: "2px solid #f0ede8" }}>
        <div style={{ flex: 1, textAlign: "center", paddingBottom: 12, borderBottom: "2px solid #F5A623", marginBottom: -2 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#D4A017", textTransform: "uppercase", letterSpacing: "0.05em" }}>Balance</span>
        </div>
        <div style={{ flex: 1, textAlign: "center", paddingBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>Transactions</span>
        </div>
      </div>

      {/* Wallet icon + balance */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#FFF3CD", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
          <Wallet style={{ width: 28, height: 28, color: "#D4A017" }} />
        </div>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Current Balance</p>
        <h2 style={{ fontSize: 42, fontWeight: 900, color: "#111827" }}>₹{balance.toLocaleString("en-IN")}</h2>
      </div>

      {/* Menu items */}
      <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f0ede8", overflow: "hidden", marginBottom: 24 }}>
        {menuItems.map((item, i) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px", borderBottom: i < menuItems.length - 1 ? "1px solid #f9fafb" : "none", cursor: "pointer" }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: item.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <item.icon style={{ width: 20, height: 20, color: item.iconColor }} />
            </div>
            <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "#111827" }}>{item.label}</span>
            <ChevronRight style={{ width: 18, height: 18, color: "#9ca3af" }} />
          </div>
        ))}
      </div>

      {/* Total stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "#F5A623", borderRadius: 16, padding: "16px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,0.6)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Total Earnings</p>
          <p style={{ fontSize: 26, fontWeight: 900, color: "#1a1a1a" }}>₹{(totalEarnings / 1000).toFixed(1)}k</p>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #f0ede8" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Total Spend</p>
          <p style={{ fontSize: 26, fontWeight: 900, color: "#111827" }}>₹{(totalSpend / 1000).toFixed(1)}k</p>
        </div>
      </div>

      {/* Recent transactions */}
      {transactions.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14 }}>Recent Transactions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {transactions.slice(0, 5).map((t) => (
              <div key={t.id} style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", border: "1px solid #f0ede8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{t.description}</p>
                  <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                    {new Date(t.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <p style={{ fontSize: 16, fontWeight: 800, color: t.type === "CREDIT" || t.type === "INCENTIVE" ? "#22C55E" : "#EF4444" }}>
                  {t.type === "CREDIT" || t.type === "INCENTIVE" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Partner benefits */}
      <div style={{ background: "#1a1a2e", borderRadius: 20, padding: "20px", marginBottom: 8 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#F5A623", marginBottom: 8 }}>Professional Grade</p>
        <h4 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 14 }}>Partner Benefits</h4>
        <button style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "10px 18px", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
          Explore Benefits
        </button>
      </div>
    </div>
  );
}
