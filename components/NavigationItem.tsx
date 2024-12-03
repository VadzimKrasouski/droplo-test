"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Move } from "lucide-react";
import { useState } from "react";
import { INavigationItem } from "@/types/navigationTypes";
import { NavigationItemForm } from "@/components/NavigationItemForm";
import { cn } from "@/lib/utils";

interface NavigationItemProps {
  item: INavigationItem;
  isEditing: boolean;
  onEdit: (item: INavigationItem | null) => void;
  onDelete: () => void;
  onUpdate: (item: INavigationItem) => void;
  onAddChild: (parentId: string, newItem: INavigationItem) => void;
  children?: React.ReactNode;
  isDragging: boolean;
  setIsAddingNewItem: React.Dispatch<React.SetStateAction<boolean>>;
}

export function NavigationItem({
  item,
  isEditing,
  onEdit,
  onDelete,
  onUpdate,
  onAddChild,
  children,
  isDragging,
  setIsAddingNewItem,
}: NavigationItemProps) {
  const [isAddingNewChild, setIsAddingNewChild] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });
  isDragging && console.log(isDragging);
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };
  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "bg-white border-b border-border-secondary",
          isDragging && "shadow-lg cursor-grabbing",
          !isDragging && "touch-none",
        )}
      >
        <div className="flex items-center mx-6 gap-1">
          <div
            {...attributes}
            {...listeners}
            className="flex justify-center items-center cursor-grab h-10 w-10"
          >
            <Move className="h-5 w-5 subtitle-1" />
          </div>
          <div className="flex-1 my-4 gap-1.5">
            <div className="title-1">{item.label}</div>
            <a className="subtitle-1" href={item.url}>
              {item.url}
            </a>
          </div>
          <div className="flex items-center">
            <div className="inline-flex rounded-lg border bg-white shadow-sm">
              <Button
                variant="ghost"
                className="px-3 rounded-l-lg rounded-r-none border-r hover:bg-accent"
                onClick={onDelete}
              >
                Usuń
              </Button>
              <Button
                variant="ghost"
                className="px-3 rounded-none border-r hover:bg-accent"
                onClick={() => {
                  onEdit(item);
                  setIsAddingNewItem(false);
                  setIsAddingNewChild(false);
                }}
              >
                Edytuj
              </Button>
              <Button
                variant="ghost"
                className="px-3 rounded-r-lg rounded-l-none hover:bg-accent"
                onClick={() => {
                  onEdit(null);
                  setIsAddingNewItem(false);
                  setIsAddingNewChild(true);
                }}
              >
                Dodaj pozycję menu
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isAddingNewChild && (
        <div className="bg-secondary flex flex-col border-t border-b border-border-secondary">
          <div className="mx-6 my-4 border rounded-lg overflow-auto">
            <NavigationItemForm
              initialData={undefined}
              onSubmit={(newItem) => {
                onAddChild(item.id, newItem);
                setIsAddingNewChild(false);
              }}
              onCancel={() => setIsAddingNewChild(false)}
            />
          </div>
        </div>
      )}
      {isEditing && (
        <div className="flex flex-col border-t border-b border-border-secondary">
          <div className="mx-6 my-4 border rounded-lg overflow-auto">
            <NavigationItemForm
              initialData={item}
              onSubmit={(updatedItem) => {
                onUpdate(updatedItem);
                onEdit(item);
              }}
              onDelete={onDelete}
              onCancel={() => onEdit(null)}
            />
          </div>
        </div>
      )}
      {children}
    </>
  );
}
