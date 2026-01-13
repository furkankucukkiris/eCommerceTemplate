// Gerekli importlar (yoluna göre düzenle)
import prismadb from "@/lib/prismadb"; 
import { ProductForm } from "../components/product-form"; 

const ProductPage = async ({ 
  params 
}: { 
  params: { storeId: string } 
}) => {
  // 1. Kategorileri veritabanından çekiyoruz
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* 2. Çektiğimiz kategorileri ve boş initialData'yı props olarak geçiyoruz */}
        <ProductForm 
          categories={categories} 
          initialData={null} 
        />
      </div>
    </div>
  );
}

export default ProductPage;