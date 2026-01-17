import { db } from "@/lib/db";
import { ProductList } from "@/components/product-list";
import { Container } from "@/components/ui/container";
import { StoreHero } from "@/components/store-hero"; 
import { FeaturesBento } from "@/components/features-bento";

async function getProducts() {
  const products = await db.product.findMany({
    where: { isFeatured: true, isArchived: false },
    include: { category: true, images: true },
    orderBy: { createdAt: 'desc' },
    take: 8 // Ana sayfada çok yığma yapmamak için limit
  });

  return products.map((item) => ({
    ...item,
    price: item.price.toNumber(),
  }));
}

export default async function StoreHome() {
  const products = await getProducts();

  return (
    <div className="bg-gray-50/50 min-h-screen pb-10">
      
      {/* Hero Bölümü - Tam Genişlik */}
      <div className="w-full">
        <StoreHero />
      </div>

      <Container>
        <div className="space-y-16 py-10">
          
          {/* Özellikler Grid'i */}
          <section>
            <FeaturesBento />
          </section>

          {/* Öne Çıkan Ürünler */}
          <section className="flex flex-col gap-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-4 sm:px-0">
               <div>
                 <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                   Koleksiyonu Keşfet
                 </h2>
                 <p className="mt-2 text-sm text-gray-500">
                   Sezonun en dikkat çeken parçaları sizin için seçildi.
                 </p>
               </div>
               <a href="/category/all" className="text-sm font-medium hover:underline underline-offset-4">
                 Tümünü Gör &rarr;
               </a>
            </div>
            
            <div className="px-4 sm:px-0">
               <ProductList title="" items={products} />
            </div>
          </section>

        </div>
      </Container>
    </div>
  );
}