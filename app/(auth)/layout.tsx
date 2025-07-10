"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { Loader } from "@/components/layout/Loader";
import { useLoadUserQuery } from "@/redux/features/api/indexApi";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data, isLoading } = useLoadUserQuery({});
  const user = data?.user;

  useEffect(() => {
    if (!isLoading && (!user || !user?.isVerified)) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user?.isVerified) return <Loader />;

  return <SessionProvider>{children}</SessionProvider>;
}
