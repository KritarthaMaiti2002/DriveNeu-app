"use client";
import { useState } from "react";
import { BottomNav } from "@/components/driver/BottomNav";
import { SideNav } from "@/components/driver/SideNav";

interface DriverLayoutClientProps {
  children: React.ReactNode;
  driverName: string;
  partnerId: string;
  tier: string;
}

export function DriverLayoutClient({ children, driverName, partnerId, tier }: DriverLayoutClientProps) {
  const [sideNavOpen, setSideNavOpen] = useState(false);

  return (
    <>
      {sideNavOpen && (
        <SideNav
          driverName={driverName}
          partnerId={partnerId}
          tier={tier}
          isOpen={sideNavOpen}
          onClose={() => setSideNavOpen(false)}
        />
      )}
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px", paddingBottom: 96, paddingTop: 16 }}>
        {children}
      </div>
      <BottomNav onMenuClick={() => setSideNavOpen(true)} />
    </>
  );
}
