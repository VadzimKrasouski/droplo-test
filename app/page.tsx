"use client";

import { INavigationItem } from "@/types/navigationTypes";
import { useState } from "react";
import { NavigationList } from "@/components/NavigationList";
import {
  addChildItemRecursively,
  deleteItemRecursively,
  updateItemRecursively,
} from "@/components/utils/navigationUtils";

export default function Home() {
  const [navigationItems, setNavigationItems] = useState<INavigationItem[]>([]);
  const [editingItem, setEditingItem] = useState<INavigationItem | null>(null);

  const handleAddItem = (item: INavigationItem) => {
    setNavigationItems([...navigationItems, item]);
    setEditingItem(null);
  };

  const handleEditItem = (item: INavigationItem | null) =>
    setEditingItem(item?.id === editingItem?.id ? null : item);

  const handleUpdateItem = (updatedItem: INavigationItem) => {
    setNavigationItems(updateItemRecursively(navigationItems, updatedItem));
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    setNavigationItems(deleteItemRecursively(navigationItems, itemId));
  };

  const handleReorderItems = (reorderedItems: INavigationItem[]) => {
    setNavigationItems(reorderedItems);
  };

  const handleAddChildItem = (parentId: string, newItem: INavigationItem) => {
    setNavigationItems(
      addChildItemRecursively(navigationItems, parentId, newItem),
    );
    setEditingItem(null);
  };

  return (
    <main className="main-content">
      <div className="page-container">
        <NavigationList
          items={navigationItems}
          editingItemId={editingItem?.id || null}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
          onReorderItems={handleReorderItems}
          onUpdateItem={handleUpdateItem}
          onAddChildItem={handleAddChildItem}
          onAddItem={handleAddItem}
        />
      </div>
    </main>
  );
}
