"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image" 
import { CellAction } from "./cell-action"

export type ProductColumn = {
  id: string
  name: string
  price: string
  category: string
  isFeatured: boolean // CellAction için gerekli, ama tabloda göstermeyeceğiz
  isArchived: boolean // CellAction için gerekli
  createdAt: string
  image: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "image",
    header: "Görsel",
    cell: ({ row }) => {
      if (!row.original.image) {
        return <div className="w-10 h-10 bg-gray-100 rounded-md" />
      }
      return (
        <div className="relative w-10 h-10 min-w-[40px] rounded-md overflow-hidden border">
          <Image src={row.original.image} alt="Product" fill className="object-cover" />
        </div>
      )
    }
  },
  {
    accessorKey: "name",
    header: "İsim",
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
    accessorKey: "createdAt",
    header: "Tarih",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
]