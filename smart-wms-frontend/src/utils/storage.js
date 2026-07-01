import { STORAGE_KEYS } from "../constants";
import {
  tenants,
  users,
  warehouses,
  products,
  suppliers,
  purchaseOrders,
  stockMovements,
  stockRequests,
  tasks,
  damagedGoods,
} from "../data/mockData";

export function getStorage(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
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

export function getAuthUser() {
  return getStorage(STORAGE_KEYS.AUTH_USER, null);
}

export function setAuthUser(user) {
  setStorage(STORAGE_KEYS.AUTH_USER, user);
}

export function clearAuthUser() {
  localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
}

export function getTenants() {
  return getStorage(STORAGE_KEYS.TENANTS, []);
}

export function getUsers() {
  return getStorage(STORAGE_KEYS.USERS, []);
}

export function getWarehouses() {
  return getStorage(STORAGE_KEYS.WAREHOUSES, []);
}

export function getProducts() {
  return getStorage(STORAGE_KEYS.PRODUCTS, []);
}

export function getSuppliers() {
  return getStorage(STORAGE_KEYS.SUPPLIERS, []);
}

export function seedInitialData() {
  const seeded = localStorage.getItem("smart_wms_seeded");

  if (seeded === "true") return;

  setStorage(STORAGE_KEYS.TENANTS, tenants);
  setStorage(STORAGE_KEYS.USERS, users);
  setStorage(STORAGE_KEYS.WAREHOUSES, warehouses);
  setStorage(STORAGE_KEYS.PRODUCTS, products);
  setStorage(STORAGE_KEYS.SUPPLIERS, suppliers);
  setStorage(STORAGE_KEYS.PURCHASE_ORDERS, purchaseOrders);
  setStorage(STORAGE_KEYS.STOCK_MOVEMENTS, stockMovements);
  setStorage(STORAGE_KEYS.STOCK_REQUESTS, stockRequests);
  setStorage(STORAGE_KEYS.TASKS, tasks);
  setStorage(STORAGE_KEYS.DAMAGED_GOODS, damagedGoods);

  localStorage.setItem("smart_wms_seeded", "true");
}