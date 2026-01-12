import { db } from "@/lib/db";
import { ProductForm } from "../components/product-form"; // Mevcut formunuzu kullanacağız

export default async function ProductPage({
  params
}: {
  params: { productId: string, storeId: string }
}) {
  
  // Eğer "new" değilse, veritabanından ürünü çek
  // (Next.js bazen [productId] rotasını "new" string'i ile de eşleştirebilir, 
  // ama biz klasör yapısında ayırdıysak sorun olmaz. Yine de kontrol iyidir.)
  
  let product = null;

  if (params.productId !== "new") {
    product = await db.product.findUnique({
      where: {
        id: params.productId
      },
      include: {
        images: true // Resimleri de çekmemiz şart
      }
    });
  }

  // Kategorileri çek (Select box için lazım olacak)
  const categories = await db.category.findMany({
    where: {
      storeId: params.storeId,
    }
  });

  
}