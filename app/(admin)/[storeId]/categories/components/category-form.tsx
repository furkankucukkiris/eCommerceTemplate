"use client";

import { z } from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { Trash } from "lucide-react";
// Prisma tiplerini kullanmak için (generated client'tan)
import { Category, Attribute } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/modals/alert-modal";
import { Checkbox } from "@/components/ui/checkbox"; // Checkbox bileşeni

import { createCategory, updateCategory, deleteCategory } from "@/actions/categories";

const formSchema = z.object({
  name: z.string().min(2, { message: "Kategori adı en az 2 karakter olmalıdır." }),
  attributeIds: z.array(z.string()).optional(), // Form şemasına ekledik
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  // initialData artık ilişkili attributes dizisini de içeriyor
  initialData: (Category & { attributes: Attribute[] }) | null;
  // Seçilebilir tüm özellikler listesi
  attributes: Attribute[];
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, attributes }) => {
  const params = useParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const title = initialData ? "Kategoriyi Düzenle" : "Kategori Oluştur";
  const description = initialData ? "Kategori detaylarını ve ilgili ürün özelliklerini düzenleyin." : "Yeni bir kategori ekleyin.";
  const action = initialData ? "Güncelle" : "Oluştur";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      // Başlangıçta seçili olan özellikleri ID listesine çeviriyoruz
      attributeIds: initialData?.attributes.map((a) => a.id) || [],
    },
  });

  const onSubmit = (values: CategoryFormValues) => {
    startTransition(() => {
      if (initialData) {
        // Güncelleme
        updateCategory(params.storeId as string, params.categoryId as string, values)
          .then(() => {
            router.push(`/${params.storeId}/categories`);
            router.refresh();
          })
          .catch(() => console.error("Güncelleme hatası"));
      } else {
        // Oluşturma
        createCategory({ ...values, storeId: params.storeId as string })
          .then(() => {
            router.push(`/${params.storeId}/categories`);
            router.refresh();
          })
          .catch(() => console.error("Oluşturma hatası"));
      }
    });
  };

  const onDelete = async () => {
    startTransition(() => {
      deleteCategory(params.storeId as string, params.categoryId as string)
        .then(() => {
          router.push(`/${params.storeId}/categories`);
          router.refresh();
        })
        .catch((error) => {
             alert("Hata: " + error.message);
        });
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
          
          {/* İsim Alanı */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori Adı</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="Örn: Ayakkabı" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />
          
          {/* Özellikler (Attributes) Seçimi */}
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
                <h3 className="text-lg font-medium">Kategori Özellikleri</h3>
                <p className="text-sm text-muted-foreground">Bu kategorideki ürünler için geçerli olacak özellikleri (Varyasyonları) seçin.</p>
            </div>
            
            <FormField
              control={form.control}
              name="attributeIds"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {attributes.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="attributeIds"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), item.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-normal cursor-pointer">
                                  {item.name}
                                </FormLabel>
                                <FormDescription className="text-xs">
                                  {item.valueType === "COLOR" ? "Renk Seçimi" : "Metin/Sayı"}
                                </FormDescription>
                              </div>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
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