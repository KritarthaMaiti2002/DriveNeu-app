import { BottomNav } from "@/components/driver/BottomNav";
export default function DriverLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-24 bg-background">
      <div className="mx-auto max-w-md px-5 pt-6">{children}</div>
      <BottomNav />
    </div>
  );
}
