import { INavigationItem } from "@/types/navigationTypes";

export const updateItemRecursively = (
  items: INavigationItem[],
  updatedItem: INavigationItem,
): INavigationItem[] => {
  return items.map((item) => {
    if (item.id === updatedItem.id) {
      return { ...updatedItem, children: item.children };
    }
    if (item.children?.length) {
      return {
        ...item,
        children: updateItemRecursively(item.children, updatedItem),
      };
    }
    return item;
  });
};

export const deleteItemRecursively = (
  items: INavigationItem[],
  itemId: string,
): INavigationItem[] => {
  return items
    .filter((item) => item.id !== itemId)
    .map((item) => {
      if (item.children) {
        return {
          ...item,
          children: deleteItemRecursively(item.children, itemId),
        };
      }
      return item;
    });
};

export const addChildItemRecursively = (
  items: INavigationItem[],
  parentId: string,
  newItem: INavigationItem,
): INavigationItem[] => {
  return items.map((item) => {
    if (item.id === parentId) {
      return { ...item, children: [...(item.children || []), newItem] };
    }
    if (item.children) {
      return {
        ...item,
        children: addChildItemRecursively(item.children, parentId, newItem),
      };
    }
    return item;
  });
};
