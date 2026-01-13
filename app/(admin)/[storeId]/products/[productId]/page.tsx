import prismadb from "@/lib/prismadb";
import { ProductForm } from "../components/product-form";

const ProductPage = async ({
  params
}: {
  // 1. DÜZELTME: params artık bir Promise olarak tanımlanmalı
  params: Promise<{ productId: string, storeId: string }>
}) => {
  
  // 2. DÜZELTME: params'ı kullanmadan önce await etmeliyiz
  const { productId, storeId } = await params;

  // 1. Ürünü çek (Artık productId dolu geliyor)
  const product = await prismadb.product.findUnique({
    where: {
      id: productId 
    },
    include: {
      images: true 
    }
  });

  // 2. Kategorileri çek (storeId'yi de yukarıda await ettik)
  const categories = await prismadb.category.findMany({
    where: {
      storeId: storeId,
    },
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm 
          categories={categories} 
          initialData={product} 
        />
      </div>
    </div>
  );
}

export default ProductPage;