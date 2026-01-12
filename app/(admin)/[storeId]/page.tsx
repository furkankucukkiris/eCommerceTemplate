import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

interface DashboardPageProps {
  params: { storeId: string };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Mağazanızın genel durumu" />
        <Separator />
        
        <div className="grid gap-4 grid-cols-3">
          <div className="p-4 border rounded-md">
            <h3 className="font-bold">Toplam Satış</h3>
            <p className="text-2xl mt-2">₺0.00</p>
          </div>
          <div className="p-4 border rounded-md">
             <h3 className="font-bold">Ürün Sayısı</h3>
             <p className="text-2xl mt-2">12</p> 
             {/* Burayı ileride veritabanından çekeceğiz */}
          </div>
          {/* Diğer kartlar... */}
        </div>

      </div>
    </div>
  );
}