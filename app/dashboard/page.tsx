import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // 1. Kullanıcıyı Sunucu Tarafında Doğrula
  const { userId } = await auth();

  // Eğer sunucu kullanıcıyı tanıyamazsa, sign-in'e atar.
  if (!userId) {
    redirect('/sign-in');
  }

  // 2. Kullanıcının Mağazasını Bul
  const store = await db.store.findFirst({
    where: {
      userId: userId
    }
  });

  // 3. Yönlendirme Yap
  if (store) {
    redirect(`/${store.id}`);
  } else {
    // Mağaza yoksa anasayfaya değil, geçici olarak buraya düşsün ki hatayı anlayalım.
    // İleride buraya "Mağaza Oluştur" butonu koyacağız.
    return (
        <div className="flex flex-col items-center justify-center h-full p-8">
            <h1 className="text-2xl font-bold">Mağaza Bulunamadı</h1>
            <p className="text-muted-foreground mt-2">
                Giriş yapmış görünüyorsunuz (User ID: {userId}) ancak bir mağazanız yok.
            </p>
            <a href="/" className="mt-4 text-blue-500 underline">Ana Sayfaya Dön</a>
        </div>
    );
  }
}