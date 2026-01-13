import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server"; // Import yolu doğru (/server)

import prismadb from "@/lib/prismadb";
import { SettingsClient } from "./components/settings-client";
import { format } from "date-fns";

interface SettingsPageProps {
  params: Promise<{ // Next.js 15+ ile params da Promise olabilir, await gerekebilir
    storeId: string;
  }>
}

const SettingsPage = async (props: SettingsPageProps) => {
  // 1. DÜZELTME: params'ı await ediyoruz (Next.js 15 kullanıyorsanız)
  const params = await props.params;

  // 2. DÜZELTME: auth() fonksiyonuna 'await' ekliyoruz
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId
    }
  });

  if (!store) {
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