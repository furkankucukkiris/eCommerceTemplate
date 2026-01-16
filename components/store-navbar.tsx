import Link from "next/link";
import Image from "next/image";
import { MainNav } from "@/components/main-nav"; // Mevcut kategori navigasyonunu koruyoruz
import  NavbarActions  from "@/components/navbar-actions"; // Sepet butonu
import { Container } from "@/components/ui/container";
import { Store, Category, SocialLink } from "@prisma/client";
import { Instagram, Twitter, Facebook, Youtube, Linkedin, Globe } from "lucide-react";

interface StoreNavbarProps {
  store: Store & { 
    categories: Category[], 
    socialLinks: SocialLink[] 
  };
}

export const StoreNavbar: React.FC<StoreNavbarProps> = ({ store }) => {
  // İkon eşleştirme haritası
  const iconMap: Record<string, any> = {
    instagram: Instagram,
    twitter: Twitter,
    facebook: Facebook,
    youtube: Youtube,
    linkedin: Linkedin,
    default: Globe
  };

  return (
    <div className="border-b bg-white sticky top-0 z-50">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
          
          {/* 1. LOGO ALANI (Sol Taraf) */}
          <Link href="/" className="flex gap-x-2 lg:ml-0 items-center transition hover:opacity-75">
            {store.logoUrl ? (
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-100 shadow-sm">
                <Image 
                  fill 
                  src={store.logoUrl} 
                  alt="Logo" 
                  className="object-cover" 
                />
              </div>
            ) : null}
            <p className="font-bold text-xl uppercase tracking-widest">{store.name}</p>
          </Link>

          {/* 2. KATEGORİLER (Orta - Sadece Mobilde Gizli/Desktopta Açık) */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-8">
             <MainNav data={store.categories} />
          </div>

          {/* 3. SAĞ TARAF (Sosyal Medya + Sepet) */}
          <div className="flex items-center gap-x-4">
            
            {/* Sosyal Medya İkonları (Dinamik) */}
            <div className="hidden md:flex items-center gap-x-3 border-r pr-4 mr-1 border-gray-200">
                {store.socialLinks.map((link) => {
                    const IconComponent = iconMap[link.platform] || iconMap.default;
                    return (
                        <Link 
                            key={link.id} 
                            href={link.url} 
                            target="_blank" 
                            className="text-gray-500 hover:text-black transition-colors transform hover:scale-110"
                        >
                            <IconComponent size={20} />
                        </Link>
                    )
                })}
            </div>

            {/* Sepet Butonu */}
            <NavbarActions />
          </div>

        </div>
      </Container>
    </div>
  );
};