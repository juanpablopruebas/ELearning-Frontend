import { SocketProvider } from "@/app/utils/SocketProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/public/Footer";

export default function CourseAccessLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <SocketProvider>{children}</SocketProvider>
      <Footer />
    </>
  );
}
