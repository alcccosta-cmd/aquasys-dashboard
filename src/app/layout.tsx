// Em src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MqttInitializer from "@/components/MqttInitializer";
import { MainLayout } from "@/components/MainLayout";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AquaSys Dashboard",
  description: "Monitoramento Hidropônico",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MqttInitializer />
          <MainLayout>{children}</MainLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}