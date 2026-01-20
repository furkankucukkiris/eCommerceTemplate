// hooks/use-cart.ts

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types";
import { toast } from "sonner"; // <-- Önemli: 'react-hot-toast' yerine 'sonner'

interface CartItem extends Product {
  selectedAttributes?: Record<string, string>;
}

interface CartStore {
  items: CartItem[];
  addItem: (data: CartItem) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CartStore>((set, get) => ({
    items: [],
    addItem: (data: CartItem) => {
      const currentItems = get().items;
      const existingItem = currentItems.find((item) => item.id === data.id);

      if (existingItem) {
        return toast.error("Bu ürün zaten sepette var.");
      }

      set({ items: [...get().items, data] });
      toast.success("Ürün sepete eklendi.");
    },
    removeItem: (id: string) => {
      set({ items: [...get().items.filter((item) => item.id !== id)] });
      toast.success("Ürün sepetten çıkarıldı.");
    },
    removeAll: () => set({ items: [] }),
  }), {
    name: "cart-storage",
    storage: createJSONStorage(() => localStorage)
  })
);

export default useCart;