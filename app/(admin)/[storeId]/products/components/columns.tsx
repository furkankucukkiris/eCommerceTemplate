"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image" 
import { CellAction } from "./cell-action"
import { Check, X } from "lucide-react" // İkonları unutmayalım

export type ProductColumn = {
  id: string
  name: string
  price: string
  stock: number // Eksik kalmasın
  category: string
  isFeatured: boolean
  isArchived: boolean 
  createdAt: string
  image: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "image",
    header: "Görsel",
    cell: ({ row }) => {
      if (!row.original.image) {
        return <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">Yok</div>
      }
      return (
        // 1. BURAYA 'group' EKLENDİ
        <div className="relative w-12 h-12 min-w-[48px] rounded-md overflow-hidden border border-gray-200 group">
          <Image 
            src={row.original.image} 
            alt="Product" 
            fill 
            // 2. BURAYA HOVER EFEKTLERİ EKLENDİ
            className="object-cover transition-transform duration-200 group-hover:scale-110" 
          />
        </div>
      )
    }
  },
  {
    accessorKey: "name",
    header: "İsim",
  },
  {
    accessorKey: "stock",
    header: "Stok",
  },
  {
    accessorKey: "price",
    header: "Fiyat",
  },
  {
    accessorKey: "category",
    header: "Kategori",
  },
  {
    accessorKey: "isFeatured",
    header: "Vitrin",
    cell: ({ row }) => (
      <div className="flex items-center">
        {row.original.isFeatured ? (
            <div className="flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                 <Check className="h-3 w-3 mr-1" />
                 <span className="text-xs font-medium">Evet</span>
            </div>
        ) : (
            <div className="flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                 <X className="h-3 w-3 mr-1" />
                 <span className="text-xs font-medium">Hayır</span>
            </div>
        )}
      </div>
    )
  },
  {
    accessorKey: "isArchived",
    header: "Durum", // Başlığı "Durum" yaptım
    cell: ({ row }) => (
      <div className="flex items-center">
        {row.original.isArchived ? (
             <div className="flex items-center px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                <span className="text-xs font-medium">Arşivde</span>
             </div>
        ) : (
             <div className="flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                <span className="text-xs font-medium">Satışta</span>
             </div>
        )}
      </div>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Tarih",
  },
  {
    id: "actions",
    header: "İşlemler",
    cell: ({ row }) => <CellAction data={row.original} />
  },
]