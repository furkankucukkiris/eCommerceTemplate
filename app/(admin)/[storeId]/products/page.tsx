import { format } from "date-fns";
import { db } from "@/lib/db";
import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";

// Fiyatı TL formatına çevirmek için yardımcı
const formatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
});

interface ProductsPageProps {
  params: Promise<{
    storeId: string;
  }>;
}

export default async function ProductsPage(props: ProductsPageProps) {
  // Next.js 15+ için params'ı await ile karşılıyoruz
  const params = await props.params;

  // Ürünleri veritabanından çekiyoruz
  const products = await db.product.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true, // Kategori ismini göstermek için
      images: true,   // YENİ: Resimleri çekiyoruz (thumbnail için şart)
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Veriyi tablo yapısına (ProductColumn) uygun hale getiriyoruz
  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    // Fiyatı sayıdan (Decimal) formatlı yazıya (String) çeviriyoruz
    price: formatter.format(item.price.toNumber()), 
    // Kategori varsa adını, yoksa boş string
    category: item.category?.name || "",
    // Tarih formatı
    createdAt: format(item.createdAt, "dd MMMM yyyy"),
    // YENİ: İlk görseli alıyoruz, yoksa boş string dönüyoruz
    image: item.images?.[0]?.url || "",
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
}