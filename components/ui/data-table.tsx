"use client"; // 1. KRİTİK NOKTA: Bu satır en üstte olmalı

import { useState } from "react";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast"; // veya kullandığın toast kütüphanesi
import { useParams, useRouter } from "next/navigation"; // 2. KRİTİK NOKTA: next/navigation
import axios from "axios";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal"; // Eğer modalın varsa

interface CellActionProps {
  data: ProductColumn; // Buradaki tip senin columns.tsx'teki tipinle aynı olmalı
}

export const CellAction: React.FC<CellActionProps> = ({
  data
}) => {
  const router = useRouter();
  const params = useParams(); // URL parametrelerini (storeId vb.) almak için

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Kopyalama Fonksiyonu
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Ürün ID'si kopyalandı.");
  };

  // Düzenleme Fonksiyonu (Yönlendirme)
  const onEdit = () => {
    // Buradaki URL yapısının senin dosya yolunla eşleştiğinden emin ol
    // Örn: /admin/products/[productId] veya /[storeId]/products/[productId]
    router.push(`/${params.storeId}/products/${data.id}`);
  };

  // Silme Fonksiyonu (API İsteği)
  const onDelete = async () => {
    try {
      setLoading(true);
      // API yolunun backend'deki route.ts ile aynı olduğundan emin ol
      await axios.delete(`/api/${params.storeId}/products/${data.id}`);
      
      router.refresh(); // Sayfayı yenileyerek listeyi günceller
      toast.success("Ürün silindi.");
    } catch (error) {
      toast.error("Bir şeyler ters gitti.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      {/* Silme işlemi için onay modalı */}
      <AlertModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Menüyü aç</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
          
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            ID Kopyala
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Düzenle
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Sil
          </DropdownMenuItem>
          
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};