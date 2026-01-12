"use server";

import { db } from "@/lib/db"; // Prisma client instance'ınızın olduğu yer
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Zod şemamız (Validation için)
const productSchema = z.object({
  name: z.string().min(2, {
    message: "Ürün adı en az 2 karakter olmalıdır.",
  }),
  price: z.coerce.number().min(1, {
    message: "Fiyat 1'den büyük olmalıdır.",
  }),
  storeId: z.string(), // Hangi mağazaya ait olduğu
  // Buraya description, categoryId, images vb. eklenebilir.
});

export async function createProduct(formData: z.infer<typeof productSchema>) {
  // 1. Veriyi doğrula
  const validatedFields = productSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { error: "Geçersiz alanlar!" };
  }

  const { name, price, storeId } = validatedFields.data;

  try {
    // 2. Veritabanına kaydet
    await db.product.create({
      data: {
        name,
        price,
        storeId,
        isArchived: false,
        isFeatured: false,
      },
    });

    // 3. Cache'i temizle (Sayfayı yenilemeden veriyi güncellemek için)
    revalidatePath(`/admin/${storeId}/products`);
    
    return { success: "Ürün başarıyla oluşturuldu!" };

  } catch (error) {
    console.error("Ürün oluşturma hatası:", error);
    return { error: "Bir şeyler ters gitti." };
  }
}