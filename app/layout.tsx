import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs"; 
import { Toaster } from "@/components/ui/sonner";
import { FloatingContact } from "@/components/floating-contact";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "E-Ticaret Yönetim Paneli",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ClerkProvider EN DIŞTA olmalı
    <ClerkProvider>
      <html lang="tr">
        <body className={inter.className}>
          {children}
          <FloatingContact />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}