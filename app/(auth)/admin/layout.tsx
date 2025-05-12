"use client";

import { Heading } from "@/app/utils/Heading";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { SocketProvider } from "@/app/utils/SocketProvider";
import { useRouter } from "next/navigation";
import { useLoadUserQuery } from "@/redux/features/api/indexApi";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Loader } from "@/components/layout/Loader";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { data, isLoading } = useLoadUserQuery({});
  const user = data?.user;

  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!isLoading && user?.role !== "admin" && !hasRedirected.current) {
      toast.error("Unauthorized: Admins only.");
      hasRedirected.current = true;
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading || user?.role !== "admin") return <Loader />;

  return (
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
  );
}
