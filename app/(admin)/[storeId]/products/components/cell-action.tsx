"use client";

import { useState, useTransition } from "react";
import { Copy, Edit, Trash, Archive, ArchiveRestore, Star, StarOff } from "lucide-react"; // İkonları ekledik
import { toast } from "sonner"; 
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal";
import { deleteProduct, toggleArchive, toggleFeatured } from "@/actions/products";

interface CellActionProps {
  data: {
    id: string;
    isFeatured: boolean;
    isArchived: boolean;
  }
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onDelete = async () => {
    startTransition(() => {
      deleteProduct(params.storeId as string, data.id)
        .then(() => {
          toast.success("Ürün silindi.");
          router.refresh();
        })
        .catch(() => toast.error("Bir hata oluştu."))
        .finally(() => setOpen(false));
    });
  };

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("ID kopyalandı.");
  };

  // Arşivle / Geri Yükle Fonksiyonu
  const onToggleArchive = () => {
    startTransition(() => {
      const newValue = !data.isArchived;
      toggleArchive(params.storeId as string, data.id, newValue)
        .then(() => {
          toast.success(newValue ? "Ürün arşivlendi." : "Ürün arşivden çıkarıldı.");
          router.refresh();
        })
        .catch(() => toast.error("Hata oluştu."));
    });
  };

  // Öne Çıkar / Kaldır Fonksiyonu
  const onToggleFeatured = () => {
    startTransition(() => {
      const newValue = !data.isFeatured;
      toggleFeatured(params.storeId as string, data.id, newValue)
        .then(() => {
          toast.success(newValue ? "Ürün öne çıkarıldı." : "Öne çıkanlardan kaldırıldı.");
          router.refresh();
        })
        .catch(() => toast.error("Hata oluştu."));
    });
  };

  return (
    <div className="flex items-center gap-x-2">
      <AlertModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isPending}
      />
      
      {/* 1. ID Kopyala */}
      <Button onClick={() => onCopy(data.id)} variant="outline" size="icon" className="h-8 w-8" title="ID Kopyala">
        <Copy className="h-4 w-4" />
      </Button>

      {/* 2. Düzenle */}
      <Button onClick={() => router.push(`/${params.storeId}/products/${data.id}`)} variant="outline" size="icon" className="h-8 w-8" title="Düzenle">
        <Edit className="h-4 w-4" />
      </Button>

      {/* 3. Öne Çıkar (Aktifse dolu yıldız, değilse boş) */}
      <Button 
        onClick={onToggleFeatured} 
        variant={data.isFeatured ? "default" : "outline"} // Öne çıkanlar vurgulu olsun
        size="icon" 
        className="h-8 w-8"
        disabled={isPending}
        title={data.isFeatured ? "Öne Çıkanlardan Kaldır" : "Öne Çıkar"}
      >
        {data.isFeatured ? <Star className="h-4 w-4 fill-current" /> : <Star className="h-4 w-4" />}
      </Button>

      {/* 4. Arşivle (Arşivliyse Geri Yükle ikonu) */}
      <Button 
        onClick={onToggleArchive} 
        variant="outline"
        size="icon" 
        className="h-8 w-8"
        disabled={isPending}
        title={data.isArchived ? "Arşivden Çıkar" : "Arşivle"}
      >
        {data.isArchived ? <ArchiveRestore className="h-4 w-4 text-green-600" /> : <Archive className="h-4 w-4 text-orange-600" />}
      </Button>

      {/* 5. Sil */}
      <Button onClick={() => setOpen(true)} variant="destructive" size="icon" className="h-8 w-8" title="Sil">
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};