"use client";

import { redirect } from "next/navigation";
import { useSelector } from "react-redux";
import { IRootState } from "@/redux/store";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useSelector((state: IRootState) => state.auth);
  if (!user?.isVerified) redirect("/");
  return (
    <>
      {children}
    </>
  );
}
