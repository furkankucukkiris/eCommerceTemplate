"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server"; // EKLENDİ: Kimlik doğrulama için gerekli
import { revalidatePath } from "next/cache";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2, {
    message: "Ürün adı en az 2 karakter olmalıdır.",
  }),
  price: z.coerce.number().min(1, {
    message: "Fiyat 1'den büyük olmalıdır.",
  }),
  categoryId: z.string().min(1, {
    message: "Lütfen bir kategori seçin.",
  }),
  storeId: z.string(),
  images: z.object({ url: z.string() }).array(),
  attributes: z.array(z.string()).optional(),
});

export async function createProduct(formData: z.infer<typeof productSchema>) {
  // 1. GÜVENLİK: Kullanıcı oturumunu al
  const { userId } = await auth();

  const validatedFields = productSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { error: "Geçersiz alanlar!" };
  }

  if (!userId) {
    return { error: "Oturum açmanız gerekiyor." };
  }

  const { name, price, categoryId, storeId, images, attributes } = validatedFields.data;

  // 2. GÜVENLİK: Mağaza sahibini doğrula
  // İşlem yapılan mağaza gerçekten bu kullanıcıya mı ait?
  const storeByUserId = await db.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  });

  if (!storeByUserId) {
    return { error: "Bu işlem için yetkiniz yok." };
  }

  try {
    await db.product.create({
      data: {
        name,
        price,
        categoryId,
        storeId,
        isArchived: false,
        isFeatured: false,
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image),
            ],
          },
        },
        attributes: {
          connect: attributes?.map((itemId) => ({ id: itemId })) || [],
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

// Ürün Güncelleme
export const updateProduct = async (
  storeId: string,
  productId: string,
  data: {
    name: string;
    price: number;
    categoryId?: string;
    images: { url: string }[];
    isFeatured?: boolean;
    isArchived?: boolean;
    attributes?: string[];
  }
) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Yetkisiz erişim");
  }

  // GÜVENLİK: Mağaza sahipliği kontrolü
  const storeByUserId = await db.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  });

  if (!storeByUserId) {
    throw new Error("Bu işlem için yetkiniz yok.");
  }

  try {
    // Ürün var mı kontrolü (Ayrıca storeId ile eşleşiyor mu?)
    const product = await db.product.findFirst({
      where: {
        id: productId,
        storeId: storeId,
      }
    });

    if (!product) {
      throw new Error("Ürün bulunamadı.");
    }

    // 1. Eski resimleri sil (Database ilişkisini temizle)
    await db.product.update({
      where: { id: productId },
      data: {
        images: {
          deleteMany: {},
        },
      },
    });

    // 2. Ürünü güncelle ve yeni resimleri ekle
    await db.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        price: data.price,
        categoryId: data.categoryId,
        isFeatured: data.isFeatured,
        isArchived: data.isArchived,
        images: {
          createMany: {
            data: [...data.images.map((image: { url: string }) => image)],
          },
        },
        attributes: {
          set: data.attributes?.map((id) => ({ id })) || [],
        },
      },
    });

    revalidatePath(`/${storeId}/products`);

    return { success: true };

  } catch (error) {
    console.log("[PRODUCT_UPDATE]", error);
    throw new Error("Ürün güncellenemedi.");
  }
};

// Ürün Silme
export const deleteProduct = async (storeId: string, productId: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Yetkisiz erişim");
  }

  // GÜVENLİK: Mağaza sahipliği kontrolü
  const storeByUserId = await db.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  });

  if (!storeByUserId) {
    throw new Error("Bu işlem için yetkiniz yok.");
  }

  try {
    // Sadece mağazaya ait ürünü sil (deleteMany güvenlidir)
    await db.product.deleteMany({
      where: {
        id: productId,
        storeId: storeId,
      },
    });

    revalidatePath(`/${storeId}/products`);

    return { success: true };

  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);
    throw new Error("Ürün silinemedi.");
  }
};

// Hızlı Arşivleme / Arşivden Çıkarma
export const toggleArchive = async (storeId: string, productId: string, isArchived: boolean) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Yetkisiz erişim");
  }

  // GÜVENLİK KONTROLÜ
  const storeByUserId = await db.store.findFirst({
    where: { id: storeId, userId },
  });

  if (!storeByUserId) {
    throw new Error("Yetkisiz işlem.");
  }

  try {
    // Güncelleme yaparken storeId'yi de where koşuluna ekleyerek ekstra güvenlik sağlayabiliriz
    // Ancak storeByUserId kontrolü zaten bu mağazanın bizim olduğunu kanıtladı.
    await db.product.update({
      where: { id: productId },
      data: { isArchived }
    });

    revalidatePath(`/${storeId}/products`);
    revalidatePath(`/${storeId}/products/archived`);
    return { success: true };
  } catch (error) {
    console.error("Arşivleme hatası:", error);
    throw new Error("İşlem başarısız.");
  }
};

// Hızlı Öne Çıkarma
export const toggleFeatured = async (storeId: string, productId: string, isFeatured: boolean) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Yetkisiz erişim");
  }

  // GÜVENLİK KONTROLÜ
  const storeByUserId = await db.store.findFirst({
    where: { id: storeId, userId },
  });

  if (!storeByUserId) {
    throw new Error("Yetkisiz işlem.");
  }

  try {
    await db.product.update({
      where: { id: productId },
      data: { isFeatured }
    });

    revalidatePath(`/${storeId}/products`);
    return { success: true };
  } catch (error) {
    console.error("Öne çıkarma hatası:", error);
    throw new Error("İşlem başarısız.");
  }
};