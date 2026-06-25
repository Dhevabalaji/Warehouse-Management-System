import { products } from "../data/mockData";
import { getStorage, setStorage } from "./storageService";

const defaultWarehouses = [
  {
    id: "WH-001",
    name: "Central Hub",
    code: "CH-001",
    location: "Chennai",
    capacity: "82",
    manager: "Sarah Okonkwo",
    companyCode: "WMSPRO",
    tenantId: "TNT001",
  },
  {
    id: "WH-002",
    name: "South Distribution",
    code: "SD-002",
    location: "Coimbatore",
    capacity: "64",
    manager: "Ravi Kumar",
    companyCode: "WMSPRO",
    tenantId: "TNT001",
  },
];

export function seedInventory() {
  const existingInventory = getStorage("wms_inventory", []);

  if (existingInventory.length === 0) {
    const inventory = products.map((product) => ({
      ...product,
      companyCode: "WMSPRO",
      tenantId: "TNT001",
    }));

    setStorage("wms_inventory", inventory);
  }
}

export function seedWarehouses() {
  const existingWarehouses = getStorage("wms_warehouses", []);

  if (existingWarehouses.length === 0) {
    setStorage("wms_warehouses", defaultWarehouses);
  }
}

export function seedAppData() {
  seedInventory();
  seedWarehouses();
}