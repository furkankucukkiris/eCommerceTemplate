"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { AttributeColumn, columns } from "./columns";

interface AttributesClientProps {
  data: AttributeColumn[];
}

export const AttributesClient: React.FC<AttributesClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Nitelikler (${data.length})`}
          description="Ürünleriniz için varyasyon seçeneklerini (Beden, Renk vb.) buradan yönetin."
        />
        <Button onClick={() => router.push(`/${params.storeId}/settings/attributes/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Ekle
        </Button>
      </div>
      <Separator className="my-4" />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};