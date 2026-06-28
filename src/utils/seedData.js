import { products, suppliers, purchaseOrders, demoUsers } from "../data/mockData";
import { getStorage, setStorage } from "./storageService";

const defaultTenants = [
  {
    tenantId: "TNT001",
    companyName: "WMS Pro Logistics",
    companyCode: "WMSPRO",
    companyEmail: "admin@wms.io",
    phone: "9876543210",
    address: "Chennai, Tamil Nadu",
    createdAt: new Date().toISOString(),
  },
];

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
    status: "Active",
  },
  {
    id: "WH-002",
    name: "South Distribution",
    code: "SD-002",
    location: "Coimbatore",
    capacity: "64",
    manager: "Priya Nair",
    companyCode: "WMSPRO",
    tenantId: "TNT001",
    status: "Active",
  },
];

export function seedAppData() {
  if (getStorage("wms_tenants", []).length === 0) {
    setStorage("wms_tenants", defaultTenants);
  }

  if (getStorage("wms_inventory", []).length === 0) {
    setStorage(
      "wms_inventory",
      products.map((product) => ({
        ...product,
        companyCode: "WMSPRO",
        tenantId: "TNT001",
      }))
    );
  }

  if (getStorage("wms_warehouses", []).length === 0) {
    setStorage("wms_warehouses", defaultWarehouses);
  }

  if (getStorage("wms_suppliers", []).length === 0) {
    setStorage(
      "wms_suppliers",
      suppliers.map((supplier) => ({
        ...supplier,
        companyCode: "WMSPRO",
        tenantId: "TNT001",
      }))
    );
  }

  if (getStorage("wms_purchase_orders", []).length === 0) {
    setStorage(
      "wms_purchase_orders",
      purchaseOrders.map((order) => ({
        ...order,
        companyCode: "WMSPRO",
        tenantId: "TNT001",
      }))
    );
  }

  if (getStorage("wms_custom_users", []).length === 0) {
    setStorage("wms_custom_users", []);
  }

  if (getStorage("wms_demo_users", []).length === 0) {
    setStorage("wms_demo_users", demoUsers);
  }

  if (getStorage("wms_tasks", []).length === 0) {
    setStorage("wms_tasks", []);
  }

  if (getStorage("wms_stock_movements", []).length === 0) {
    setStorage("wms_stock_movements", []);
  }

  if (getStorage("wms_stock_requests", []).length === 0) {
    setStorage("wms_stock_requests", []);
  }

  if (getStorage("wms_damaged_goods", []).length === 0) {
    setStorage("wms_damaged_goods", []);
  }

  if (getStorage("wms_inventory_transfers", []).length === 0) {
    setStorage("wms_inventory_transfers", []);
  }
}