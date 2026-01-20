import prismadb from "@/lib/prismadb";
import { CategoryForm } from "../components/category-form";

const CategoryPage = async ({
  params
}: {
  params: Promise<{ categoryId: string, storeId: string }>
}) => {
  const { categoryId, storeId } = await params;

  // 1. Kategoriyi çekerken ilişkili attribute'ları da (include) alıyoruz
  // Böylece formda hangilerinin seçili olduğunu gösterebiliriz.
  const category = await prismadb.category.findUnique({
    where: {
      id: categoryId
    },
    include: {
      attributes: true // ÖNEMLİ: Seçili özellikleri getirir
    }
  });

  // 2. Mağazadaki TÜM attribute'ları çekiyoruz (Seçim listesi için)
  const attributes = await prismadb.attribute.findMany({
    where: {
      storeId: storeId
    },
    orderBy: {
        name: 'asc'
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Forma hem mevcut kategoriyi hem de seçilebilir özellikleri gönderiyoruz */}
        <CategoryForm initialData={category} attributes={attributes} />
      </div>
    </div>
  );
}

export default CategoryPage;