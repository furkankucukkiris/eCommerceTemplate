import { db } from "@/lib/db";
import { ProductList } from "@/components/product-list";
import { Container } from "@/components/ui/container"; 

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

  // DÜZELTME BURADA:
  // Prisma'dan gelen veriyi map'leyerek Decimal olan price'ı number'a çeviriyoruz.
  return products.map((item) => ({
    ...item,
    price: item.price.toNumber(), // Decimal -> Number dönüşümü
    // Eğer tarih hatası da alırsan bunları da açabilirsin:
    // createdAt: item.createdAt.toISOString(),
    // updatedAt: item.updatedAt.toISOString()
  }));
}

export default async function StoreHome() {
  const products = await getProducts();

  return (
    <Container>
      <div className="space-y-10 pb-10 pt-10">
        
        {/* Mağazanın Kendi Karşılama Alanı */}
        <div className="text-center space-y-4 py-8 md:py-12 bg-slate-50 rounded-xl mx-4 sm:mx-0">
           <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
             Koleksiyonu Keşfet
           </h1>
           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
             En yeni ürünlerimiz, en uygun fiyatlarla şimdi stoklarda.
           </p>
        </div>
        
        {/* Ürün Listesi */}
        <div className="flex flex-col gap-y-8 px-4 sm:px-0">
           <ProductList title="Öne Çıkan Ürünler" items={products} />
        </div>
      </div>
    </Container>
  );
}