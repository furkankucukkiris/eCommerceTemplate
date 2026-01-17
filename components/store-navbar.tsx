import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { Container } from "@/components/ui/container";
import NavbarActions from "@/components/navbar-actions";
import { ArrowRight } from "lucide-react";

export const StoreNavbar = async () => {
  const store = await db.store.findFirst({
    include: {
      categories: {
        take: 6,
        orderBy: { createdAt: "desc" },
      },
      socialLinks: true,
    },
  });

  if (!store) return null;

  return (
    <div className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-xl transition-all">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
          
          {/* 1. SOL TARAF: LOGO + İSİM GRUBU */}
          {/* mr-8 veya mr-12 ile menüden uzaklaştırıyoruz */}
          <Link href="/" className="flex items-center gap-x-3 lg:ml-0 transition-transform hover:scale-105 mr-12">
            
            {/* Logo Varsa Göster */}
            {store.logoUrl && (
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-200">
                 <Image 
                   src={store.logoUrl} 
                   alt={store.name} 
                   fill
                   className="object-cover"
                 />
              </div>
            )}
            
            {/* Mağaza Adı (Her zaman görünsün istedin) */}
            <p className="font-bold text-xl tracking-tight text-black">
              {store.name.toUpperCase()}
            </p>
          </Link>

          {/* 2. ORTA: MEGA MENÜ */}
          <nav className="hidden md:flex items-center gap-x-8">
            <div className="group h-20 flex items-center justify-center">
              <Link 
                href="/category/all" 
                className="text-sm font-medium text-gray-700 transition-colors hover:text-black group-hover:text-black py-8 border-b-2 border-transparent group-hover:border-black"
              >
                Koleksiyonlar
              </Link>

              {/* MEGA MENÜ DROPDOWN */}
              <div className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
                <div className="mx-auto max-w-7xl px-8 py-12">
                  <div className="grid grid-cols-12 gap-8">
                    
                    {/* Kategoriler */}
                    <div className="col-span-4 border-r border-gray-100 pr-8">
                      <h4 className="font-bold text-lg mb-6 tracking-tight text-gray-900">Kategoriler</h4>
                      <ul className="space-y-4">
                        {store.categories.map((category) => (
                          <li key={category.id}>
                            <Link 
                              href={`/category/${category.id}`}
                              className="group/item flex items-center justify-between text-base text-gray-500 hover:text-black transition-colors"
                            >
                              {category.name}
                              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300" />
                            </Link>
                          </li>
                        ))}
                         {store.categories.length === 0 && (
                           <li className="text-gray-400 text-sm">Henüz kategori eklenmemiş.</li>
                        )}
                        <li className="pt-4 mt-2 border-t border-gray-100">
                           <Link href="/category/all" className="text-sm font-semibold text-black underline underline-offset-4">
                             Tümünü Gör
                           </Link>
                        </li>
                      </ul>
                    </div>

                    {/* Trendler (Statik Örnek) */}
                    <div className="col-span-4 px-8">
                      <h4 className="font-bold text-lg mb-6 tracking-tight text-gray-900">Popüler</h4>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-3">
                            <p className="font-medium text-black text-sm">Yeni Gelenler</p>
                            <Link href="#" className="block text-sm text-gray-500 hover:text-black">Bu Hafta</Link>
                            <Link href="#" className="block text-sm text-gray-500 hover:text-black">Editörün Seçimi</Link>
                         </div>
                         <div className="space-y-3">
                            <p className="font-medium text-black text-sm">Fırsatlar</p>
                            <Link href="#" className="block text-sm text-red-500 hover:text-red-600 font-medium">%20 İndirim</Link>
                         </div>
                      </div>
                    </div>

                    {/* Görsel */}
                    <div className="col-span-4 relative h-64 overflow-hidden rounded-xl bg-gray-100 group/card cursor-pointer">
                      <img 
                        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" 
                        alt="Featured" 
                        className="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover/card:bg-black/30 transition-colors" />
                      <div className="absolute bottom-6 left-6 text-white">
                        <p className="font-bold text-xl mb-1">Sezon İndirimi</p>
                        <p className="text-sm text-gray-200">Seçili ürünlerde geçerli.</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            
            <Link href="/about" className="text-sm font-medium text-gray-700 transition-colors hover:text-black">Hakkımızda</Link>
            <Link href="/contact" className="text-sm font-medium text-gray-700 transition-colors hover:text-black">İletişim</Link>
          </nav>

          {/* 3. SAĞ TARAF: İKONLAR */}
          <NavbarActions />

        </div>
      </Container>
    </div>
  );
};