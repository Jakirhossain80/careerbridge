import type { Metadata } from "next";
import { AuthProvider } from "@/components/providers/AuthProvider";
import ToastProvider from "@/components/ui/ToastProvider";
import { themeInitializerScript } from "@/lib/theme";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerBridge",
  description: "Connect career goals with practical skills and opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <ToastProvider />
      </body>
    </html>
  );
}
