import type { Metadata } from "next";
import { AuthProvider } from "@/components/providers/AuthProvider";
import ToastProvider from "@/components/ui/ToastProvider";
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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>{children}</AuthProvider>
        <ToastProvider />
      </body>
    </html>
  );
}
