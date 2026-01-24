"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatter } from "@/lib/utils";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";

interface InfoProps {
  data: Product;
}

export const Info: React.FC<InfoProps> = ({
  data
}) => {
  const cart = useCart();

  const onAddToCart = () => {
    cart.addItem(data);
  };

  return ( 
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
      
      <div className="mt-3 flex items-end justify-between">
        <p className="text-2xl font-medium text-gray-900">
          {formatter.format(Number(data.price))}
        </p>
      </div>

      <hr className="my-4" />

      {/* GÜNCELLENEN KISIM: Özellikleri Listeleme */}
      <div className="flex flex-col gap-y-6">
        
        {/* Her bir özelliği döngüye alıp yazdırıyoruz */}
        {data.attributes?.map((attr) => (
            <div key={attr.id} className="flex items-center gap-x-4">
                <h3 className="font-semibold text-black">{attr.attribute?.name}:</h3>
                <div>{attr.name}</div> {/* Örn: "Renk: Kırmızı" */}
            </div>
        ))}

        {/* Eğer hiç özellik yoksa veya açıklama göstermek isterseniz buraya ekleyebilirsiniz */}
      </div>
      {/* ------------------------------------------- */}

      <div className="mt-10 flex items-center gap-x-3">
        <Button 
          onClick={onAddToCart} 
          className="flex items-center gap-x-2 rounded-full font-bold bg-black text-white px-8 py-3 hover:bg-zinc-800 transition"
        >
          Sepete Ekle
          <ShoppingCart size={20} />
        </Button>
      </div>
    </div>
   );
}