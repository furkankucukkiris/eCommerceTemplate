// app/(shop)/cart/components/cart-item.tsx
"use client";

import Image from "next/image";
import { X } from "lucide-react";

import { Product } from "@/types"; // Types dosyanın yerini kontrol et
import { Button } from "@/components/ui/button"; // Buton bileşeni
import useCart from "@/hooks/use-cart";
// import { Currency } from "@/components/ui/currency"; // Para birimi bileşeni (varsa)

interface CartItemProps {
    data: Product;
}

export const CartItem: React.FC<CartItemProps> = ({ data }) => {
    const cart = useCart();

    const onRemove = () => {
        cart.removeItem(data.id);
    };

    return (
        <li className="flex py-6 border-b">
            {/* Resim Alanı */}
            <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48 bg-gray-100">
                <Image
                    fill
                    src={data.images?.[0]?.url || ""} // Resim yoksa hata vermesin
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

                    <div className="mt-1 flex text-sm">
                        <p className="text-gray-500">{data.category?.name}</p>
                        {/* Varsa Beden/Renk gibi özellikleri de buraya ekleyebilirsin */}
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9 font-medium text-lg text-gray-900">
                        {/* Eğer Currency bileşenin yoksa direkt TL yazabilirsin */}
                        {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(Number(data.price))}
                    </div>
                </div>
            </div>
        </li>
    );
};