import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // Veritabanındaki ilk mağazayı bul
  const store = await db.store.findFirst();

  // Mağaza varsa onun paneline git
  if (store) {
    redirect(`/${store.id}`); 
  }

  // Mağaza yoksa ne yapalım? (Şimdilik ana sayfaya atalım)
  return redirect('/');
}