import { MainNav } from "./products/components/main-nav"; // Az önce düzenlediğimiz dosya
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { storeId: string }
}) {
  // Güvenlik kontrolü: Gerçekten böyle bir mağaza var mı?
  const store = await db.store.findFirst({
    where: {
      id: params.storeId
    }
  });

  if (!store) {
    redirect('/'); // Mağaza yoksa ana sayfaya at
  }

  return (
    <>
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          {/* Sol tarafa Mağaza Değiştirici (StoreSwitcher) gelebilir */}
          <div>Mağaza: {store.name}</div> 
          
          {/* Dinamik Menümüz Burada */}
          <MainNav className="mx-6" /> 
          
          <div className="ml-auto flex items-center space-x-4">
             {/* Kullanıcı ikonu vs. */}
          </div>
        </div>
      </div>
      {children}
    </>
  );
}