// hooks/use-cart.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'sonner';
import { Product } from '@/types';

// YENİ: Sepet öğesi artık sadece Product değil, seçilen özelliklerini de barındırıyor.
export interface CartItem extends Product {
  selectedOptions?: string; // Örn: "Renk: Kırmızı"
}

interface CartStore {
  items: CartItem[];
  // addItem fonksiyonu artık opsiyonel olarak seçenekleri de alıyor
  addItem: (data: Product, options?: string) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: Product, options?: string) => { // options parametresi eklendi
        const currentItems = get().items;
        // Aynı ürün ID'si VE aynı özelliklere sahip ürün var mı?
        const existingItem = currentItems.find((item) => item.id === data.id && item.selectedOptions === options);

        if (existingItem) {
          return toast.error("Bu ürün zaten sepetinizde.");
        }

        // Ürün verisine seçilen opsiyonları ekleyip kaydediyoruz
        const cartItem: CartItem = { ...data, selectedOptions: options };

        set({ items: [...get().items, cartItem] });
        toast.success("Ürün sepete eklendi.");
      },
      removeItem: (id: string) => {
        // ID'ye göre silme (Gelişmiş versiyonda opsiyona göre silme de yapılabilir)
        set({ items: [...get().items.filter((item) => item.id !== id)] });
        toast.success("Ürün sepetten çıkarıldı.");
      },
      removeAll: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;