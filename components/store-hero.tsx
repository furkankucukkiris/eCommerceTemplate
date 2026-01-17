"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// Slider Verileri (İleride admin panelden de çekilebilir)
const SLIDES = [
  {
    id: 1,
    title: "Yaz Koleksiyonu 2026",
    subtitle: "Doğanın renklerinden ilham alan yeni sezon parçalarıyla tarzını yansıt.",
    // Örnek moda görseli (Unsplash)
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
    ctaText: "Koleksiyonu İncele",
    ctaLink: "/category/yaz-koleksiyonu",
    position: "center" // Yazının hizası
  },
  {
    id: 2,
    title: "Minimalist & Şık",
    subtitle: "Eviniz için sade, işlevsel ve estetik tasarımlar.",
    // Örnek dekorasyon görseli
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop",
    ctaText: "Alışverişe Başla",
    ctaLink: "/category/ev-yasam",
    position: "left"
  },
  {
    id: 3,
    title: "Teknoloji Tutkusu",
    subtitle: "Sınırları zorlayan en yeni elektronik ürünler şimdi stoklarda.",
    // Örnek teknoloji görseli
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
    ctaText: "Fırsatları Gör",
    ctaLink: "/category/elektronik",
    position: "right"
  }
];

export const StoreHero = () => {
  const [current, setCurrent] = useState(0);

  // Otomatik Geçiş (5 saniyede bir)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent(current === SLIDES.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? SLIDES.length - 1 : current - 1);
  };

  return (
    <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden bg-gray-900 text-white">
      
      {/* Slaytlar */}
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Arkaplan Resmi */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] ease-out scale-105"
            style={{ 
              backgroundImage: `url(${slide.image})`,
              // Aktif slayt ise hafifçe zoom efekti yapıyoruz (scale)
              transform: index === current ? "scale(110%)" : "scale(100%)"
            }}
          />
          
          {/* Karartma Katmanı (Overlay) - Yazının okunması için */}
          <div className="absolute inset-0 bg-black/40" />

          {/* İçerik Alanı */}
          <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <div className={`max-w-xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 ${
              slide.position === "center" ? "mx-auto text-center items-center" : 
              slide.position === "right" ? "ml-auto text-right items-end" : "text-left items-start"
            }`}>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg">
                {slide.title}
              </h1>
              
              <p className="text-lg md:text-xl text-gray-200 drop-shadow-md">
                {slide.subtitle}
              </p>
              
              <div className="pt-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-white text-black hover:bg-gray-200 hover:scale-105 transition-all duration-300 rounded-full px-8 py-6 text-lg font-semibold shadow-xl"
                >
                  <Link href={slide.ctaLink} className="flex items-center gap-2">
                    {slide.ctaText}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>

            </div>
          </div>
        </div>
      ))}

      {/* Navigasyon Okları (Sadece Masaüstünde gösterelim veya her zaman) */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md text-white transition-all hidden md:block"
      >
        <ChevronLeft size={32} />
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md text-white transition-all hidden md:block"
      >
        <ChevronRight size={32} />
      </button>

      {/* Alt Noktalar (Dots) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              current === index ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
};