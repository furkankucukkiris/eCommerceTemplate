import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { createStore } from "@/actions/store"; // 1. Adımda oluşturduğumuz dosya

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const store = await db.store.findFirst({
    where: {
      userId: userId
    }
  });

  if (store) {
    redirect(`/${store.id}`);
  } else {
    // BURAYI GÜNCELLEDİK: Artık sadece yazı değil, form var.
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 gap-4">
            <h1 className="text-2xl font-bold">Hoş Geldiniz! 👋</h1>
            <p className="text-muted-foreground text-center max-w-md">
                Sistemi kullanmaya başlamak için ilk mağazanızı oluşturun.
            </p>
            
            <form action={createStore} className="flex flex-col gap-3 w-full max-w-sm border p-6 rounded-lg shadow-sm">
                <label className="text-sm font-medium">Mağaza Adı</label>
                <input 
                  name="name" 
                  type="text" 
                  placeholder="Örn: Ayakkabı Dünyası" 
                  className="border p-2 rounded-md w-full"
                  required 
                />
                <button 
                  type="submit" 
                  className="bg-black text-white p-2 rounded-md hover:bg-gray-800 transition"
                >
                  Mağazayı Oluştur
                </button>
            </form>
        </div>
    );
  }
}