"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState("desc");

  return ( 
    <div className="mt-16 w-full">
      {/* Tab Başlıkları */}
      <div className="flex border-b">
        <button 
          onClick={() => setActiveTab("desc")}
          className={cn(
            "px-6 py-3 text-sm font-medium transition-colors border-b-2",
            activeTab === "desc" 
              ? "border-black text-black" 
              : "border-transparent text-gray-500 hover:text-black"
          )}
        >
          Ürün Açıklaması
        </button>
        <button 
          onClick={() => setActiveTab("reviews")}
          className={cn(
            "px-6 py-3 text-sm font-medium transition-colors border-b-2",
            activeTab === "reviews" 
              ? "border-black text-black" 
              : "border-transparent text-gray-500 hover:text-black"
          )}
        >
          Yorumlar (12)
        </button>
        <button 
          onClick={() => setActiveTab("shipping")}
          className={cn(
            "px-6 py-3 text-sm font-medium transition-colors border-b-2",
            activeTab === "shipping" 
              ? "border-black text-black" 
              : "border-transparent text-gray-500 hover:text-black"
          )}
        >
          Teslimat & İade
        </button>
      </div>

      {/* Tab İçerikleri */}
      <div className="py-6">
        
        {/* AÇIKLAMA TAB'I */}
        {activeTab === "desc" && (
          <div className="space-y-4 text-gray-600 leading-7">
            <p>
              Bu ürün, AFK Creative tasarım ekibi tarafından özenle hazırlanmıştır. 
              Üstün malzeme kalitesi ve ergonomik yapısı sayesinde uzun yıllar kullanabilirsiniz.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Yüksek kaliteli malzeme</li>
              <li>Ergonomik tasarım</li>
              <li>Suya ve toza dayanıklı</li>
              <li>%100 Yerli Üretim</li>
            </ul>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        )}

        {/* YORUMLAR TAB'I (Dummy) */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
             <div className="border-b pb-4">
                <div className="flex items-center gap-2 mb-2">
                   <div className="font-bold">Ahmet Y.</div>
                   <div className="flex text-yellow-500 text-xs">★★★★★</div>
                   <span className="text-xs text-gray-400">12 Ocak 2026</span>
                </div>
                <p className="text-gray-600 text-sm">Ürün gerçekten harika, beklediğimden çok daha kaliteli geldi. Kargo da çok hızlıydı.</p>
             </div>

             <div className="border-b pb-4">
                <div className="flex items-center gap-2 mb-2">
                   <div className="font-bold">Ayşe K.</div>
                   <div className="flex text-yellow-500 text-xs">★★★★☆</div>
                   <span className="text-xs text-gray-400">10 Ocak 2026</span>
                </div>
                <p className="text-gray-600 text-sm">Rengi fotoğraftakinden biraz daha koyu ama yine de çok şık. Teşekkürler AFK Creative.</p>
             </div>
          </div>
        )}

        {/* TESLİMAT TAB'I */}
        {activeTab === "shipping" && (
          <div className="text-gray-600 text-sm space-y-3">
             <p><strong>Teslimat:</strong> Siparişleriniz 24 saat içinde kargoya verilir. Yurtiçi Kargo ile gönderim sağlanmaktadır.</p>
             <p><strong>İade:</strong> Ürünü teslim aldıktan sonra 14 gün içinde ücretsiz iade edebilirsiniz. İade için orijinal kutusu bozulmamış olmalıdır.</p>
          </div>
        )}

      </div>
    </div>
   );
}