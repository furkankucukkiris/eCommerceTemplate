"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// 1. Zod Şeması: Artık attributeIds (string array) de kabul ediyoruz
const categorySchema = z.object({
  name: z.string().min(2, {
    message: "Kategori adı en az 2 karakter olmalıdır.",
  }),
  storeId: z.string(),
  attributeIds: z.array(z.string()).optional(), // Opsiyonel seçim
});

// Kategori Oluşturma
export async function createCategory(formData: z.infer<typeof categorySchema>) {
  const validatedFields = categorySchema.safeParse(formData);

  if (!validatedFields.success) {
    return { error: "Geçersiz alanlar!" };
  }

  const { name, storeId, attributeIds } = validatedFields.data;

  try {
    await db.category.create({
      data: {
        name,
        storeId,
        // İlişkiyi kuruyoruz (Many-to-Many)
        attributes: {
          connect: attributeIds?.map((id) => ({ id })) || [],
        },
      },
    });

    revalidatePath(`/${storeId}/categories`);
    return { success: "Kategori başarıyla oluşturuldu!" };

  } catch (error) {
    console.error("Kategori oluşturma hatası:", error);
    return { error: "Bir şeyler ters gitti." };
  }
}

// Kategori Güncelleme
export const updateCategory = async (
  storeId: string,
  categoryId: string,
  data: { name: string; attributeIds?: string[] }
) => {
  try {
    // Güvenlik: Önce bu mağazaya ait böyle bir kategori var mı?
    const category = await db.category.findFirst({
      where: { id: categoryId, storeId }
    });

    if (!category) {
      throw new Error("Kategori bulunamadı veya yetkiniz yok.");
    }

    await db.category.update({
      where: { id: categoryId },
      data: { 
        name: data.name,
        // Güncelleme mantığı: Eskileri temizle (veya set ile üzerine yaz), yenileri bağla
        attributes: {
            set: data.attributeIds?.map((id) => ({ id })) || []
        }
      },
    });
    
    revalidatePath(`/${storeId}/categories`);
    return { success: true };

  } catch (error) {
    console.log("[CATEGORY_UPDATE]", error);
    throw new Error("Kategori güncellenemedi.");
  }
};

// Kategori Silme (Değişmedi ama bütünlük için ekliyorum)
export const deleteCategory = async (storeId: string, categoryId: string) => {
  try {
    const productsCount = await db.product.count({
      where: { categoryId: categoryId, storeId: storeId }
    });

    if (productsCount > 0) {
      throw new Error("Bu kategoride ürünler var. Önce ürünleri silin veya kategorisini değiştirin.");
    }

    await db.category.deleteMany({
      where: { id: categoryId, storeId: storeId },
    });

    revalidatePath(`/${storeId}/categories`);
    return { success: true };

  } catch (error: any) {
    console.log("[CATEGORY_DELETE]", error);
    throw new Error(error.message || "Kategori silinemedi.");
  }
};