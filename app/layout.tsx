import "./globals.css";
import ReduxProvider from "./utils/ReduxProvider";
import { ThemeProvider } from "./utils/ThemeProvider";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`bg-gray-100 dark:bg-zinc-800`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ReduxProvider>
            {children}
            <Toaster position="top-center" reverseOrder={false} />
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
