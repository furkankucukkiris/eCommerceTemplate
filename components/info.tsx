"use client";

import { ShoppingCart, Star, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatter } from "@/lib/utils";

interface InfoProps {
  data: any;
}

export const Info: React.FC<InfoProps> = ({
  data
}) => {
  return ( 
    <div>
      {/* Başlık ve Stok Kodu */}
      <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
      <p className="text-xs text-muted-foreground mt-1">Ürün Kodu (SKU): AFK-{data.id.substring(0, 6).toUpperCase()}</p>

      {/* Puanlama (Dummy) */}
      <div className="mt-3 flex items-center gap-x-2">
        <div className="flex items-center text-yellow-500">
           <Star className="w-4 h-4 fill-current" />
           <Star className="w-4 h-4 fill-current" />
           <Star className="w-4 h-4 fill-current" />
           <Star className="w-4 h-4 fill-current" />
           <Star className="w-4 h-4 fill-current text-gray-300" /> {/* 4.5 Puan gibi */}
        </div>
        <p className="text-sm text-gray-500">(12 Değerlendirme)</p>
      </div>

      {/* Fiyat */}
      <div className="mt-4 flex items-end justify-between">
        <p className="text-2xl font-bold text-gray-900">
          {formatter.format(Number(data.price))}
        </p>
      </div>

      <hr className="my-4" />

      {/* Kısa Açıklama & Kategori */}
      <div className="flex flex-col gap-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          Bu ürün AFK Creative kalitesiyle üretilmiştir. Modern tasarımı ve dayanıklı yapısı ile günlük kullanım için idealdir. (Buraya veritabanından kısa açıklama gelecek)
        </p>
        
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Kategori:</h3>
          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-800">
            {data.category?.name}
          </div>
        </div>
        
        {/* Stok Durumu */}
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Durum:</h3>
          <div className="text-green-600 font-medium flex items-center gap-1">
             <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
             Stokta
          </div>
        </div>
      </div>

      {/* Sepet Butonu */}
      <div className="mt-8 flex items-center gap-x-3">
        <Button className="w-full flex items-center justify-center gap-x-2 rounded-full font-bold bg-black hover:bg-zinc-800 text-white py-6 text-lg">
          Sepete Ekle
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </div>

      {/* Güven Rozetleri (Statik) */}
      <div className="mt-8 grid grid-cols-2 gap-4">
         <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
            <Truck className="h-6 w-6 text-blue-600" />
            <div className="text-xs">
               <p className="font-bold">Hızlı Teslimat</p>
               <p className="text-gray-500">2-3 iş günü</p>
            </div>
         </div>
         <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
            <ShieldCheck className="h-6 w-6 text-green-600" />
            <div className="text-xs">
               <p className="font-bold">Garanti</p>
               <p className="text-gray-500">2 yıl garanti</p>
            </div>
         </div>
      </div>
    </div>
   );
}