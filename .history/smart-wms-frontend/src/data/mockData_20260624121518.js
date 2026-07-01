export const demoUsers = [
  {
    id: 1,
    name: "Marcus Chen",
    email: "admin@wms.io",
    password: "12345678",
    role: "admin",
    tenantId: "TNT001",
    companyCode: "WMSPRO",
  },
  {
    id: 2,
    name: "Sarah Okonkwo",
    email: "manager@wms.io",
    password: "12345678",
    role: "manager",
    tenantId: "TNT001",
    companyCode: "WMSPRO",
    warehouse: "WH-001 Central Hub",
  },
  {
    id: 3,
    name: "Priya Nair",
    email: "staff@wms.io",
    password: "12345678",
    role: "staff",
    tenantId: "TNT001",
    companyCode: "WMSPRO",
    warehouse: "WH-001 Central Hub",
  },
];

export const products = [
  { id: 1, name: "Industrial Safety Helmet", sku: "ISH-4420", category: "Safety Equipment", qty: 1240, minQty: 200, price: 35, location: "A1-01", supplier: "Apex Industrial", status: "In Stock" },
  { id: 2, name: "Hydraulic Pallet Jack", sku: "HPJ-2200", category: "Material Handling", qty: 48, minQty: 10, price: 649, location: "B2-04", supplier: "PowerLift Co.", status: "In Stock" },
  { id: 3, name: "Nitrile Gloves (Box/100)", sku: "NGL-B100", category: "PPE", qty: 85, minQty: 150, price: 19, location: "A3-07", supplier: "SafeGuard Ltd.", status: "Low Stock" },
  { id: 4, name: 'Stretch Wrap Film 18"', sku: "SWF-1800", category: "Packaging", qty: 320, minQty: 50, price: 42, location: "C1-02", supplier: "PackRight Inc.", status: "In Stock" },
  { id: 5, name: "Barcode Label Rolls", sku: "BLR-5050", category: "Labeling", qty: 12, minQty: 30, price: 30, location: "D2-01", supplier: "PrintMaster", status: "Low Stock" },
  { id: 6, name: "Steel Shelving Unit 5-Tier", sku: "SSU-5T", category: "Storage", qty: 0, minQty: 5, price: 189, location: "E1-03", supplier: "MetalWorks", status: "Out of Stock" },
];

export const suppliers = [
  { id: 1, name: "Apex Industrial Supplies", contact: "James Whitmore", category: "Safety Equipment", orders: 128, onTime: "96%", rating: 4.8, status: "Active" },
  { id: 2, name: "PowerLift Co.", contact: "Diana Cruz", category: "Material Handling", orders: 64, onTime: "91%", rating: 4.5, status: "Active" },
  { id: 3, name: "SafeGuard Ltd.", contact: "Ahmed Hassan", category: "PPE", orders: 89, onTime: "88%", rating: 4.2, status: "Active" },
];

export const purchaseOrders = [
  { id: "PO-2024-0088", supplier: "Apex Industrial", products: "Safety Helmets x500", amount: "$17,495", status: "Pending" },
  { id: "PO-2024-0089", supplier: "SafeGuard Ltd.", products: "Nitrile Gloves x200", amount: "$3,700", status: "In Transit" },
  { id: "PO-2024-0090", supplier: "PrintMaster", products: "Barcode Label Rolls x50", amount: "$1,499", status: "Delivered" },
];