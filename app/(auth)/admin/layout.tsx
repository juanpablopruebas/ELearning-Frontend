"use client";

import { redirect } from "next/navigation";
import { useSelector } from "react-redux";
import { IRootState } from "@/redux/store";
import { Heading } from "@/app/utils/Heading";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { SocketProvider } from "@/app/utils/SocketProvider";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useSelector((state: IRootState) => state.auth);

  const isAdmin = user?.role === "admin";

  return isAdmin ? (
    <>
      <Heading
        title="ELearning"
        description="Platform for students."
        keywords="Programming"
      />
      <div className="flex">
        <AdminSidebar />
        <div className="w-full p-6">
          <SocketProvider>
            <DashboardHeader />
          </SocketProvider>
          {children}
        </div>
      </div>
    </>
  ) : (
    redirect("/")
  );
}
