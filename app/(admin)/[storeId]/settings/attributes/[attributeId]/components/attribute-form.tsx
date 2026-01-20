"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { Attribute, Category } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"; // Checkbox bileşeni (yoksa ui/checkbox.tsx oluşturun)
import { AlertModal } from "@/components/modals/alert-modal";
import { createAttribute, updateAttribute, deleteAttribute } from "@/actions/attributes";

const formSchema = z.object({
  name: z.string().min(1, "İsim gereklidir"),
  valueType: z.string().min(1, "Tip seçimi gereklidir"),
  categoryIds: z.array(z.string()).min(1, "En az bir kategori seçmelisiniz"),
});

type AttributeFormValues = z.infer<typeof formSchema>;

interface AttributeFormProps {
  initialData: (Attribute & { categories: Category[] }) | null;
  categories: Category[];
}

export const AttributeForm: React.FC<AttributeFormProps> = ({
  initialData,
  categories
}) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Nitelik Düzenle" : "Nitelik Oluştur";
  const action = initialData ? "Kaydet" : "Oluştur";

  // Form kurulumu
  const form = useForm<AttributeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      valueType: initialData?.valueType || 'TEXT',
      // Mevcut kategorileri ID listesine çeviriyoruz
      categoryIds: initialData?.categories.map((cat) => cat.id) || []
    }
  });

  const onSubmit = async (data: AttributeFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await updateAttribute(params.storeId as string, params.attributeId as string, data);
      } else {
        await createAttribute(params.storeId as string, data);
      }
      toast.success("İşlem başarılı.");
      router.push(`/${params.storeId}/settings`);
      router.refresh();
    } catch (error) {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await deleteAttribute(params.storeId as string, params.attributeId as string);
      router.push(`/${params.storeId}/settings`);
      toast.success("Silindi.");
      router.refresh();
    } catch (error) {
      toast.error("Hata.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
      <div className="flex items-center justify-between">
        <Heading title={title} description="Ürün özelliklerini yönetin." />
        {initialData && (
          <Button disabled={loading} variant="destructive" size="icon" onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full mt-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nitelik Adı</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Örn: Beden" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="valueType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Değer Tipi</FormLabel>
                  <Select disabled={loading || !!initialData} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seçiniz" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TEXT">Metin</SelectItem>
                      <SelectItem value="COLOR">Renk</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="md:grid md:grid-cols-1 gap-8">
            <FormField
              control={form.control}
              name="categoryIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Geçerli Kategoriler</FormLabel>
                  <FormDescription>Bu nitelik hangi kategorilerdeki ürünlerde görünsün?</FormDescription>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border p-4 rounded-md">
                    {categories.map((category) => (
                      <FormItem key={category.id} className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(category.id)}
                            // TİP DÜZELTMESİ BURADA:
                            onCheckedChange={(checked: boolean | string) => {
                              return checked
                                ? field.onChange([...field.value, category.id])
                                : field.onChange(field.value?.filter((value) => value !== category.id))
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer text-sm">
                          {category.name}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">{action}</Button>
        </form>
      </Form>
    </>
  );
};