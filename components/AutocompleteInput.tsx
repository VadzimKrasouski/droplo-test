"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

export interface AutocompleteInputProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function AutocompleteInput({
  options = [],
  value,
  onChange,
  placeholder = "Select an option...",
  className,
}: AutocompleteInputProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState(value || "");

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    onChange(newValue);
    setOpen(true);
  };

  const handleSelectOption = (option: string) => {
    onChange(option);
    setSearchValue(option);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="relative flex">
        <Search className="h-[15px] w-[15px] absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          value={searchValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pl-10 bg-background-white shadow-input"
        />
      </div>

      {searchValue.length > 0 && filteredOptions.length > 0 && open && (
        <div className="w-full">
          <div className="rounded-md border bg-popover text-popover-foreground shadow-md">
            <ScrollArea className="max-h-[300px]">
              {filteredOptions.map((option) => (
                <div
                  key={option}
                  className={cn(
                    "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                    value === option && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => handleSelectOption(option)}
                >
                  {option}
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}
