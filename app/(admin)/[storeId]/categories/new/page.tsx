import prismadb from "@/lib/prismadb";
import { CategoryForm } from "../components/category-form";

const NewCategoryPage = async ({
  params
}: {
  params: Promise<{ storeId: string }>
}) => {
  // 1. Params'ı çözümlüyoruz
  const { storeId } = await params;

  // 2. Mağazadaki tüm özellikleri çekiyoruz (Formdaki checkbox listesi için)
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
        {/* 3. Attributes verisini forma gönderiyoruz */}
        <CategoryForm initialData={null} attributes={attributes} />
      </div>
    </div>
  );
}

export default NewCategoryPage;