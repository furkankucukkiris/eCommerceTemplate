"use client";

import Image from "next/image";
import { useState } from "react";
import { GalleryTab } from "@/components/gallery/gallery-tab";

interface GalleryProps {
  images: any[];
}

export const Gallery: React.FC<GalleryProps> = ({
  images
}) => {
  // Varsayılan olarak ilk resmi göster
  const [mainImage, setMainImage] = useState(images[0]);

  return ( 
    <div className="flex flex-col-reverse">
      {/* Alt Taraftaki Küçük Resimler (Thumbnails) */}
      <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
        <div className="grid grid-cols-4 gap-6">
          {images.map((image) => (
            <GalleryTab 
              key={image.id} 
              image={image} 
              selected={image.id === mainImage.id}
              onClick={() => setMainImage(image)}
            />
          ))}
        </div>
      </div>
      
      {/* Büyük Resim Alanı */}
      <div className="aspect-square w-full relative h-full w-full sm:rounded-lg overflow-hidden border bg-gray-100">
        {mainImage ? (
           <Image
             fill
             src={mainImage.url}
             alt="Product Image"
             className="object-cover object-center"
           />
        ) : (
           <div className="flex items-center justify-center h-full text-gray-400">Görsel Yok</div>
        )}
      </div>
    </div>
  );
}