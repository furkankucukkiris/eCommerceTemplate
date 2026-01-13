import prismadb from "@/lib/prismadb";
import { CategoryForm } from "../components/category-form";

const CategoryPage = async ({
  params
}: {
  // 1. Params'ı Promise olarak tanımlıyoruz
  params: Promise<{ categoryId: string, storeId: string }>
}) => {
  // 2. Kullanmadan önce await ediyoruz
  const { categoryId } = await params;

  // 3. Veritabanından kategoriyi çekiyoruz
  const category = await prismadb.category.findUnique({
    where: {
      id: categoryId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} />
      </div>
    </div>
  );
}

export default CategoryPage;