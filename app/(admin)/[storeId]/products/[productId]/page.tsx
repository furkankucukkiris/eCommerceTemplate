import { db } from "@/lib/db";
import { ProductForm } from "../components/product-form";

interface ProductPageProps {
  params: Promise<{
    productId: string;
    storeId: string;
  }>;
}

export default async function ProductPage(props: ProductPageProps) {
  // Next.js 15+ için params'ı await ile çözümlüyoruz
  const params = await props.params;

  // 1. Ürünü çek (Eğer "new" değilse)
  let product = null;

  if (params.productId !== "new") {
    product = await db.product.findUnique({
      where: {
        id: params.productId
      },
      include: {
        images: true // Resimler form için gerekli
      }
    });
  }

  // 2. Kategorileri çek (YENİ KISIM)
  const categories = await db.category.findMany({
    where: {
      storeId: params.storeId,
    }
  });

  // Decimal (Fiyat) hatasını önlemek için dönüşüm
  const serializedProduct = product ? {
    ...product,
    price: parseFloat(String(product.price)),
  } : null;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Kategorileri prop olarak forma gönderiyoruz */}
        <ProductForm 
          initialData={serializedProduct} 
          categories={categories} 
        />
      </div>
    </div>
  );
}