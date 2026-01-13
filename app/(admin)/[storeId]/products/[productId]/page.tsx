import prismadb from "@/lib/prismadb";
import { ProductForm } from "../components/product-form";

const ProductPage = async ({
  params
}: {
  params: Promise<{ productId: string, storeId: string }>
}) => {
  const { productId, storeId } = await params;

  const product = await prismadb.product.findUnique({
    where: {
      id: productId 
    },
    include: {
      images: true 
    }
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: storeId,
    },
  });

  // DÜZELTME BURADA:
  // Eğer ürün varsa, price (Decimal) alanını number'a çeviriyoruz.
  const formattedProduct = product ? {
    ...product,
    price: product.price.toNumber()
  } : null;

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm 
          categories={categories} 
          initialData={formattedProduct} // Artık formattedProduct'ı gönderiyoruz
        />
      </div>
    </div>
  );
}

export default ProductPage;