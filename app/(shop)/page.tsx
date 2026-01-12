import { db } from "@/lib/db"; // <-- 1. db'yi global dosyamızdan çektik
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Verileri çeken fonksiyon
async function getProducts() {
  const products = await db.product.findMany({
    where: { isArchived: false },
    include: { 
      category: true,
      images: true
    },
    orderBy: { createdAt: 'desc' }
  });
  return products;
}

export default async function StoreHome() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-10">

      {/* Hero Bölümü */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          Geleceğin Teknolojisi, Bugünün Tarzı.
        </h1>
        <p className="text-xl text-muted-foreground">
          En yeni koleksiyonlarımızı keşfedin.
        </p>
      </div>

      {/* Ürün Listesi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">

            {/* Ürün Resmi */}
            <div className="relative aspect-square bg-gray-100">
              {/* Optional chaining (?.) ile güvenli erişim sağladık */}
              {product.images?.[0]?.url ? (
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">Resim Yok</div>
              )}
            </div>

            {/* Ürün Bilgileri */}
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-1">
                {product.category?.name || "Kategorisiz"}
              </p>
              <h3 className="font-semibold text-lg truncate">{product.name}</h3>
              <div className="flex items-center justify-between mt-3">
                <span className="font-bold text-lg">
                  {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(Number(product.price))}
                </span>
                <Button size="sm" variant="outline">İncele</Button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}