"use client";

import { useState } from "react";
import { MessageCircle, Phone, X, MessageSquare } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Telefon ve WhatsApp bilgilerini buraya gir
  const phoneNumber = "+905555555555"; 
  const whatsappNumber = "905555555555"; // Başında + olmadan
  const whatsappMessage = "Merhaba, ürünleriniz hakkında bilgi almak istiyorum.";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      
      {/* Açılan Menü */}
      <div
        className={cn(
          "flex flex-col gap-3 transition-all duration-300 ease-in-out origin-bottom",
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        )}
      >
        {/* WhatsApp Butonu */}
        <Link
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
          target="_blank"
          className="flex items-center gap-3 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          <span className="font-medium text-sm">WhatsApp</span>
          <MessageCircle size={20} />
        </Link>

        {/* Telefon Butonu */}
        <Link
          href={`tel:${phoneNumber}`}
          className="flex items-center gap-3 bg-white text-black border border-gray-200 px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          <span className="font-medium text-sm">Hemen Ara</span>
          <Phone size={20} />
        </Link>
      </div>

      {/* Ana Tetikleyici Buton */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-full shadow-xl flex items-center justify-center transition-colors duration-300",
          isOpen ? "bg-red-500 hover:bg-red-600 text-white" : "bg-black hover:bg-gray-800 text-white"
        )}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};