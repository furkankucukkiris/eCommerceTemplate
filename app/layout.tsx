import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner"; // Toast bildirimleri için

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
    <html lang="tr">
      <body className={inter.className}>
        {/* Ana İçerik */}
        {children}
        
        {/* Toast Bildirim Bileşeni (En altta olmalı) */}
        <Toaster richColors />
      </body>
    </html>
  );
}