"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Trash, Plus, Save } from "lucide-react";
import { Store, SocialLink } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateStore } from "@/actions/store"; 
import { toast } from "sonner";

// DÜZELTME: Süslü parantez kaldırıldı (Default export olduğu için)
import ImageUpload from "@/components/image-upload"; 

// Form Şeması
const formSchema = z.object({
  name: z.string().min(1),
  logoUrl: z.string().optional(),
  socialLinks: z.object({
    platform: z.string(),
    url: z.string().url("Geçerli bir URL giriniz"),
  }).array(),
});

type SettingsFormValues = z.infer<typeof formSchema>;

interface SettingsFormProps {
  initialData: Store & { socialLinks: SocialLink[] };
}

export const SettingsForm: React.FC<SettingsFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name,
      logoUrl: initialData.logoUrl || "",
      socialLinks: initialData.socialLinks || [],
    }
  });

  // Dinamik Sosyal Medya Listesi için
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);
      await updateStore(params.storeId as string, data);
      toast.success("Mağaza ayarları güncellendi.");
      router.refresh();
    } catch (error) {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        onConfirm={() => {}} 
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title="Ayarlar" description="Mağaza tercihlerinizi yönetin" />
      </div>
      <Separator />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 1. MAĞAZA ADI */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mağaza Adı</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Mağaza Adı" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 2. LOGO YÜKLEME */}
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Mağaza Logosu</FormLabel>
                    <FormControl>
                        <ImageUpload 
                            value={field.value ? [field.value] : []} 
                            disabled={loading} 
                            onChange={(url) => field.onChange(url)}
                            onRemove={() => field.onChange("")}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />
          
          {/* 3. SOSYAL MEDYA YÖNETİMİ */}
          <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Sosyal Medya Hesapları</h3>
                <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => append({ platform: "instagram", url: "" })}
                >
                    <Plus className="mr-2 h-4 w-4" /> Hesap Ekle
                </Button>
            </div>
            
            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-end">
                        <FormField
                            control={form.control}
                            name={`socialLinks.${index}.platform`}
                            render={({ field }) => (
                                <FormItem className="w-[150px]">
                                    <FormLabel>Platform</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seç" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="instagram">Instagram</SelectItem>
                                            <SelectItem value="twitter">X (Twitter)</SelectItem>
                                            <SelectItem value="facebook">Facebook</SelectItem>
                                            <SelectItem value="youtube">Youtube</SelectItem>
                                            <SelectItem value="linkedin">Linkedin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`socialLinks.${index}.url`}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Profil Linki (URL)</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="https://..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button 
                            type="button" 
                            variant="destructive" 
                            size="icon"
                            onClick={() => remove(index)}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                {fields.length === 0 && (
                    <p className="text-sm text-muted-foreground">Henüz sosyal medya hesabı eklenmemiş.</p>
                )}
            </div>
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            <Save className="mr-2 h-4 w-4" /> Değişiklikleri Kaydet
          </Button>
        </form>
      </Form>
    </>
  );
};