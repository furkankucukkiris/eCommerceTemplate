"use client";

import { z } from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import ImageUpload from "@/components/image-upload";
import { AlertModal } from "@/components/modals/alert-modal";
import { createProduct, updateProduct, deleteProduct } from "@/actions/products";
// YENİ: Select bileşenlerini import ediyoruz
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Şemayı güncelledik: categoryId zorunlu
const formSchema = z.object({
  name: z.string().min(2, { message: "Ürün adı en az 2 karakter olmalıdır." }),
  price: z.coerce.number().min(1, { message: "Fiyat en az 1 olmalıdır." }),
  categoryId: z.string().min(1, { message: "Bir kategori seçmelisiniz." }), // YENİ
  images: z.object({ url: z.string() }).array(),
});

type ProductFormValues = z.infer<typeof formSchema>;

// Props tanımına categories dizisini ekledik
interface ProductFormProps {
  initialData: any | null;
  categories: { id: string; name: string }[]; // YENİ
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, categories }) => {
  const params = useParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const title = initialData ? "Ürünü Düzenle" : "Ürün Ekle";
  const description = initialData ? "Ürün detaylarını düzenleyin." : "Yeni bir ürün ekleyin.";
  const action = initialData ? "Güncelle" : "Oluştur";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: initialData ? {
      ...initialData,
      price: parseFloat(String(initialData.price)),
    } : {
      name: "",
      price: 0,
      categoryId: "", // Varsayılan boş
      images: [],
    },
  });

  const onSubmit = (values: ProductFormValues) => {
    startTransition(() => {
      if (initialData) {
        // Güncelleme
        updateProduct(params.storeId as string, params.productId as string, values)
          .then(() => {
            router.push(`/${params.storeId}/products`);
            router.refresh();
          });
      } else {
        // Oluşturma
        createProduct({ ...values, storeId: params.storeId as string })
          .then(() => {
            router.push(`/${params.storeId}/products`);
            router.refresh();
          });
      }
    });
  };

  const onDelete = async () => {
    startTransition(() => {
        deleteProduct(params.storeId as string, params.productId as string)
            .then(() => {
                router.push(`/${params.storeId}/products`);
                router.refresh();
            })
            .catch(() => console.error("Silme hatası"));
    });
  };

  return (
    <>
      <AlertModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isPending}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isPending}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
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
                    disabled={isPending}
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
                    <Input disabled={isPending} placeholder="Örn: Deri Ceket" {...field} />
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
                    <Input 
                      type="number" 
                      disabled={isPending} 
                      placeholder="99.90" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* YENİ: KATEGORİ SEÇİM ALANI */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <Select 
                    disabled={isPending} 
                    onValueChange={field.onChange} 
                    value={field.value} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Kategori seçin" />
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
          <Button disabled={isPending} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};