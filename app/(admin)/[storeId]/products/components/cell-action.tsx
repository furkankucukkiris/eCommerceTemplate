"use client";

import { useState } from "react";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner"; // veya hot-toast, projenizde ne kuruluysa
import { useParams, useRouter } from "next/navigation";
import { ProductColumn } from "./columns"; // Dosya yolu aynı klasördeyse
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { deleteProduct } from "@/actions/products"; // Az önce yazdığımız action

interface CellActionProps {
  data: any; // Buraya Product Column tipi de verilebilir
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      // Server Action çağırıyoruz
      await deleteProduct(params.storeId as string, data.id);
      toast.success("Ürün silindi.");
      router.refresh(); // Sayfayı yenile
    } catch (error) {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("ID kopyalandı.");
  };

  return (
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
        <DropdownMenuItem onClick={() => {
            if (window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
                onConfirm();
            }
        }}>
          <Trash className="mr-2 h-4 w-4" /> Sil
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};