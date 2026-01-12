"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2, {
    message: "Ürün adı en az 2 karakter olmalıdır.",
  }),
  price: z.coerce.number().min(1, {
    message: "Fiyat 1'den büyük olmalıdır.",
  }),
  storeId: z.string(),
  // YENİ: Resim dizisi şeması (obje listesi olarak bekliyoruz)
  images: z.object({ url: z.string() }).array(), 
});

export async function createProduct(formData: z.infer<typeof productSchema>) {
  const validatedFields = productSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { error: "Geçersiz alanlar!" };
  }

  // images'i de veriden çekiyoruz
  const { name, price, storeId, images } = validatedFields.data;

  try {
    await db.product.create({
      data: {
        name,
        price,
        storeId,
        isArchived: false,
        isFeatured: false,
        // YENİ: İlişkili resimleri kaydetme mantığı
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image),
            ],
          },
        },
      },
    });

    revalidatePath(`/${storeId}/products`);
    
    return { success: "Ürün başarıyla oluşturuldu!" };

  } catch (error) {
    console.error("Ürün oluşturma hatası:", error);
    return { error: "Bir şeyler ters gitti." };
  }
}