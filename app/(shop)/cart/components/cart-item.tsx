// app/(shop)/cart/components/cart-item.tsx

import Image from "next/image";
import { X } from "lucide-react";
// Product yerine hook dosyasındaki CartItem tipini çekiyoruz
import useCart, { CartItem as CartItemType } from "@/hooks/use-cart"; 
import { Button } from "@/components/ui/button";

interface CartItemProps {
    data: CartItemType; // Tipi güncelledik
}

export const CartItem: React.FC<CartItemProps> = ({ data }) => {
    const cart = useCart();

    const onRemove = () => {
        cart.removeItem(data.id);
    };

    return (
        <li className="flex py-6 border-b">
            {/* Resim Alanı (Aynı kalıyor) */}
            <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48 bg-gray-100">
                <Image
                    fill
                    src={data.images?.[0]?.url || ""}
                    alt={data.name}
                    className="object-cover object-center"
                />
            </div>

            {/* Bilgi Alanı */}
            <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                <div className="absolute z-10 right-0 top-0">
                    <Button
                        onClick={onRemove}
                        variant="ghost"
                        size="icon"
                        className="hover:bg-red-50 hover:text-red-500 transition"
                    >
                        <X size={20} />
                    </Button>
                </div>

                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div className="flex justify-between">
                        <p className="text-lg font-semibold text-black">{data.name}</p>
                    </div>

                    <div className="mt-1 flex flex-col text-sm">
                        <p className="text-gray-500">{data.category?.name}</p>
                        
                        {/* YENİ: Seçilen Özellikleri Göster */}
                        {data.selectedOptions && (
                           <p className="text-gray-500 border-l-2 border-gray-300 pl-2 mt-1">
                             {data.selectedOptions}
                           </p>
                        )}
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9 font-medium text-lg text-gray-900">
                        {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(Number(data.price))}
                    </div>
                </div>
            </div>
        </li>
    );
};