"use client";

import { ShoppingCart, Star, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatter } from "@/lib/utils";
import useCart from "@/hooks/use-cart"; // Hook'u import ettik
import { Product } from "@/types";

interface InfoProps {
  data: Product; // any yerine Product tipini kullanmak daha güvenli
}

export const Info: React.FC<InfoProps> = ({
  data
}) => {
  const cart = useCart(); // Store'u çağırdık

  const onAddToCart = () => {
    cart.addItem(data);
  };

  return ( 
    <div>
      {/* ... Diğer başlık ve kod kısımları aynı kalacak ... */}
      
      <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
      {/* ... */}
      
      <div className="mt-4 flex items-end justify-between">
        <p className="text-2xl font-bold text-gray-900">
          {formatter.format(Number(data.price))}
        </p>
      </div>

      <hr className="my-4" />

      <div className="flex flex-col gap-y-4">
         {/* ... Açıklama kısımları aynı ... */}
      </div>

      {/* Sepet Butonu - GÜNCELLENDİ */}
      <div className="mt-8 flex items-center gap-x-3">
        <Button 
          onClick={onAddToCart} // Tıklama olayını bağladık
          className="w-full flex items-center justify-center gap-x-2 rounded-full font-bold bg-black hover:bg-zinc-800 text-white py-6 text-lg"
        >
          Sepete Ekle
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </div>

      {/* ... Güven rozetleri aynı ... */}
    </div>
   );
}