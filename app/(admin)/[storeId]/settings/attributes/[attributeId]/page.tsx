import prismadb from "@/lib/prismadb";
import { AttributeForm } from "./components/attribute-form";

const AttributePage = async ({
  params
}: {
  params: Promise<{ storeId: string; attributeId: string }>
}) => {
  const resolvedParams = await params;

  // Düzenleme modundaysak mevcut veriyi ve seçili kategorileri çek
  const attribute = resolvedParams.attributeId === "new" 
    ? null 
    : await prismadb.attribute.findUnique({
        where: {
          id: resolvedParams.attributeId
        },
        include: {
          categories: true // Formda işaretli göstermek için gerekli
        }
      });

  // Seçim listesi için o mağazadaki tüm kategorileri çek
  const categories = await prismadb.category.findMany({
    where: {
      storeId: resolvedParams.storeId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AttributeForm 
          initialData={attribute} 
          categories={categories} // Forma gönderiyoruz
        />
      </div>
    </div>
  );
}

export default AttributePage;