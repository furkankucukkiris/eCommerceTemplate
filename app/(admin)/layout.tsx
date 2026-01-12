import type { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Settings, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
export const metadata: Metadata = {
  title: "Admin Panel",
  description: "E-Ticaret Yönetim Paneli",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      {/* --- MASAÜSTÜ SIDEBAR --- */}
      <aside className="hidden w-64 flex-col border-r bg-slate-950 text-white md:flex">
        <div className="flex h-16 items-center border-b border-slate-800 px-6">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-blue-500">E-Ticaret</span>Admin
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-2 p-4">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
          >
            <Package className="h-5 w-5" />
            Ürünler
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
          >
            <ShoppingCart className="h-5 w-5" />
            Siparişler
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
          >
            <Settings className="h-5 w-5" />
            Ayarlar
          </Link>
        </nav>
      </aside>

      {/* --- MOBİL HEADER & İÇERİK --- */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-white px-6 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menüyü Aç</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-slate-950 text-white border-r-slate-800">
              <SheetTitle>Menü</SheetTitle>
              <nav className="grid gap-4 py-4">
                <Link href="/admin" className="flex items-center gap-2 text-lg font-bold">
                  E-Ticaret Admin
                </Link>
                {/* Mobil Menü Linkleri (Aynısı) */}
                <Link href="/admin" className="flex items-center gap-3 text-slate-300 hover:text-white">
                  <LayoutDashboard className="h-5 w-5" /> Dashboard
                </Link>
                <Link href="/admin/products" className="flex items-center gap-3 text-slate-300 hover:text-white">
                  <Package className="h-5 w-5" /> Ürünler
                </Link>
                <Link href="/admin/orders" className="flex items-center gap-3 text-slate-300 hover:text-white">
                  <ShoppingCart className="h-5 w-5" /> Siparişler
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <span className="font-bold">Yönetim Paneli</span>
        </header>

        {/* Sayfa İçeriği */}
        <main className="flex-1 bg-slate-50 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}