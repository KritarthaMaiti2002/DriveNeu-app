"use client";
import { signOut } from "next-auth/react";
export default function LogoutButton() {
  return <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full bg-card border border-border py-2 rounded-xl">Sign out</button>;
}
