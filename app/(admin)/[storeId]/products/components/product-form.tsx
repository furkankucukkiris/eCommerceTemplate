"use client";

import * as z from "zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash } from "lucide-react";
import { Category, Image, Product, Attribute, AttributeValue } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreatableSelect } from "@/components/ui/creatable-select";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "@/components/image-upload";
import { AlertModal } from "@/components/modals/alert-modal";

import { createProduct, updateProduct, deleteProduct } from "@/actions/products";
import { createQuickCategory, createQuickAttribute, createQuickValue } from "@/actions/quick-create";

// TİP TANIMLAMALARI
export type CategoryWithAttributes = Category & {
  attributes: (Attribute & { values: AttributeValue[] })[];
};

const formSchema = z.object({
  name: z.string().min(1, "Ürün adı gereklidir"),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1, "Fiyat 1'den küçük olamaz"),
  stock: z.coerce.number().min(0, "Stok negatif olamaz"),
  categoryId: z.string().min(1, "Kategori seçiniz"),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  attributes: z.array(z.string()).optional(),
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

  // DİNAMİK ÖZELLİK YÖNETİMİ İÇİN STATE
  // Formdaki "O anki" kategoriye ait özellikleri burada tutacağız.
  const [currentAttributes, setCurrentAttributes] = useState<(Attribute & { values: AttributeValue[] })[]>([]);

  const title = initialData ? "Ürün Düzenle" : "Ürün Oluştur";
  const description = initialData ? "Ürün bilgilerini düzenle" : "Yeni bir ürün ekle";
  const action = initialData ? "Kaydet" : "Oluştur";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: initialData ? {
      ...initialData,
      price: parseFloat(String(initialData?.price)),
      stock: initialData.stock,
      categoryId: initialData.categoryId || '', 
      attributes: initialData.attributes.map((a) => a.id),
    } : {
      name: '',
      images: [],
      price: 0,
      stock: 10,
      categoryId: '',
      isFeatured: false,
      isArchived: false,
      attributes: [],
    }
  });

  // Kategori değiştiğinde özellikleri güncelle
  const selectedCategoryId = form.watch("categoryId");

  useEffect(() => {
    // 1. Seçilen kategoriyi props'lardan bul
    const category = categories.find(c => c.id === selectedCategoryId);
    
    // 2. Eğer bulunduysa, onun özelliklerini state'e at (Başlangıç durumu)
    // Not: Sadece ilk yüklemede veya kategori değişiminde çalışır.
    // Eğer kullanıcı yeni özellik eklerse state'i manuel güncelleyeceğiz.
    if (category) {
       // Mevcut state ile çakışmaması için basit bir kontrol yapılabilir ama
       // şimdilik her kategori değişiminde sıfırlayıp o kategorininkileri yüklüyoruz.
       // (Eğer yeni eklenen özellik props'ta yoksa kaybolabilir, bu yüzden aşağıda ekleme mantığına dikkat edeceğiz)
       const existingIds = currentAttributes.map(a => a.id);
       // Sadece state boşsa veya kategori gerçekten değiştiyse güncelle
       // (Bu kısım biraz basitleştirilmiştir, idealde daha kompleks bir merge gerekebilir)
       if (currentAttributes.length === 0 || !category.attributes.every(a => existingIds.includes(a.id))) {
           setCurrentAttributes(category.attributes);
       }
    } else {
        setCurrentAttributes([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId, categories]); // currentAttributes bağımlılığını kaldırdık sonsuz döngü olmasın diye

  // --- HIZLI OLUŞTURMA FONKSİYONLARI ---

  // 1. Yeni Kategori Ekleme
  const onCategoryCreate = async (name: string) => {
    try {
        setLoading(true);
        const newCategory = await createQuickCategory(params.storeId as string, name);
        toast.success("Kategori oluşturuldu.");
        router.refresh(); 
        form.setValue("categoryId", newCategory.id);
        form.setValue("attributes", []); 
        setCurrentAttributes([]); // Yeni kategori boş başlar
    } catch (error) {
        toast.error("Hata oluştu.");
    } finally {
        setLoading(false);
    }
  };

  // 2. Yeni Özellik (Attribute) Ekleme (Örn: Kumaş)
  const onAttributeCreate = async () => {
     // Kullanıcıya bir isim girmesi için prompt açalım (Veya daha şık bir modal yapılabilir)
     // Şimdilik basit prompt kullanıyoruz.
     const name = window.prompt("Yeni özellik adı girin (Örn: Materyal):");
     if (!name) return;

     if (!selectedCategoryId) {
         toast.error("Önce bir kategori seçmelisiniz.");
         return;
     }

     try {
         setLoading(true);
         // Backend'de oluştur ve kategoriye bağla
         const newAttribute = await createQuickAttribute(params.storeId as string, selectedCategoryId, name);
         
         // State'i güncelle (Ekrana hemen yansıması için)
         setCurrentAttributes((prev) => [...prev, { ...newAttribute, values: [] }]);
         
         toast.success(`${name} özelliği eklendi.`);
         router.refresh();
     } catch (error) {
         toast.error("Özellik eklenirken hata oluştu.");
     } finally {
         setLoading(false);
     }
  };

  // 3. Yeni Değer (Value) Ekleme (Örn: İpek)
  const onValueCreate = async (attributeId: string, name: string) => {
      try {
          setLoading(true);
          const newValue = await createQuickValue(attributeId, name);
          
          // State'i güncelle: İlgili attribute'u bul ve value listesine ekle
          setCurrentAttributes((prev) => prev.map((attr) => {
              if (attr.id === attributeId) {
                  return { ...attr, values: [...attr.values, newValue] };
              }
              return attr;
          }));

          // Yeni oluşturulan değeri formda seçili yap
          const currentSelection = form.getValues("attributes") || [];
          form.setValue("attributes", [...currentSelection, newValue.id]);

          toast.success("Değer eklendi.");
          router.refresh();
      } catch (error) {
          toast.error("Değer eklenirken hata oluştu.");
      } finally {
          setLoading(false);
      }
  };

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
          
          {/* Görsel */}
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

          {/* Temel Bilgiler */}
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

            {/* Kategori Seçimi (Creatable) */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <CreatableSelect 
                    options={categories.map(c => ({ label: c.name, value: c.id }))}
                    value={field.value}
                    onChange={(value) => {
                         field.onChange(value);
                         form.setValue("attributes", []); 
                         // Kategori değişince state'i sıfırla, useEffect zaten yenisini yükleyecek
                         setCurrentAttributes([]);
                    }}
                    onCreate={onCategoryCreate}
                    placeholder="Kategori seçin veya oluşturun..."
                    label="Kategori"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />
          
          {/* --- GELİŞMİŞ ÖZELLİK (VARYASYON) YÖNETİMİ --- */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                 <div>
                    <h3 className="text-lg font-medium">Ürün Özellikleri</h3>
                    <p className="text-sm text-muted-foreground">
                        Bu ürünün varyasyonlarını (Renk, Beden vb.) buradan yönetebilirsiniz.
                    </p>
                 </div>
                 {/* YENİ ÖZELLİK EKLEME BUTONU */}
                 {selectedCategoryId && (
                     <Button type="button" onClick={onAttributeCreate} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Yeni Özellik Ekle
                     </Button>
                 )}
             </div>

             {!selectedCategoryId ? (
                 <div className="p-4 bg-slate-100 rounded text-sm text-center">
                    Özellik eklemek için lütfen önce kategori seçiniz.
                 </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* MEVCUT ÖZELLİKLERİ LİSTELE */}
                    {currentAttributes.map((attribute) => (
                        <FormItem key={attribute.id} className="p-4 border rounded-md bg-white shadow-sm">
                            <FormLabel className="font-semibold flex items-center justify-between">
                                {attribute.name}
                            </FormLabel>
                            
                            {/* DEĞER SEÇİMİ (CreatableSelect) */}
                            {/* Burada Multi-Select mantığı için biraz hile yapıyoruz:
                                Şu an tekli seçim var gibi görünüyor ama altyapı çoklu seçime uygun.
                                Kullanıcı yeni değer oluşturdukça listeye eklenir.
                            */}
                            <CreatableSelect 
                                options={attribute.values.map(v => ({ label: v.name, value: v.id }))}
                                value={attribute.values.find(v => (form.watch("attributes") || []).includes(v.id))?.id}
                                onChange={(selectedValueId) => {
                                    // Çoklu seçim (Multi-Select) mantığı:
                                    const current = form.getValues("attributes") || [];
                                    
                                    // 1. Bu özelliğe ait daha önce seçilmiş değerleri temizle (Tek seçim istiyorsak)
                                    // Eğer "Renk" için hem Kırmızı hem Mavi seçilsin istiyorsan burayı değiştirmeliyiz.
                                    // Şimdilik standart "Dropdown" mantığıyla tek seçim yapıyoruz.
                                    const otherValuesIds = attribute.values.map(v => v.id);
                                    const cleaned = current.filter(id => !otherValuesIds.includes(id));
                                    
                                    // 2. Yeni seçimi ekle
                                    // Eğer boş string geldiyse (seçimi kaldır) ekleme yapma
                                    if(selectedValueId) {
                                        form.setValue("attributes", [...cleaned, selectedValueId]);
                                    } else {
                                        form.setValue("attributes", [...cleaned]);
                                    }
                                }}
                                onCreate={(name) => onValueCreate(attribute.id, name)}
                                placeholder={`${attribute.name} seçin veya ekleyin...`}
                                label={attribute.name}
                            />
                        </FormItem>
                    ))}

                    {currentAttributes.length === 0 && (
                        <div className="col-span-full text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                            Bu kategoride henüz tanımlı özellik yok. 
                            <br />
                            Yukarıdaki <b>"Yeni Özellik Ekle"</b> butonunu kullanarak hemen oluşturabilirsiniz.
                        </div>
                    )}
                </div>
             )}
          </div>
          
          <Separator />

          {/* Checkboxlar */}
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