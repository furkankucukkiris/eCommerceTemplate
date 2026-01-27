"use client";

import * as React from "react";
import { X, Check, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
  color?: string; // Renk kodu (varsa)
};

interface FancyMultiSelectProps {
  options: Option[];
  selected: string[]; // Seçili ID'ler
  onChange: (values: string[]) => void;
  onCreate?: (label: string) => Promise<void>;
  placeholder?: string;
  label?: string;
  isColor?: boolean; // Bu bir renk seçimi mi?
}

export function FancyMultiSelect({
  options,
  selected,
  onChange,
  onCreate,
  placeholder = "Seçiniz...",
  label = "Öğe",
  isColor = false,
}: FancyMultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Seçili ID'lerden Option objelerine ulaş
  const selectedValues = options.filter((opt) => selected.includes(opt.value));
  
  // Seçilmemiş olanları filtrele (Listede sadece seçilmeyenler görünsün)
  const selectables = options.filter((opt) => !selected.includes(opt.value));

  const handleUnselect = (id: string) => {
    onChange(selected.filter((s) => s !== id));
  };

  const handleCreate = async () => {
    if (!inputValue || !onCreate) return;
    try {
      setLoading(true);
      await onCreate(inputValue);
      setInputValue("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "" && selected.length > 0) {
            // Backspace ile son seçileni sil
            const newSelected = [...selected];
            newSelected.pop();
            onChange(newSelected);
          }
        }
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [selected, onChange]
  );

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div
        className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 bg-white"
      >
        <div className="flex gap-1 flex-wrap">
          {/* SEÇİLENLER (BADGES) */}
          {selectedValues.map((option) => (
            <Badge key={option.value} variant="secondary" className="hover:bg-secondary/80 pl-1 pr-2 py-1 flex items-center gap-2">
              {isColor && (
                 <div 
                    className="w-3 h-3 rounded-full border border-gray-300" 
                    style={{ backgroundColor: option.value }} // Renk kodu value içinde geliyorsa
                 />
              )}
              <span>{option.label}</span>
              <button
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUnselect(option.value);
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleUnselect(option.value)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          
          {/* INPUT ALANI */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={selectedValues.length > 0 ? "" : placeholder}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1 min-w-[100px]"
          />
        </div>
      </div>
      
      {/* AÇILIR LİSTE */}
      <div className="relative mt-2">
        {open && (
          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandList>
                {/* YENİ OLUŞTURMA SEÇENEĞİ */}
                {inputValue.length > 0 && !loading && (
                    <CommandItem
                        onSelect={handleCreate}
                        className="cursor-pointer font-medium text-primary flex items-center justify-center py-3 bg-slate-50"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        "{inputValue}" oluştur
                    </CommandItem>
                )}

                {!loading && selectables.length === 0 && inputValue.length === 0 && (
                     <p className="p-4 text-sm text-center text-muted-foreground">Sonuç bulunamadı.</p>
                )}

                <CommandGroup className="h-full overflow-auto max-h-[200px]">
                    {selectables.map((option) => (
                    <CommandItem
                        key={option.value}
                        onSelect={() => {
                            setInputValue("");
                            onChange([...selected, option.value]);
                        }}
                        className="cursor-pointer"
                    >
                        {isColor && (
                            <div 
                                className="w-4 h-4 rounded-full border border-gray-200 mr-2" 
                                style={{ backgroundColor: option.value }} // Hex kodu value ise
                            />
                        )}
                        {option.label}
                        <Check
                            className={cn(
                                "ml-auto h-4 w-4",
                                selected.includes(option.value) ? "opacity-100" : "opacity-0"
                            )}
                        />
                    </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
          </div>
        )}
      </div>
    </Command>
  );
}