"use client";

import { ShoppingBag, Search, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";

const NavbarActions = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();
  const cart = useCart();

  if (!isMounted) {
    return null;
  }

  return (
    <div className="ml-auto flex items-center gap-x-4">
      {/* Arama Butonu - İsteğe bağlı işlev eklenebilir */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-black hover:text-gray-600 hover:bg-transparent"
      >
        <Search className="h-5 w-5" />
      </Button>

      {/* Profil / Giriş */}
      <Button 
        onClick={() => router.push("/sign-in")}
        variant="ghost" 
        size="icon"
        className="text-black hover:text-gray-600 hover:bg-transparent"
      >
        <User className="h-5 w-5" />
      </Button>

      {/* Sepet */}
      <Button 
        onClick={() => router.push("/cart")} 
        className="flex items-center rounded-full bg-black px-4 py-2 text-white hover:bg-gray-800 hover:scale-105 transition-all shadow-md"
      >
        <ShoppingBag className="h-4 w-4 mr-2" />
        <span className="text-sm font-medium">
          {cart.items.length}
        </span>
      </Button>
    </div>
  );
};

export default NavbarActions;