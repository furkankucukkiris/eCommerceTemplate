// app/(admin)/[storeId]/products/page.tsx

import { format } from "date-fns";
import { tr } from "date-fns/locale"; 
import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";

const ProductsPage = async ({
  params
}: {
  params: Promise<{ storeId: string }>
}) => {
  const { storeId } = await params;

  // 1. Ürünleri çekerken görselleri de (images) dahil ediyoruz
  const products = await prismadb.product.findMany({
    where: {
      storeId: storeId
    },
    include: {
      category: true,
      images: true, // <-- EKLENDİ: Resimleri çek
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()), 
    stock: item.stock,
    category: item.category?.name || "Kategorisiz",
    // EKLENDİ: İlk görseli al, yoksa boş string gönder
    image: item.images[0]?.url || "", 
    createdAt: format(item.createdAt, "d MMMM yyyy", { locale: tr }),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;