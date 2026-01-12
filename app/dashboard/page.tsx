import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // 1. Veritabanındaki ilk mağazayı bul
  const store = await db.store.findFirst();

  // 2. Eğer mağaza varsa, direkt o mağazanın paneline yönlendir
  if (store) {
    redirect(`/${store.id}/products`);
  }

  // 3. Eğer hiç mağaza yoksa, kullanıcıya bir uyarı ver veya oluşturmaya yönlendir
  // (Normalde burada "Mağaza Oluştur" modalı tetiklenir)
  return (
    <div className="flex flex-col items-center justify-center h-full p-10">
      <h2 className="text-2xl font-bold">Henüz bir mağazanız yok.</h2>
      <p>Lütfen önce veritabanından veya Prisma Studio'dan bir mağaza oluşturun.</p>
    </div>
  );
}