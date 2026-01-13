"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Expand, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatter } from "@/lib/utils";
// Typescript hatası almamak için Product tipini Prisma'dan değil manuel tanımlayalım veya any geçelim şimdilik
// Gerçek projede: import { Product } from "@prisma/client";

interface ProductCardProps {
  data: any; // Şimdilik any kullanalım, production'da düzelteceğiz
}

export const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/product/${data.id}`);
  };

  return ( 
    <div onClick={handleClick} className="bg-white group cursor-pointer rounded-xl border p-3 space-y-4 shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Resim Alanı */}
      <div className="aspect-square rounded-xl bg-gray-100 relative">
        {data.images?.[0]?.url ? (
            <Image 
            src={data.images?.[0]?.url} 
            alt={data.name} 
            fill 
            className="aspect-square object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
            />
        ) : (
            <div className="flex h-full items-center justify-center text-gray-400 text-xs">Görsel Yok</div>
        )}
        
        {/* Hover Butonları */}
        <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
          <div className="flex gap-x-6 justify-center">
            <Button variant="default" size="icon" className="bg-white hover:bg-gray-100 text-black shadow-md rounded-full">
               <Expand className="h-5 w-5" />
            </Button>
            <Button variant="default" size="icon" className="bg-black hover:bg-gray-800 text-white shadow-md rounded-full">
               <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Bilgi Alanı */}
      <div>
        <p className="font-semibold text-lg truncate">{data.name}</p>
        <p className="text-sm text-gray-500">{data.category?.name}</p>
      </div>
      
      {/* Fiyat */}
      <div className="flex items-center justify-between">
        <div className="font-bold text-black">
           {formatter.format(Number(data.price))}
        </div>
      </div>
    </div>
  );
}