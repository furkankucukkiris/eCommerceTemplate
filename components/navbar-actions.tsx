"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { formatter } from "@/lib/utils";
import Image from "next/image";

export default function NavbarActions() {
  const [isMounted, setIsMounted] = useState(false);
  
  // Hydration hatasını önlemek için (Server/Client uyuşmazlığı)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cart = useCart();

  if (!isMounted) {
    return null;
  }

  // Toplam fiyatı hesapla
  const totalPrice = cart.items.reduce((total, item) => {
    return total + Number(item.price);
  }, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-full">
          <ShoppingBag className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">Sepet</span> 
          <span className="ml-1 text-sm font-medium">({cart.items.length})</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Sepetim ({cart.items.length})</SheetTitle>
        </SheetHeader>
        
        {/* Sepet İçeriği */}
        <div className="flex-1 w-full overflow-y-auto my-4 pr-2">
          {cart.items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <ShoppingBag className="h-16 w-16 text-gray-300" />
                <p className="text-neutral-500">Sepetinizde ürün bulunmamaktadır.</p>
            </div>
          )}
          <ul className="space-y-4">
            {cart.items.map((item) => (
              <li key={item.id} className="flex py-6 border-b">
                <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-24 sm:w-24 border bg-gray-100">
                  <Image
                    fill
                    src={item.images?.[0]?.url || "/placeholder.png"}
                    alt={item.name}
                    className="object-cover object-center"
                  />
                </div>
                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div className="flex justify-between">
                      <p className="text-lg font-semibold text-black">
                        {item.name}
                      </p>
                    </div>

                    <div className="mt-1 flex text-sm">
                      <p className="text-gray-500">{item.category?.name}</p>
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                        {formatter.format(Number(item.price))}
                    </p>
                  </div>
                  
                  {/* Silme Butonu */}
                  <div className="absolute top-0 right-0">
                     <Button 
                        onClick={() => cart.removeItem(item.id)}
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                     >
                        <X className="h-5 w-5" />
                     </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Alt Toplam ve Checkout Butonu */}
        {cart.items.length > 0 && (
             <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-medium text-gray-900 mb-4">
                    <p>Toplam</p>
                    <p>{formatter.format(totalPrice)}</p>
                </div>
                <Button className="w-full bg-black hover:bg-zinc-800 py-6 text-lg rounded-full">
                    Ödemeye Geç
                </Button>
             </div>
        )}
      </SheetContent>
    </Sheet>
  );
}