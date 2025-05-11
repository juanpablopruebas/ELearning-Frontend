"use client";

import { redirect } from "next/navigation";
import { useSelector } from "react-redux";
import { IRootState } from "@/redux/store";
import { SessionProvider } from "next-auth/react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useSelector((state: IRootState) => state.auth);
  if (!user?.isVerified) redirect("/");
  return <SessionProvider>{children}</SessionProvider>;
}
