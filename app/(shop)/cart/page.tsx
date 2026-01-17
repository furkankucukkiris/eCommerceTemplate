// app/(shop)/cart/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import useCart from "@/hooks/use-cart";
import { Summary } from "./components/summary"; // Birazdan oluşturacağız
import { CartItem } from "./components/cart-item"; // Birazdan oluşturacağız

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="bg-white min-h-[80vh]">
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-black mb-8">Alışveriş Sepeti</h1>
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
            
            {/* Ürün Listesi */}
            <div className="lg:col-span-7">
              {cart.items.length === 0 && (
                <p className="text-neutral-500">Sepetinizde henüz ürün bulunmamaktadır.</p>
              )}
              <ul>
                {cart.items.map((item) => (
                  <CartItem key={item.id} data={item} />
                ))}
              </ul>
            </div>

            {/* Sipariş Özeti */}
            <div className="lg:col-span-5 mt-8 lg:mt-0">
               <Summary />
            </div>

          </div>
        </div>
      </Container>
    </div>
  );
}