import prismadb from "@/lib/prismadb";
import { ProductForm } from "../components/product-form";
import { Attribute, AttributeValue, Category } from "@prisma/client";

// Tip güvenliği için tanım
type CategoryWithAttributes = Category & {
  attributes: (Attribute & { values: AttributeValue[] })[];
};

const ProductPage = async ({ 
  params 
}: { 
  params: Promise<{ storeId: string }> 
}) => {
  // Next.js 15+ standardı: params await edilmeli
  const resolvedParams = await params;

  // Kategorileri çekerken Nitelikleri (attributes) ve Değerlerini (values) DAHİL EDİYORUZ
  const categories = (await prismadb.category.findMany({
    where: {
      storeId: resolvedParams.storeId,
    },
    include: {
      attributes: {
        include: {
          values: true // Örn: Beden -> S, M, L
        }
      }
    }
  })) as unknown as CategoryWithAttributes[];

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm 
          categories={categories} 
          initialData={null} 
        />
      </div>
    </div>
  );
}

export default ProductPage;