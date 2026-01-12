"use client";

import { z } from "zod";
import { useState, useTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";

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
import ImageUpload from "@/components/ui/image-upload"; // YENİ IMPORT
import { createProduct } from "@/actions/products";

// 1. Şemaya 'images' dizisini ekliyoruz
const formSchema = z.object({
  name: z.string().min(2, { message: "Ürün adı en az 2 karakter olmalıdır." }),
  price: z.coerce.number().min(1, { message: "Fiyat en az 1 olmalıdır." }),
  images: z.object({ url: z.string() }).array(), // Resimler obje dizisi olacak
});

type ProductFormValues = z.infer<typeof formSchema>;

export const ProductForm = () => {
  const params = useParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: "",
      price: 0,
      images: [], // Varsayılan boş dizi
    },
  });

  const onSubmit: SubmitHandler<ProductFormValues> = (values) => {
    startTransition(() => {
      createProduct({ 
        ...values, 
        storeId: params.storeId as string 
      })
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          router.push(`/${params.storeId}/products`);
          router.refresh();
        }
      });
    });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading 
            title="Ürün Ekle" 
            description="Mağazanıza yeni bir ürün ekleyin." 
        />
      </div>
      <Separator />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full mt-4">
          
          {/* YENİ: GÖRSEL YÜKLEME ALANI */}
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
          </div>
          <Button disabled={isPending} className="ml-auto" type="submit">
            {isPending ? "Kaydediliyor..." : "Oluştur"}
          </Button>
        </form>
      </Form>
    </>
  );
};