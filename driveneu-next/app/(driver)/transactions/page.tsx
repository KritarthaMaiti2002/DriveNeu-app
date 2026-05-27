import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const s = await getServerSession(authOptions);
  if (!s) redirect("/login");

  const driver = await prisma.driverProfile.findUnique({
    where: { userId: s.user.id },
    include: { wallet: { include: { transactions: { orderBy: { createdAt: "desc" }, take: 50 } } } },
  });
  if (!driver) return null;

  const transactions = driver.wallet?.transactions ?? [];
  const balance = driver.wallet?.balance ?? 0;
  const totalEarnings = transactions.filter((t) => t.type === "CREDIT" || t.type === "INCENTIVE").reduce((s, t) => s + t.amount, 0);
  const totalSpend = transactions.filter((t) => t.type === "DEBIT" || t.type === "PAYOUT").reduce((s, t) => s + t.amount, 0);

  // Group by date
  const grouped: Record<string, typeof transactions> = {};
  transactions.forEach((t) => {
    const key = new Date(t.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long" });
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(t);
  });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#f9f9f9", minHeight: "100dvh", paddingBottom: 96 }}>
      {/* Header */}
      <header style={{ width: "100%", position: "sticky", top: 0, zIndex: 50, background: "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button style={{ padding: 8, borderRadius: "50%", background: "none", border: "none", cursor: "pointer" }}>
            <span className="material-symbols-outlined" style={{ color: "#EAB308" }}>menu</span>
          </button>
          <h1 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 18, color: "#EAB308", letterSpacing: "-0.01em" }}>My Account</h1>
        </div>
        <button style={{ padding: 8, borderRadius: "50%", background: "none", border: "none", cursor: "pointer" }}>
          <span className="material-symbols-outlined" style={{ color: "#EAB308" }}>history_edu</span>
        </button>
      </header>

      {/* Tabs */}
      <div style={{ background: "#f9f9f9", display: "flex", borderBottom: "1px solid rgba(188,202,191,0.15)" }}>
        <Link href="/wallet" style={{ flex: 1, textDecoration: "none" }}>
          <button style={{ width: "100%", padding: "16px 0", fontFamily: "'Inter', sans-serif", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05rem", fontWeight: 500, color: "#5f5e5e", background: "none", border: "none", cursor: "pointer" }}>
            Balance
          </button>
        </Link>
        <div style={{ flex: 1 }}>
          <button style={{ width: "100%", padding: "16px 0", fontFamily: "'Inter', sans-serif", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05rem", fontWeight: 700, color: "#EAB308", background: "none", border: "none", borderBottom: "2px solid #EAB308", cursor: "pointer" }}>
            Transactions
          </button>
        </div>
      </div>

      <main style={{ maxWidth: 640, margin: "0 auto", padding: "24px", display: "flex", flexDirection: "column", gap: 32 }}>
        {/* Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: "#fde047", borderRadius: 12, padding: "16px 20px" }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05rem", color: "#422006", marginBottom: 8 }}>Total Earnings</p>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 26, fontWeight: 800, color: "#422006" }}>₹{(totalEarnings / 1000).toFixed(1)}k</p>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", boxShadow: "0 2px 8px rgba(26,28,28,0.04)" }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05rem", color: "#5f5e5e", marginBottom: 8 }}>Total Spend</p>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 26, fontWeight: 800, color: "#1a1c1c" }}>₹{(totalSpend / 1000).toFixed(1)}k</p>
          </div>
        </div>

        {/* Grouped Transactions */}
        {Object.keys(grouped).length === 0 ? (
          <div style={{ textAlign: "center", padding: 48, color: "#9ca3af" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, display: "block", marginBottom: 12 }}>receipt_long</span>
            <p>No transactions yet</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, txns]) => (
            <section key={date} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1rem", color: "rgba(61,74,65,0.6)", paddingLeft: 4 }}>{date}</h2>
              <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                {txns.map((t, i) => {
                  const isCredit = t.type === "CREDIT" || t.type === "INCENTIVE";
                  return (
                    <div key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px", borderBottom: i < txns.length - 1 ? "1px solid rgba(188,202,191,0.05)" : "none" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 14, color: "#1a1c1c", letterSpacing: "-0.01em" }}>{t.description}</p>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#3d4a41", display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: "0.05rem", opacity: 0.7 }}>
                          Ref: <span style={{ fontWeight: 500 }}>#{t.id.slice(0, 10).toUpperCase()}</span>
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 18, color: isCredit ? "#22C55E" : "#ba1a1a" }}>
                          {isCredit ? "+" : "-"} ₹{t.amount.toLocaleString("en-IN")}
                        </p>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "rgba(61,74,65,0.5)", marginTop: 2 }}>
                          {new Date(t.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}
