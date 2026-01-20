"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Formdan gelen veri tipi
interface AttributeFormData {
  name: string;
  valueType: string;
  categoryIds: string[]; // Çoklu seçim
}

export const createAttribute = async (storeId: string, data: AttributeFormData) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Yetkisiz erişim");

  const storeByUserId = await db.store.findFirst({
    where: { id: storeId, userId }
  });

  if (!storeByUserId) throw new Error("Yetkisiz işlem");

  const attribute = await db.attribute.create({
    data: {
      name: data.name,
      valueType: data.valueType,
      storeId,
      // İlişkiyi kuruyoruz
      categories: {
        connect: data.categoryIds.map((id) => ({ id }))
      }
    }
  });

  revalidatePath(`/${storeId}/settings`);
  return attribute;
};

export const updateAttribute = async (storeId: string, attributeId: string, data: AttributeFormData) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Yetkisiz erişim");

  const storeByUserId = await db.store.findFirst({
    where: { id: storeId, userId }
  });

  if (!storeByUserId) throw new Error("Yetkisiz işlem");

  await db.attribute.update({
    where: { id: attributeId },
    data: {
      name: data.name,
      categories: {
        set: [], // Öncekileri temizle (reset)
        connect: data.categoryIds.map((id) => ({ id })) // Yenileri ekle
      }
    }
  });

  revalidatePath(`/${storeId}/settings`);
  return { success: true };
};

export const deleteAttribute = async (storeId: string, attributeId: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Yetkisiz erişim");

  const storeByUserId = await db.store.findFirst({
    where: { id: storeId, userId }
  });

  if (!storeByUserId) throw new Error("Yetkisiz işlem");

  const attribute = await db.attribute.delete({
    where: { id: attributeId }
  });

  revalidatePath(`/${storeId}/settings`);
  return attribute;
};