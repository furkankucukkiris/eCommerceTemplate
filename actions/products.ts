"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface ProductFormData {
  storeId: string;
  name: string;
  price: number;
  stock: number;
  categoryId: string;
  images: { url: string }[];
  isFeatured?: boolean;
  isArchived?: boolean;
  attributes?: string[];
}

export const createProduct = async (data: ProductFormData) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  const { storeId, name, price, stock, categoryId, images, isFeatured, isArchived, attributes } = data;

  const storeByUserId = await db.store.findFirst({
    where: { id: storeId, userId }
  });

  if (!storeByUserId) throw new Error("Unauthorized");

  const product = await db.product.create({
    data: {
      storeId,
      name,
      price,
      stock,
      categoryId,
      isFeatured,
      isArchived,
      images: {
        createMany: {
          data: [...images.map((image: { url: string }) => image)]
        }
      },
      attributes: {
        connect: attributes?.map((id) => ({ id })) || [] 
      }
    }
  });

  revalidatePath(`/${storeId}/products`);

  // DÜZELTME: Decimal olan 'price' alanını number'a çevirip öyle döndürüyoruz.
  return {
    ...product,
    price: product.price.toNumber() 
  };
};

export const updateProduct = async (storeId: string, productId: string, data: ProductFormData) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  const { name, price, stock, categoryId, images, isFeatured, isArchived, attributes } = data;

  const storeByUserId = await db.store.findFirst({
    where: { id: storeId, userId }
  });

  if (!storeByUserId) throw new Error("Unauthorized");

  await db.product.update({
    where: { id: productId },
    data: {
      name,
      price,
      stock,
      categoryId,
      isFeatured,
      isArchived,
      images: {
        deleteMany: {},
      },
      attributes: {
        set: [],
        connect: attributes?.map((id) => ({ id }))
      }
    }
  });

  await db.product.update({
    where: { id: productId },
    data: {
      images: {
        createMany: {
          data: [...images.map((image: { url: string }) => image)]
        }
      }
    }
  });

  revalidatePath(`/${storeId}/products`);
  
  // Update zaten düz bir obje döndürüyordu, sorun yok.
  return { success: true };
};

export const deleteProduct = async (storeId: string, productId: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  const storeByUserId = await db.store.findFirst({
    where: { id: storeId, userId }
  });

  if (!storeByUserId) throw new Error("Unauthorized");

  const product = await db.product.delete({
    where: { id: productId }
  });

  revalidatePath(`/${storeId}/products`);

  // DÜZELTME: Burada da Decimal'i temizliyoruz.
  return {
    ...product,
    price: product.price.toNumber()
  };
};

export const toggleArchive = async (storeId: string, productId: string, isArchived: boolean) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  const storeByUserId = await db.store.findFirst({
    where: { id: storeId, userId }
  });

  if (!storeByUserId) throw new Error("Unauthorized");

  await db.product.update({
    where: { id: productId },
    data: { 
        isArchived,
        // KRİTİK MANTIK: 
        // Eğer ürün arşivleniyorsa (isArchived === true), Vitrin özelliğini (isFeatured) false yap.
        // Eğer arşivden çıkarılıyorsa (false), Vitrin özelliğine dokunma (önceki hali kalsın).
        ...(isArchived ? { isFeatured: false } : {})
    }
  });

  revalidatePath(`/${storeId}/products`);
  return { success: true };
};

export const toggleFeatured = async (storeId: string, productId: string, isFeatured: boolean) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  const storeByUserId = await db.store.findFirst({
    where: { id: storeId, userId }
  });

  if (!storeByUserId) throw new Error("Unauthorized");

  await db.product.update({
    where: { id: productId },
    data: { isFeatured }
  });

  revalidatePath(`/${storeId}/products`);
  return { success: true };
};