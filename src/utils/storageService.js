export function getStorage(key, fallback = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

export function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function addStorageItem(key, item) {
  const existing = getStorage(key, []);
  const updated = [...existing, item];
  setStorage(key, updated);
  return updated;
}

export function updateStorageItem(key, id, updatedItem) {
  const existing = getStorage(key, []);
  const updated = existing.map((item) =>
    item.id === id ? { ...item, ...updatedItem } : item
  );

  setStorage(key, updated);
  return updated;
}

export function deleteStorageItem(key, id) {
  const existing = getStorage(key, []);
  const updated = existing.filter((item) => item.id !== id);

  setStorage(key, updated);
  return updated;
}

export function updateInventoryQuantity({ sku, quantity, type, companyCode }) {
  const inventory = getStorage("wms_inventory", []);
  const qty = Number(quantity);

  const updatedInventory = inventory.map((item) => {
    if (item.sku === sku && item.companyCode === companyCode) {
      const currentQty = Number(item.qty);

      const newQty =
        type === "Stock In"
          ? currentQty + qty
          : Math.max(currentQty - qty, 0);

      return {
        ...item,
        qty: newQty,
        status:
          newQty === 0
            ? "Out of Stock"
            : newQty <= Number(item.minQty)
            ? "Low Stock"
            : "In Stock",
      };
    }

    return item;
  });

  setStorage("wms_inventory", updatedInventory);
  return updatedInventory;
}