import { format } from "date-fns"; // Tarih formatlama için (npm i date-fns)
import { db } from "@/lib/db";
import { ProductColumn } from "./components/columns"; // Az önce oluşturduk
import { ProductClient } from "./components/client"; // Birazdan oluşturacağız

export default async function ProductsPage({
  params
}: {
  params: { storeId: string }
}) {
  // 1. Veriyi Prisma ile çek
  const products = await db.product.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // 2. Veriyi tablo formatına (ProductColumn) çevir
  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    price: new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(item.price.toNumber()), // Prisma Decimal tipini number'a çeviriyoruz
    createdAt: format(item.createdAt, "dd MMMM yyyy"), // Örn: 10 Ocak 2024
  }));

  // 3. Client Component'e gönder
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
}