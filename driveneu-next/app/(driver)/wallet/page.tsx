import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function WalletPage() {
  const s = await getServerSession(authOptions); if (!s) redirect("/login");
  const driver = await prisma.driverProfile.findUnique({
    where: { userId: s.user.id },
    include: { wallet: { include: { transactions: { orderBy: { createdAt: "desc" }, take: 50 } } } },
  });
  const bal = driver?.wallet?.balance ?? 0;
  const txns = driver?.wallet?.transactions ?? [];
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold">Wallet</h1>
      <div className="rounded-2xl bg-primary text-primary-foreground p-6 shadow-glow">
        <div className="text-xs font-bold opacity-70">CURRENT BALANCE</div>
        <div className="text-4xl font-bold">{formatINR(bal)}</div>
      </div>
      <h2 className="text-sm font-bold text-muted-foreground">Transactions</h2>
      {txns.length === 0 && <p className="text-sm text-muted-foreground">No transactions yet.</p>}
      {txns.map((t) => (
        <div key={t.id} className="flex justify-between items-center bg-card rounded-xl p-3">
          <div>
            <div className="text-sm font-semibold">{t.description}</div>
            <div className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleString()}</div>
          </div>
          <div className={`font-bold ${t.type === "DEBIT" || t.type === "PAYOUT" ? "text-red-400" : "text-green-400"}`}>
            {t.type === "DEBIT" || t.type === "PAYOUT" ? "-" : "+"}{formatINR(t.amount)}
          </div>
        </div>
      ))}
    </div>
  );
}
