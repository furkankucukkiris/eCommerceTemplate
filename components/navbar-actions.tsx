// components/navbar-actions.tsx
"use client";

import { ShoppingBag, User } from "lucide-react";
import { useEffect, useState } from "react";
import { UserButton, useAuth } from "@clerk/nextjs"; // useAuth eklendi
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";

const NavbarActions = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const cart = useCart();
  const { userId } = useAuth(); // Kullanıcının giriş durumunu kontrol et

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return ( 
    <div className="ml-auto flex items-center gap-x-4">
      {/* Sepet Butonu - Herkese Görünür */}
      <Button onClick={() => router.push('/cart')} className="flex items-center rounded-full bg-black px-4 py-2">
        <ShoppingBag size={20} color="white" />
        <span className="ml-2 text-sm font-medium text-white">
          {cart.items.length}
        </span>
      </Button>

      {/* KULLANICI DURUMUNA GÖRE DEĞİŞEN ALAN */}
      {userId ? (
        /* Durum 1: Giriş Yapılmışsa -> Müşteri Profil Menüsü */
        <div className="flex items-center gap-x-2">
            <UserButton afterSignOutUrl="/" />
        </div>
      ) : (
        /* Durum 2: Giriş Yapılmamışsa -> Üye Ol / Giriş Yap Butonu */
        <Button 
            onClick={() => router.push('/sign-in')} 
            variant="outline" 
            className="rounded-full border-black text-black hover:bg-black hover:text-white transition"
        >
            <User size={20} className="mr-2" />
            Giriş Yap
        </Button>
      )}
    </div>
  );
}
 
export default NavbarActions;