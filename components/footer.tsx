import Link from "next/link";
import { db } from "@/lib/db";
import { Twitter, Facebook, Instagram, Youtube, Linkedin, Github, Link as LinkIcon } from "lucide-react";

const Footer = async () => {
  const currentYear = new Date().getFullYear();
  
  // Mağaza bilgisini ve sosyal linkleri çek
  const store = await db.store.findFirst({
    include: { socialLinks: true }
  });

  // Sosyal Medya İkon Eşleştirici Helper
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram className="h-5 w-5" />;
      case 'twitter': return <Twitter className="h-5 w-5" />;
      case 'facebook': return <Facebook className="h-5 w-5" />;
      case 'youtube': return <Youtube className="h-5 w-5" />;
      case 'linkedin': return <Linkedin className="h-5 w-5" />;
      case 'github': return <Github className="h-5 w-5" />;
      default: return <LinkIcon className="h-5 w-5" />; // Varsayılan ikon
    }
  };

  return (
    <footer className="bg-white border-t mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* 1. Kolon: Marka & Dinamik Sosyal Linkler */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight">
              {store?.name || "E-Store"}
            </h3>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              En trend ürünleri, en uygun fiyatlarla ve güvenilir hizmet kalitesiyle sizlere sunuyoruz.
            </p>
            
            {/* DİNAMİK SOSYAL LİNKLER */}
            {store?.socialLinks && store.socialLinks.length > 0 && (
              <div className="flex gap-4 mt-4">
                {store.socialLinks.map((link) => (
                  <a 
                    key={link.id} 
                    href={link.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-gray-400 hover:text-black transition-colors"
                  >
                    {getSocialIcon(link.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* 2. Kolon: Kurumsal */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Kurumsal</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/about" className="hover:text-black transition-colors">Hakkımızda</Link></li>
              <li><Link href="/contact" className="hover:text-black transition-colors">İletişim</Link></li>
              <li><Link href="/blog" className="hover:text-black transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* 3. Kolon: Destek */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Müşteri Hizmetleri</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/faq" className="hover:text-black transition-colors">Sıkça Sorulan Sorular</Link></li>
              <li><Link href="/shipping" className="hover:text-black transition-colors">Kargo ve Teslimat</Link></li>
              <li><Link href="/returns" className="hover:text-black transition-colors">İade ve Değişim</Link></li>
            </ul>
          </div>

          {/* 4. Kolon: Bülten */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Bültenimize Katılın</h3>
            <div className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="E-posta adresiniz" 
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
              />
              <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
                Abone Ol
              </button>
            </div>
          </div>
          
        </div>

        {/* Alt Kısım: Telif Hakkı ve AFK İmzası */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-center text-xs text-gray-500">
            &copy; {currentYear} {store?.name}. Tüm hakları saklıdır.
          </p>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Developed by</span>
            <a 
              href="https://github.com/furkankucukkiris" 
              target="_blank" 
              className="group relative inline-flex items-center justify-center px-3 py-1 text-xs font-bold text-white transition-all duration-200 bg-zinc-900 rounded hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900"
            >
              <span className="mr-1 tracking-tighter">AFK</span> 
              <span className="text-purple-400 group-hover:text-purple-300 transition-colors">Creative</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;