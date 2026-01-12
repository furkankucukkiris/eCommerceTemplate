"use client";

import { useState } from "react";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner"; 
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { AlertModal } from "@/components/modals/alert-modal";
import axios from "axios";

// ProductColumn tipini import etmek yerine basitçe burada tanımlayabiliriz 
// veya 'any' kullanabiliriz hata almamak için.
interface CellActionProps {
  data: {
    id: string;
    // İhtiyaç duyulan diğer alanlar eklenebilir ama şu an id yeterli
  }
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      // API isteği
      await axios.delete(`/api/${params.storeId}/products/${data.id}`);
      toast.success("Ürün silindi.");
      router.refresh();
    } catch (error) {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("ID kopyalandı.");
  };

  return (
    <>
      <AlertModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
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
            <Copy className="mr-2 h-4 w-4" /> ID Kopyala
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/products/${data.id}`)}>
            <Edit className="mr-2 h-4 w-4" /> Düzenle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Sil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};