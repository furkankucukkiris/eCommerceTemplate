"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache"; // BU SATIRI EKLEYİN

export async function createStore(formData: FormData) {
  // ... (createStore fonksiyonu aynen kalsın) ...
  const { userId } = await auth();
  if (!userId) throw new Error("Yetkisiz erişim");
  const name = formData.get("name") as string;
  if (!name || name.length < 2) throw new Error("Mağaza adı geçersiz.");

  const store = await db.store.create({
    data: { name, userId }
  });

  redirect(`/${store.id}`);
}

// GÜNCELLENECEK FONKSİYON BURASI:
export async function updateStore(
  storeId: string,
  data: {
    name: string;
    logoUrl?: string;
    socialLinks?: { platform: string; url: string }[];
  }
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Yetkisiz erişim");
  }

  // 1. Mağazayı güncelle
  await db.store.update({
    where: {
      id: storeId,
      userId,
    },
    data: {
      name: data.name,
      logoUrl: data.logoUrl,
    },
  });

  // 2. Sosyal Linkleri güncelle
  if (data.socialLinks) {
    await db.socialLink.deleteMany({
      where: { storeId },
    });

    if (data.socialLinks.length > 0) {
      await db.socialLink.createMany({
        data: data.socialLinks.map((link) => ({
          storeId,
          platform: link.platform,
          url: link.url,
        })),
      });
    }
  }

  // DÜZELTME: redirect yerine revalidatePath kullanıyoruz.
  // Bu sayede "hata oluştu" uyarısı almayacaksınız.
  revalidatePath(`/${storeId}/settings`);
  revalidatePath(`/${storeId}`); // Navbar'daki logonun da güncellenmesi için
  
  return { success: true };
}