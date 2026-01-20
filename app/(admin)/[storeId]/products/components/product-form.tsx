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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUpload from "@/components/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { createProduct, updateProduct, deleteProduct } from "@/actions/products";
import { AlertModal } from "@/components/modals/alert-modal"

// Kategori ve içindeki özellikleri (values ile birlikte) taşıyan tip
export type CategoryWithAttributes = Category & {
  attributes: (Attribute & { values: AttributeValue[] })[];
};

const formSchema = z.object({
  name: z.string().min(1, "Ürün adı gereklidir"),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1, "Fiyat 1'den küçük olamaz"),
  stock: z.coerce.number().min(0, "Stok negatif olamaz"), // YENİ: Stok Alanı
  categoryId: z.string().min(1, "Kategori seçiniz"),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  attributes: z.array(z.string()).optional(), // Seçilen AttributeValue ID'leri
});

type ProductFormValues = z.infer<typeof formSchema>;

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
  const description = initialData ? "Ürün bilgilerini düzenle" : "Yeni bir ürün ekle";
  const action = initialData ? "Kaydet" : "Oluştur";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: initialData ? {
      ...initialData,
      price: parseFloat(String(initialData?.price)),
      stock: initialData.stock, // YENİ: Stok verisi
      categoryId: initialData.categoryId || '', 
      attributes: initialData.attributes.map((a) => a.id),
    } : {
      name: '',
      images: [],
      price: 0,
      stock: 10, // Varsayılan stok
      categoryId: '',
      isFeatured: false,
      isArchived: false,
      attributes: [],
    }
  });

  // Seçilen kategoriyi izle
  const selectedCategoryId = form.watch("categoryId");
  // O kategoriye ait özellikleri bul
  const activeCategory = categories.find((cat) => cat.id === selectedCategoryId);
  const availableAttributes = activeCategory ? activeCategory.attributes : [];

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      const productData = { ...data, storeId: params.storeId as string };

      if (initialData) {
        await updateProduct(params.storeId as string, params.productId as string, productData);
      } else {
        await createProduct(productData);
      }
      
      router.push(`/${params.storeId}/products`);
      router.refresh();
      toast.success(action + " başarıyla tamamlandı.");
    } catch (error) {
      console.error(error);
      toast.error("Bir hata oluştu.");
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
      toast.error("Önce bu ürüne ait siparişleri silmelisiniz.");
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
        <Heading title={title} description={description} />
        {initialData && (
          <Button disabled={loading} variant="destructive" size="icon" onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full mt-4">
          
          {/* Görsel Yükleme */}
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

          {/* Temel Bilgiler Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ürün Adı</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Örn: Keten Gömlek" {...field} />
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
                  <FormLabel>Fiyat (₺)</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* YENİ: Stok Alanı */}
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok Adedi</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="10" {...field} />
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
                        // Kategori değişirse seçili özellikleri temizle (opsiyonel)
                        form.setValue("attributes", []); 
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
          
          {/* DİNAMİK ÖZELLİK (ATTRIBUTE) SEÇİMİ */}
          <div className="space-y-4">
             <h3 className="text-lg font-medium">Ürün Özellikleri</h3>
             <p className="text-sm text-muted-foreground">
                {!selectedCategoryId 
                  ? "Özellikleri görmek için lütfen yukarıdan bir kategori seçin."
                  : availableAttributes.length === 0 
                    ? "Bu kategori için tanımlanmış özellik bulunamadı. (Ayarlar > Özellikler kısmından ekleyebilirsiniz)" 
                    : "Bu ürün için geçerli özellikleri seçiniz."}
             </p>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {availableAttributes.map((attribute) => (
                    <FormItem key={attribute.id} className="p-4 border rounded-md bg-slate-50">
                        <FormLabel className="font-semibold">{attribute.name}</FormLabel>
                        <Select
                            disabled={loading}
                            // Seçili değeri bulmak için attributes dizisini tara
                            value={attribute.values.find(v => (form.watch("attributes") || []).includes(v.id))?.id}
                            onValueChange={(selectedValueId) => {
                                const current = form.getValues("attributes") || [];
                                // Bu niteliğe (örn: Renk) ait diğer değerleri listeden çıkar (Temizle)
                                const otherValuesIds = attribute.values.map(v => v.id);
                                const cleaned = current.filter(id => !otherValuesIds.includes(id));
                                // Yeni seçimi ekle
                                form.setValue("attributes", [...cleaned, selectedValueId]);
                            }}
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
                                        {attribute.valueType === "COLOR" && (
                                            <div className="inline-block w-4 h-4 ml-2 rounded-full border" style={{backgroundColor: val.value}} />
                                        )}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormItem>
                ))}
             </div>
          </div>
          
          <Separator />

          {/* Checkbox Alanları */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Vitrin Ürünü</FormLabel>
                    <FormDescription>Bu ürün ana sayfada öne çıkarılsın mı?</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Arşivle</FormLabel>
                    <FormDescription>Bu ürün mağazada gizlensin mi?</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};