import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { INavigationItem } from "@/types/navigationTypes";
import { NavigationItem } from "./NavigationItem";
import { Button } from "@/components/ui/button";
import { NavigationItemForm } from "@/components/NavigationItemForm";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { NavigationEmpty } from "@/components/NavigationEmpty";

interface NavigationListProps {
  items: INavigationItem[];
  editingItemId: string | null;
  onEditItem: (item: INavigationItem | null) => void;
  onDeleteItem: (itemId: string) => void;
  onReorderItems: (items: INavigationItem[]) => void;
  onUpdateItem: (item: INavigationItem) => void;
  onAddChildItem: (parentId: string, newItem: INavigationItem) => void;
  onAddItem: (item: INavigationItem) => void;
}

export function NavigationList({
  items,
  editingItemId,
  onEditItem,
  onDeleteItem,
  onReorderItems,
  onUpdateItem,
  onAddChildItem,
  onAddItem,
}: NavigationListProps) {
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [activeItem, setActiveItem] = useState<INavigationItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart(event: any) {
    const { active } = event;

    const findItemRecursively = (
      items: INavigationItem[],
      id: string,
    ): INavigationItem | null => {
      for (const item of items) {
        if (item.id === id) {
          return item;
        }
        if (item.children?.length) {
          const found = findItemRecursively(item.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const draggedItem = findItemRecursively(items, active.id);
    setActiveItem(draggedItem);
  }

  const handleDragEnd = (event: any) => {
    setActiveItem(null);
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const reorderItems = (
      items: INavigationItem[],
      activeId: string,
      overId: string,
    ): INavigationItem[] => {
      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        return arrayMove(items, oldIndex, newIndex);
      }

      return items.map((item) => {
        if (item.children) {
          return {
            ...item,
            children: reorderItems(item.children, activeId, overId),
          };
        }
        return item;
      });
    };

    const newItems = reorderItems(items, active.id, over.id);
    onReorderItems(newItems);
  };

  const renderItems = (items: INavigationItem[], isDragging = false) => {
    return items.map((item) => (
      <NavigationItem
        key={item.id}
        item={item}
        isEditing={item.id === editingItemId}
        onEdit={onEditItem}
        onDelete={() => onDeleteItem(item.id)}
        onUpdate={onUpdateItem}
        onAddChild={onAddChildItem}
        setIsAddingNewItem={setIsAddingNewItem}
        isDragging={isDragging}
      >
        {item.children && item.children.length > 0 && (
          <SortableContext
            items={item.children}
            strategy={verticalListSortingStrategy}
          >
            <div className="ml-10 border-l rounded-bl-lg overflow-auto border-border-secondary">
              {renderItems(item.children)}
            </div>
          </SortableContext>
        )}
      </NavigationItem>
    ));
  };

  return items.length === 0 && !isAddingNewItem ? (
    <NavigationEmpty onAddItem={() => setIsAddingNewItem(true)} />
  ) : (
    <div className="border rounded overflow-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="bg-secondary">{renderItems(items)}</div>
        </SortableContext>
        <DragOverlay>
          {activeItem ? renderItems([activeItem], true) : null}
        </DragOverlay>
      </DndContext>
      {isAddingNewItem && (
        <div
          className={cn(
            "bg-secondary",
            items.length > 0 && "px-6 py-5 border-b border-border-secondary",
          )}
        >
          <div
            className={cn(
              items.length > 0 &&
                "border rounded-lg overflow-auto border-border-secondary",
            )}
          >
            <NavigationItemForm
              initialData={undefined}
              onSubmit={(item) => {
                onAddItem(item);
                setIsAddingNewItem(false);
              }}
              onCancel={() => {
                setIsAddingNewItem(false);
              }}
            />
          </div>
        </div>
      )}
      {items.length !== 0 && (
        <div className="px-6 py-5">
          <Button
            variant="outline"
            className="button"
            onClick={() => setIsAddingNewItem(true)}
          >
            Dodaj pozycję menu
          </Button>
        </div>
      )}
    </div>
  );
}
