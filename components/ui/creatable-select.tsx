"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Option {
  label: string;
  value: string;
}

interface CreatableSelectProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  onCreate: (label: string) => Promise<void>;
  placeholder?: string;
  label?: string;
}

export const CreatableSelect: React.FC<CreatableSelectProps> = ({
  options,
  value,
  onChange,
  onCreate,
  placeholder = "Seçiniz...",
  label = "Öğe"
}) => {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Seçili öğeyi bul
  const selectedOption = options.find((option) => option.value === value);

  const handleCreate = async () => {
    if (!inputValue) return;
    try {
      setLoading(true);
      await onCreate(inputValue);
      setOpen(false);
      setInputValue("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder={`${label} ara...`} 
            onValueChange={setInputValue} 
          />
          <CommandList>
            <CommandEmpty className="p-1">
               {/* Sadece arama yapılmışsa ve sonuç yoksa oluştur butonu göster */}
               {inputValue.length > 0 && !loading && (
                 <Button 
                    variant="ghost" 
                    className="w-full justify-start text-sm h-auto py-2"
                    onClick={handleCreate}
                 >
                    <Plus className="mr-2 h-4 w-4" />
                    "{inputValue}" oluştur
                 </Button>
               )}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  // DÜZELTME: value prop'unu kaldırdık veya option.label yaptık.
                  // En garantisi, value prop'u option.label ile aynı olsun ki filtreleme çalışsın.
                  value={option.label}
                  onSelect={() => {
                    onChange(option.value); // ID'yi state'e gönder
                    setOpen(false);
                  }}
                  className="cursor-pointer" // Tıklanabilir olduğunu göstermek için
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};