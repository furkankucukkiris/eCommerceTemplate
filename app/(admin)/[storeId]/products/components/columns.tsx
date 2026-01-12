"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action" // Yanındaki dosyayı çağırıyoruz

// Tabloda göstereceğimiz verinin tipi
export type ProductColumn = {
  id: string
  name: string
  price: string
  createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "İsim",
  },
  {
    accessorKey: "price",
    header: "Fiyat",
  },
  {
    accessorKey: "createdAt",
    header: "Oluşturulma Tarihi",
  },
  {
    id: "actions",
    // ESKİ HALİ: Uzun uzun DropdownMenu kodları vardı.
    // YENİ HALİ: Sadece CellAction bileşenini çağırıyoruz.
    // Çünkü tüm buton ve silme mantığı o dosyanın içinde.
    cell: ({ row }) => <CellAction data={row.original} />
  },
]