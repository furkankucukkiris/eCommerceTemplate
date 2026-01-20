import prismadb from "@/lib/prismadb";
import { ProductForm } from "../components/product-form";
import { Attribute, AttributeValue, Category } from "@prisma/client";

type CategoryWithAttributes = Category & {
  attributes: (Attribute & { values: AttributeValue[] })[];
};

const ProductPage = async ({
  params
}: {
  params: Promise<{ productId: string, storeId: string }>
}) => {
  const { productId, storeId } = await params;

  // 1. Ürünü çek
  const product = await prismadb.product.findUnique({
    where: {
      id: productId 
    },
    include: {
      images: true,
      attributes: true // Ürünün seçili özelliklerini de getir
    }
  });

  // 2. Kategorileri GÜNCELLENMİŞ şekilde çek (Attributes dahil)
  const categories = (await prismadb.category.findMany({
    where: {
      storeId: storeId,
    },
    include: {
      attributes: {
        include: {
          values: true
        }
      }
    }
  })) as unknown as CategoryWithAttributes[];

  // Fiyat formatlaması (Decimal -> Number)
  const formattedProduct = product ? {
    ...product,
    price: product.price.toNumber()
  } : null;

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm 
          categories={categories} 
          initialData={formattedProduct} 
        />
      </div>
    </div>
  );
}

export default ProductPage;