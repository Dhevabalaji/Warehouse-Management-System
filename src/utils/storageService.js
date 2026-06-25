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

export function updateInventoryQuantity({ sku, quantity, type, companyCode }) {
  const inventory = getStorage("wms_inventory", []);

  const qty = Number(quantity);

  const updatedInventory = inventory.map((item) => {
    if (item.sku === sku && item.companyCode === companyCode) {
      const currentQty = Number(item.qty);

      return {
        ...item,
        qty: type === "Stock In" ? currentQty + qty : Math.max(currentQty - qty, 0),
        status:
          type === "Stock Out" && currentQty - qty <= item.minQty
            ? "Low Stock"
            : item.status,
      };
    }

    return item;
  });

  setStorage("wms_inventory", updatedInventory);
}