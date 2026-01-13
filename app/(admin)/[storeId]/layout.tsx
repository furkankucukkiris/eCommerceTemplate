import { redirect } from "next/navigation";
import { Menu } from "lucide-react";

import { db } from "@/lib/db";
import { MainSidebar } from "@/components/main-sidebar"; 
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params;
  const store = await db.store.findFirst({
    where: { id: storeId }
  });

  if (!store) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      
      {/* --- MASAÜSTÜ SIDEBAR (KOYU RENK) --- */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-slate-950 text-white md:block min-h-screen sticky top-0 h-screen overflow-y-auto">
        <div className="flex h-16 items-center border-b border-slate-800 px-6">
           <h2 className="font-bold text-lg tracking-tight text-white">{store.name}</h2>
        </div>
        <div className="p-4">
           {/* Sidebar bileşenine renklerin koyu olduğunu belirtmek için bir prop geçebiliriz ama
               şimdilik direkt bileşeni koyu moda uyumlu güncelleyeceğiz. */}
           <MainSidebar />
        </div>
      </aside>

      {/* --- MOBİL HEADER & İÇERİK --- */}
      <div className="flex flex-1 flex-col">
         <header className="flex h-16 items-center gap-4 border-b bg-background px-6 md:hidden">
            <Sheet>
               <SheetTrigger asChild>
                 <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                 </Button>
               </SheetTrigger>
               {/* Mobil Menü de Koyu Olsun */}
               <SheetContent side="left" className="w-64 p-0 bg-slate-950 text-white border-r-slate-800">
                  <div className="flex h-16 items-center border-b border-slate-800 px-6">
                     <h2 className="font-bold text-lg text-white">{store.name}</h2>
                  </div>
                  <div className="p-4">
                    <MainSidebar />
                  </div>
               </SheetContent>
            </Sheet>
            <span className="font-semibold">{store.name}</span>
         </header>
         
         <main className="flex-1 p-8 bg-slate-50">
            {children}
         </main>
      </div>
    </div>
  );
}