"use client";

import { Header } from "../../../components/layout/Header";
import { Heading } from "../../utils/Heading";
import { useSelector } from "react-redux";
import { IRootState } from "@/redux/store";
import { Footer } from "@/components/public/Footer";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useSelector((state: IRootState) => state.auth);
  return (
    <>
      <Heading
        title={`${user?.name} profile`}
        description="Platform for students"
        keywords="Programming"
      />
      <Header />
      {children}
      <Footer />
    </>
  );
}
