import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Driveneu — Driver",
  description: "Track earnings, bookings, and performance.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0e1117" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
