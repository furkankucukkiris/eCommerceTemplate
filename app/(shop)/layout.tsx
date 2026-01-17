import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { StoreNavbar } from "@/components/store-navbar"; // Az önce oluşturduğumuz bileşen
import { FloatingContact } from "@/components/floating-contact";
import  Footer  from "@/components/footer";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  // Aktif mağazayı bul (Logo ve Sosyal Linklerle birlikte)
  const store = await db.store.findFirst({
    where: {
      // Eğer çoklu mağaza yoksa ilkini al, varsa mantığı değiştirebiliriz.
      // Şimdilik en son oluşturulan veya aktif olanı alıyoruz.
      // NOT: Eğer public bir siteyse userId kontrolü kaldırılabilir.
    },
    include: {
      categories: true,  // Navbar'daki linkler için
      socialLinks: true, // Sosyal medya ikonları için
    }
  });

  // Eğer mağaza yoksa admin paneline at (veya hata göster)
  if (!store) {
    redirect('/sign-in');
  }

  return (
    <div className="h-full">
      {/* YENİ NAVBAR */}
      <StoreNavbar />
      
      {children}
      
      <Footer />
      <FloatingContact />
    </div>
  );
}