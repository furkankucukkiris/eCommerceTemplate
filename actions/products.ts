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
  categoryId: z.string().min(1, {
    message: "Lütfen bir kategori seçin.",
  }),
  storeId: z.string(),
  images: z.object({ url: z.string() }).array(),

  attributes: z.array(z.string()).optional(),
});

export async function createProduct(formData: z.infer<typeof productSchema>) {
  const validatedFields = productSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { error: "Geçersiz alanlar!" };
  }

  const { name, price, categoryId, storeId, images, attributes } = validatedFields.data;

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
          // Gelen ID listesini veritabanına bağlar
          connect: attributes?.map((itemId) => ({ id: itemId })) || [],
        },
      },
    });

    // Listeyi yenile
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
  try {
    const product = await db.product.findFirst({
      where: {
        id: productId,
        storeId: storeId, // Mağaza ID eşleşmeli
      }
    });

    if (!product) {
      throw new Error("Ürün bulunamadı veya bu işlem için yetkiniz yok.");
    }
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
        price: data.price, // Prisma Decimal'a otomatik çevirir
        categoryId: data.categoryId,
        isFeatured: data.isFeatured,
        isArchived: data.isArchived,
        images: {
          createMany: {
            data: [...data.images.map((image: { url: string }) => image)],
          },
        },
        attributes: {
          // 'set' komutu eski ilişkileri koparır ve sadece yeni listeyi bağlar.
          // Eğer data.attributes boşsa veya undefined ise boş dizi göndeririz.
          set: data.attributes?.map((id) => ({ id })) || [],
        },
      },
    });

    // ÖNEMLİ: Listeleme sayfasının cache'ini temizle
    revalidatePath(`/${storeId}/products`);

    return { success: true };

  } catch (error) {
    console.log("[PRODUCT_UPDATE]", error);
    throw new Error("Ürün güncellenemedi.");
  }
};

// Ürün Silme
export const deleteProduct = async (storeId: string, productId: string) => {
  try {
    // DÜZELTME: delete yerine deleteMany kullanıyoruz.
    // deleteMany, 'storeId' gibi unique olmayan alanlarla filtrelemeye izin verir.
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
  try {
    await db.product.update({
      where: { id: productId },
      data: { isArchived }
    });

    revalidatePath(`/${storeId}/products`);
    revalidatePath(`/${storeId}/products/archived`); // Arşiv sayfasını da yenile
    return { success: true };
  } catch (error) {
    console.error("Arşivleme hatası:", error);
    throw new Error("İşlem başarısız.");
  }
};

// Hızlı Öne Çıkarma
export const toggleFeatured = async (storeId: string, productId: string, isFeatured: boolean) => {
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