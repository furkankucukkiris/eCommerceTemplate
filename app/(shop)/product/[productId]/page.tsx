import { db } from "@/lib/db";
import { Container } from "@/components/ui/container";
import { ProductList } from "@/components/product-list";
import { Gallery } from "@/components/gallery";
import { Info } from "@/components/info";
import { ProductTabs } from "@/components/product-tabs";

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

export default async function ProductPage(props: ProductPageProps) {
  const params = await props.params;

  // 1. Ürünü Çek
  const product = await db.product.findUnique({
    where: { id: params.productId },
    include: {
      category: true,
      images: true,
      attributes: {
        include: {
          attribute: true // Özelliğin adını (Örn: "Renk") alabilmek için
        }
      }
    },
  });

  if (!product) {
    return <div className="p-10 text-center">Ürün bulunamadı.</div>;
  }

  // DÜZELTME 1: Tekil ürünün fiyatını Decimal'den Number'a çeviriyoruz
  const formattedProduct = {
    ...product,
    price: product.price.toNumber(),
  };

  // 2. Önerilen Ürünleri Çek
  const suggestedProducts = await db.product.findMany({
    where: {
      categoryId: product.category?.id,
      id: { not: product.id },
      isArchived: false,
    },
    include: {
      category: true,
      images: true
    },
    take: 4
  });

  // DÜZELTME 2: Önerilen ürünlerin fiyatlarını da çeviriyoruz
  const formattedSuggestedProducts = suggestedProducts.map((item) => ({
    ...item,
    price: item.price.toNumber(),
  }));

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            
            {/* Sol Taraf: Resim Galerisi */}
            <Gallery images={product.images} />
            
            {/* Sağ Taraf: Bilgiler (DÜZELTME: formattedProduct gönderiyoruz) */}
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <Info data={formattedProduct} />
            </div>
          </div>
          
          <ProductTabs />

          <hr className="my-10" />
          
          {/* Alt Kısım: Önerilenler (DÜZELTME: formattedSuggestedProducts gönderiyoruz) */}
          <ProductList title="Bunları da beğenebilirsiniz" items={formattedSuggestedProducts} />
        </div>
      </Container>
    </div>
  );
}