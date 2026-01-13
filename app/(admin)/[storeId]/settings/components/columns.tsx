"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action" // Birazdan oluşturacağız veya mevcut olanı kullanacağız

export type AttributeColumn = {
  id: string
  name: string
  valueType: string
  createdAt: string
}

export const columns: ColumnDef<AttributeColumn>[] = [
  {
    accessorKey: "name",
    header: "İsim",
  },
  {
    accessorKey: "valueType",
    header: "Tip",
    cell: ({ row }) => (
        <div className="font-mono text-xs bg-slate-100 p-1 rounded inline-block">
            {row.original.valueType}
        </div>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Oluşturulma Tarihi",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
]