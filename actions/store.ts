"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function createStore(formData: FormData) {
  const { userId } = await auth();
  
  if (!userId) {
    // Return yerine throw kullanıyoruz
    throw new Error("Yetkisiz erişim");
  }

  const name = formData.get("name") as string;

  if (!name || name.length < 2) {
    // Return yerine throw kullanıyoruz
    throw new Error("Mağaza adı en az 2 karakter olmalı.");
  }

  // 1. Mağazayı oluştur
  const store = await db.store.create({
    data: {
      name,
      userId,
    }
  });

  // 2. Oluşan mağazanın paneline yönlendir
  redirect(`/${store.id}`);
}