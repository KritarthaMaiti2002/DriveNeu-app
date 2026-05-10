export function DriverHeader({ name, partnerId, tier, status }: { name: string; partnerId: string; tier: string; status: string }) {
  return (
    <header className="flex items-center justify-between">
      <div>
        <div className="text-xs text-muted-foreground">PARTNER #{partnerId} · {tier}</div>
        <h1 className="font-display text-xl font-bold">Hi, {name.split(" ")[0]} 👋</h1>
      </div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${status === "ONLINE" ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
        {status}
      </span>
    </header>
  );
}
