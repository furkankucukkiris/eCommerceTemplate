import { db } from "@/lib/db";
import { ProductList } from "@/components/product-list";
import { Container } from "@/components/ui/container";
import { StoreHero } from "@/components/store-hero"; // Yeni bileşen
import { FeaturesBento } from "@/components/features-bento"; // Yeni bileşen

// Ürünleri Çeken Fonksiyon
async function getProducts() {
  const products = await db.product.findMany({
    where: { isFeatured: true, isArchived: false },
    include: { 
      category: true,
      images: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return products.map((item) => ({
    ...item,
    price: item.price.toNumber(),
  }));
}

export default async function StoreHome() {
  const products = await getProducts();

  return (
    <div className="bg-white pb-10">
      
      {/* 1. Modern Hero Alanı */}
      <StoreHero />

      {/* 2. Özellikler / Bento Grid */}
      <FeaturesBento />

      <Container>
        <div className="flex flex-col gap-y-8 px-4 sm:px-0 mt-10">
           {/* 3. Ürün Listesi */}
           {/* Başlığı biraz daha stilize edelim */}
           <div className="flex items-center justify-between mb-4">
             <div>
               <h2 className="text-3xl font-bold tracking-tight">Öne Çıkanlar</h2>
               <p className="text-sm text-muted-foreground">Bu haftanın en çok ilgi gören parçaları.</p>
             </div>
             {/* Buraya "Tümünü Gör" butonu eklenebilir */}
           </div>
           
           <ProductList title="" items={products} />
        </div>
      </Container>
    </div>
  );
}