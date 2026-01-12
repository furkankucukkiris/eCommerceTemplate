import Link from "next/link";
import { Search, ShoppingBag, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* --- NAVBAR --- */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center px-4">
          
          {/* Mobil Menü */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden mr-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetTitle>Menü</SheetTitle>
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium hover:text-blue-600">Anasayfa</Link>
                <Link href="/shop" className="text-lg font-medium hover:text-blue-600">Tüm Ürünler</Link>
                <Link href="/categories" className="text-lg font-medium hover:text-blue-600">Kategoriler</Link>
                <Link href="/about" className="text-lg font-medium hover:text-blue-600">Hakkımızda</Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold">MAĞAZA<span className="text-blue-600">LOGO</span></span>
          </Link>

          {/* Masaüstü Menü */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-blue-600">Anasayfa</Link>
            <Link href="/shop" className="transition-colors hover:text-blue-600">Mağaza</Link>
            <Link href="/categories" className="transition-colors hover:text-blue-600">Kategoriler</Link>
          </nav>

          {/* Sağ Taraf (Arama & Sepet) */}
          <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="w-full max-w-sm hidden md:block relative">
               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
               <Input 
                 type="search" 
                 placeholder="Ürün ara..." 
                 className="pl-9 h-9 bg-gray-50 focus-visible:ring-blue-600" 
               />
            </div>
            
            <nav className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                <ShoppingBag className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Sepet</span> (0)
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Ana İçerik */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4">
          <p className="text-sm text-gray-500 text-center md:text-left">
            © 2024 E-Ticaret Şablonu. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}