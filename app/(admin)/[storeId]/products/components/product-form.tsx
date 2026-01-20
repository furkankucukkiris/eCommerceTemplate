"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { Category, Image, Product, Attribute, AttributeValue } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUpload from "@/components/image-upload";
import { createProduct, updateProduct, deleteProduct } from "@/actions/products";
import { AlertModal } from "@/components/modals/alert-modal"
// Karmaşık tip tanımları
export type CategoryWithAttributes = Category & {
  attributes: (Attribute & { values: AttributeValue[] })[];
};

const formSchema = z.object({
  name: z.string().min(1, "Gerekli"),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1, "Kategori seçiniz"),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  attributes: z.array(z.string()).optional(), // Seçilen AttributeValue ID'leri
});

type ProductFormValues = z.infer<typeof formSchema>;

// DÜZELTME BURADA YAPILDI:
// TypeScript'e diyoruz ki: "Gelen verideki 'price' alanı veritabanındaki gibi Decimal değil, Number olacak."
interface ProductFormProps {
  initialData: (Omit<Product, "price"> & {
    price: number;
    images: Image[];
    attributes: AttributeValue[];
  }) | null;
  categories: CategoryWithAttributes[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories
}) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Ürün Düzenle" : "Ürün Oluştur";
  const action = initialData ? "Kaydet" : "Oluştur";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: initialData ? {
      ...initialData,
      price: parseFloat(String(initialData?.price)),
      categoryId: initialData.categoryId || '', 
      // İlişkili attributeValue ID'lerini diziye çevir
      attributes: initialData.attributes.map((a) => a.id),
    } : {
      name: '',
      images: [],
      price: 0,
      categoryId: '',
      isFeatured: false,
      isArchived: false,
      attributes: [],
    }
  });

  // 1. Seçilen Kategoriyi Canlı İzle
  const selectedCategoryId = form.watch("categoryId");
  
  // 2. O kategoriye ait nitelikleri bul
  const activeCategory = categories.find((cat) => cat.id === selectedCategoryId);
  const availableAttributes = activeCategory ? activeCategory.attributes : [];

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      
      // storeId'yi ekliyoruz
      const productData = {
        ...data,
        storeId: params.storeId as string
      };

      if (initialData) {
        await updateProduct(params.storeId as string, params.productId as string, data);
      } else {
        await createProduct(productData);
      }
      
      router.push(`/${params.storeId}/products`);
      router.refresh();
      toast.success("İşlem başarılı.");
    } catch (error) {
      console.error(error); // Hatayı konsola yazdır ki görebilelim
      toast.error("Hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await deleteProduct(params.storeId as string, params.productId as string);
      router.push(`/${params.storeId}/products`);
      router.refresh();
      toast.success("Ürün silindi.");
    } catch (error) {
      toast.error("Hata oluştu.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
        <AlertModal 
            isOpen={open} 
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
        />
        <div className="flex items-center justify-between">
            <Heading title={title} description="Ürün bilgileri" />
            {initialData && (
            <Button disabled={loading} variant="destructive" size="icon" onClick={() => setOpen(true)}>
                <Trash className="h-4 w-4" />
            </Button>
            )}
        </div>
        <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full mt-4">
          
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ürün Görselleri</FormLabel>
                <FormControl>
                  <ImageUpload 
                    value={field.value.map((image) => image.url)} 
                    disabled={loading} 
                    onChange={(url) => field.onChange([...field.value, { url }])}
                    onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ürün Adı</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Ürün adı" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fiyat</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <Select 
                    disabled={loading} 
                    onValueChange={(value) => {
                        field.onChange(value);
                        // Kategori değişirse seçili özellikleri sıfırlamak istersen:
                        // form.setValue("attributes", []);
                    }} 
                    value={field.value} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Separator />
          
          {/* DINAMIK ATTRIBUTE ALANI */}
          <div className="space-y-4">
             <h3 className="text-lg font-medium">Ürün Özellikleri</h3>
             {(!selectedCategoryId) && <p className="text-sm text-muted-foreground">Özellikleri görmek için lütfen önce kategori seçin.</p>}
             
             {selectedCategoryId && availableAttributes.length === 0 && (
                <p className="text-sm text-muted-foreground">Bu kategoriye ait tanımlı özellik yok.</p>
             )}

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {availableAttributes.map((attribute) => (
                    <FormItem key={attribute.id} className="p-4 border rounded-md bg-slate-50">
                        <FormLabel>{attribute.name}</FormLabel>
                        <Select
                            disabled={loading}
                            // Formdaki attributes dizisini yönetiyoruz
                            onValueChange={(selectedValueId) => {
                                const current = form.getValues("attributes") || [];
                                // Bu niteliğe ait diğer değerleri temizle (Single Select mantığı için)
                                const otherValuesIds = attribute.values.map(v => v.id);
                                const cleaned = current.filter(id => !otherValuesIds.includes(id));
                                
                                // Yeniyi ekle
                                form.setValue("attributes", [...cleaned, selectedValueId]);
                            }}
                            // O anki seçili değeri bul
                            value={attribute.values.find(v => (form.watch("attributes") || []).includes(v.id))?.id}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seçiniz" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {attribute.values.map((val) => (
                                    <SelectItem key={val.id} value={val.id}>
                                        {val.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormItem>
                ))}
             </div>
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">{action}</Button>
        </form>
      </Form>
    </>
  );
};