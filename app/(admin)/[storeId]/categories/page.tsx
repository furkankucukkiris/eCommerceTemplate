import { format } from "date-fns";
import { tr } from "date-fns/locale"; 

import prismadb from "@/lib/prismadb";
import { CategoryClient } from "./components/client";
import { CategoryColumn } from "./components/columns";

const CategoriesPage = async ({
  params
}: {
  // 1. DÜZELTME: params artık bir Promise tipinde olmalı
  params: Promise<{ storeId: string }>
}) => {
  
  // 2. DÜZELTME: params'ı kullanmadan önce await ile çözmeliyiz
  const { storeId } = await params;

  // 3. Veritabanı sorgusu (params.storeId yerine yukarıda çözdüğümüz storeId'yi kullanıyoruz)
  const categories = await prismadb.category.findMany({
    where: {
      storeId: storeId 
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, "d MMMM yyyy", { locale: tr }),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;