"use client";

import { useState, useTransition } from "react";
import { Edit, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal";
import { deleteCategory } from "@/actions/categories";

interface CellActionProps {
  data: {
    id: string;
    name: string;
    createdAt: string;
  }
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onDelete = async () => {
    startTransition(() => {
      deleteCategory(params.storeId as string, data.id)
        .then(() => {
          setOpen(false);
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
      
      {/* Yan yana butonlar için flex container */}
      <div className="flex items-center gap-x-2">
        
        {/* Düzenle Butonu */}
        <Button 
          onClick={() => router.push(`/${params.storeId}/categories/${data.id}`)} 
          variant="outline" 
          size="icon"
          className="h-8 w-8"
        >
          <Edit className="h-4 w-4" />
        </Button>

        {/* Sil Butonu */}
        <Button 
          onClick={() => setOpen(true)} 
          variant="destructive" 
          size="icon"
          className="h-8 w-8"
        >
          <Trash className="h-4 w-4" />
        </Button>
      
      </div>
    </>
  );
};