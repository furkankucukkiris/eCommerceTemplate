"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type CategoryColumn = {
  id: string;
  name: string;
  createdAt: string;
}

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "İsim",
  },
  {
    accessorKey: "createdAt",
    header: "Oluşturulma Tarihi",
  },
  {
    id: "actions",
    header: "İşlemler", // BU SATIR BAŞLIĞI GÖSTERİR
    cell: ({ row }) => <CellAction data={row.original} />
  },
];