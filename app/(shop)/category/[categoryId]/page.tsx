// app/(shop)/category/[categoryId]/page.tsx

import { db } from "@/lib/db";
import { Container } from "@/components/ui/container";
import { ProductList } from "@/components/product-list";
import { Filter } from "@/components/filter"; // components/filter.tsx
import { MobileFilters } from "./components/mobile-filters"; // Artık mevcut
import NoResults from "@/components/ui/no-results"; // Artık mevcut

// Sayfanın her istekte yeniden derlenmesini sağlar (verilerin güncel kalması için)
export const revalidate = 0;

interface CategoryPageProps {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function CategoryPage(props: CategoryPageProps) {
  // Next.js 15+ için params ve searchParams promise olarak gelir
  const params = await props.params;
  const searchParams = await props.searchParams;

  // 1. Kategoriyi ve ona bağlı nitelikleri çek
  const category = await db.category.findUnique({
    where: {
      id: params.categoryId,
    },
    include: {
      attributes: { 
        include: {
          values: true 
        }
      }
    }
  });

  if (!category) {
    return <NoResults />;
  }

  // 2. Dinamik Filtreleme Mantığı
  // searchParams içindeki key'lere bakarak (Örn: "RenkId") filtre oluşturuyoruz.
  const filters: any = {
      categoryId: category.id,
      isArchived: false,
  };

  // Kategoriye ait özellikleri döngüye alıp URL'de seçili mi diye bakıyoruz
  category.attributes.forEach((attr) => {
      const key = `${attr.name}Id`; // Örn: RenkId
      const valueId = searchParams[key]; // URL'den değeri al

      if (valueId) {
          // Prisma'da related tabloda filtreleme (attributeValues içinde var mı?)
          // Not: Bu kısım Prisma'nın yapısına göre karmaşıklaşabilir.
          // Basit bir "AND" mantığı için:
          filters.attributes = {
             some: {
                id: valueId
             }
          }
      }
  });

  // Eğer birden fazla filtre aynı anda seçilirse yukarıdaki basit mantık yetmez,
  // ancak şimdilik tekli filtreleme üzerinden gidelim.
  
  const products = await db.product.findMany({
    where: filters,
    include: {
      images: true,
      category: true,
      attributes: {
         include: {
             attribute: true
         }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedProducts = products.map((item) => ({
    ...item,
    price: item.price.toNumber()
  }));

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 pb-24 pt-6">
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
            
            {/* Mobil Filtreler */}
            <MobileFilters attributes={category.attributes} />
            
            {/* Masaüstü Filtreler */}
            <div className="hidden lg:block">
               {category.attributes.map((attr) => (
                 <Filter
                   key={attr.id}
                   valueKey={`${attr.name}Id`} 
                   name={attr.name}            
                   data={attr.values}          
                 />
               ))}
            </div>

            {/* Ürün Listesi */}
            <div className="mt-6 lg:col-span-4 lg:mt-0">
              {products.length === 0 && <NoResults />}
              <ProductList title={category.name} items={formattedProducts} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}