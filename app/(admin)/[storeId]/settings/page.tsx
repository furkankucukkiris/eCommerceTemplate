import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server"; 
import prismadb from "@/lib/prismadb";
import { SettingsClient } from "./components/settings-client";
import { format } from "date-fns";

interface SettingsPageProps {
  params: Promise<{
    storeId: string;
  }>
}

const SettingsPage = async (props: SettingsPageProps) => {
  // Params ve Auth verilerini al
  const params = await props.params;
  const { userId } = await auth();

  // 1. KONTROL: Kullanıcı ID ve Store ID doğru geliyor mu?
  console.log("--- DEBUG START ---");
  console.log("User ID:", userId);
  console.log("Store ID (URL):", params.storeId);

  if (!userId) {
    console.log("Hata: Kullanıcı oturumu yok, sign-in'e yönlendiriliyor.");
    redirect('/sign-in');
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId
    },
    include: {
        socialLinks: true
    }
  });

  // 2. KONTROL: Mağaza bulundu mu?
  console.log("Bulunan Mağaza:", store);

  if (!store) {
    console.log("Hata: Mağaza bulunamadı veya yetkisiz erişim. Anasayfaya yönlendiriliyor.");
    redirect('/');
  }

  const attributes = await prismadb.attribute.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedAttributes = attributes.map((item) => ({
    id: item.id,
    name: item.name,
    valueType: item.valueType,
    createdAt: format(item.createdAt, "dd MMMM yyyy"),
  }));

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsClient initialData={store} attributes={formattedAttributes} />
      </div>
    </div>
  );
}

export default SettingsPage;