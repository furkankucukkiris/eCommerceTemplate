"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; 
import { Filter } from "@/components/filter"; 
import { AttributeValue, Attribute } from "@/types";

interface MobileFiltersProps {
  attributes: (Attribute & { values: AttributeValue[] })[];
}

export const MobileFilters: React.FC<MobileFiltersProps> = ({
  attributes
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="flex items-center gap-x-2 lg:hidden">
          Filtreler
          <Plus size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="p-4">
          {/* Shadcn SheetContent içinde kapatma butonu otomatik gelir */}
          <div className="p-4">
            {attributes.map((attr) => (
              <Filter
                key={attr.id}
                valueKey={`${attr.name}Id`} 
                name={attr.name}
                data={attr.values}
              />
            ))}
          </div>
      </SheetContent>
    </Sheet>
  );
};