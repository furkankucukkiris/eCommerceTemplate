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
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/modals/alert-modal";
// DİKKAT: Action'ları yeni oluşturduğumuz dosyadan çekiyoruz
import { createCategory, updateCategory, deleteCategory } from "@/actions/categories";

const formSchema = z.object({
  name: z.string().min(2, { message: "Kategori adı en az 2 karakter olmalıdır." }),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData: {
    id: string;
    name: string;
  } | null;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const title = initialData ? "Kategoriyi Düzenle" : "Kategori Oluştur";
  const description = initialData ? "Kategori detaylarını düzenleyin." : "Yeni bir kategori ekleyin.";
  const action = initialData ? "Güncelle" : "Oluştur";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
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
             // Backend'den gelen hatayı (ürün var uyarısı) yakalayabiliriz
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
          <div className="grid grid-cols-3 gap-8">
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
          <Button disabled={isPending} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};