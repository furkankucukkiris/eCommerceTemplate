// app/(shop)/cart/components/summary.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import { toast } from "sonner"; // Toast kütüphanesi (varsa)

export const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  // Toplam Tutar Hesabı
  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price);
  }, 0);

  // Ödeme başarılı/başarısız dönüşleri (Stripe entegrasyonu için hazırlık)
  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Ödeme başarıyla tamamlandı.");
      removeAll();
    }

    if (searchParams.get("canceled")) {
      toast.error("Ödeme iptal edildi.");
    }
  }, [searchParams, removeAll]);

  const onCheckout = async () => {
    // Buraya ödeme entegrasyonu gelecek (Stripe / Iyzico vs.)
    toast.loading("Ödeme sayfasına yönlendiriliyor...");
    // Geçici olarak bir işlem yapmıyoruz
  };

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8 border border-gray-100 shadow-sm">
      <h2 className="text-lg font-medium text-gray-900">Sipariş Özeti</h2>
      
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Ara Toplam</div>
          <div className="text-base font-medium text-gray-900">
             {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(totalPrice)}
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-gray-600">Kargo</div>
            <div className="text-sm font-medium text-green-600">Ücretsiz</div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4">
          <div className="text-lg font-bold text-gray-900">Toplam</div>
          <div className="text-lg font-bold text-gray-900">
             {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(totalPrice)}
          </div>
      </div>

      <Button onClick={onCheckout} disabled={items.length === 0} className="w-full mt-6 bg-black hover:bg-gray-800 text-white py-6 text-lg rounded-full">
        Ödemeye Geç
      </Button>
    </div>
  );
};