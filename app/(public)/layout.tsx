import { Footer } from "@/components/public/Footer";
import { Header } from "../../components/layout/Header";
import { Heading } from "../utils/Heading";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Heading
        title="ELearning"
        description="Platform for students "
        keywords="Programming"
      />
      <Header />
      {children}
      <Footer />
    </>
  );
}
