"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// 1. Kategori Oluşturma
export const createQuickCategory = async (storeId: string, name: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const category = await db.category.create({
    data: { name, storeId }
  });
  return category;
};

// 2. Özellik Oluşturma (Örn: "Kumaş") ve Kategoriye Bağlama
export const createQuickAttribute = async (storeId: string, categoryId: string, name: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const attribute = await db.attribute.create({
    data: {
      name,
      valueType: "TEXT", // Varsayılan TEXT olsun, renk için ayrı bir UI gerekebilir
      storeId,
      categories: {
        connect: { id: categoryId } // Oluştururken kategoriye bağla!
      }
    },
    include: { values: true }
  });
  return attribute;
};

// 3. Değer Oluşturma (Örn: "İpek")
export const createQuickValue = async (attributeId: string, name: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const value = await db.attributeValue.create({
    data: {
      name,
      value: name, // Basitlik için değeri ismiyle aynı yapıyoruz
      attributeId
    }
  });
  return value;
};