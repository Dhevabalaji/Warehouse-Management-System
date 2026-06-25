import {
  Package,
  Warehouse,
  Users,
  Truck,
  ArrowRightLeft,
  AlertTriangle,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getStorage } from "../../utils/storageService";
import useAuthContext from "../../hooks/useAuthContext";

export default function ReportsPage() {
  const { user } = useAuthContext();

  const inventory = getStorage("wms_inventory", []).filter(
    (item) => item.companyCode === user?.companyCode
  );

  const warehouses = getStorage("wms_warehouses", []).filter(
    (warehouse) => warehouse.companyCode === user?.companyCode
  );

  const suppliers = getStorage("wms_suppliers", []).filter(
    (supplier) => supplier.companyCode === user?.companyCode
  );

  const purchaseOrders = getStorage("wms_purchase_orders", []).filter(
    (order) => order.companyCode === user?.companyCode
  );

  const transfers = getStorage("wms_inventory_transfers", []).filter(
    (transfer) => transfer.companyCode === user?.companyCode
  );

  const stockMovements = getStorage("wms_stock_movements", []).filter(
    (movement) => movement.companyCode === user?.companyCode
  );

  const lowStock = inventory.filter(
    (item) => Number(item.qty) <= Number(item.minQty)
  );

  const inventoryValue = inventory.reduce(
    (sum, item) => sum + Number(item.qty) * Number(item.price || 0),
    0
  );

  const cards = [
    {
      title: "Inventory Items",
      value: inventory.length,
      icon: Package,
    },
    {
      title: "Warehouses",
      value: warehouses.length,
      icon: Warehouse,
    },
    {
      title: "Suppliers",
      value: suppliers.length,
      icon: Truck,
    },
    {
      title: "Purchase Orders",
      value: purchaseOrders.length,
      icon: Users,
    },
    {
      title: "Transfers",
      value: transfers.length,
      icon: ArrowRightLeft,
    },
    {
      title: "Low Stock",
      value: lowStock.length,
      icon: AlertTriangle,
    },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">
        Reports Dashboard
      </h1>

      <p className="text-muted mt-1">
        Company performance reports
      </p>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        {cards.map(({ title, value, icon: Icon }) => (
          <div
            key={title}
            className="card p-6"
          >
            <Icon
              className="text-green mb-4"
              size={30}
            />

            <h3 className="text-3xl font-bold text-navy">
              {value}
            </h3>

            <p className="text-muted">
              {title}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        <div className="card p-6">

          <h2 className="text-xl font-bold text-navy mb-5">
            Inventory Summary
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span>Total Inventory Value</span>
              <span className="font-bold">
                ₹{inventoryValue.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total Products</span>
              <span>{inventory.length}</span>
            </div>

            <div className="flex justify-between">
              <span>Low Stock</span>
              <span className="text-danger">
                {lowStock.length}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Stock Movements</span>
              <span>{stockMovements.length}</span>
            </div>

          </div>

        </div>

        <div className="card p-6">

          <h2 className="text-xl font-bold text-navy mb-5">
            Procurement Summary
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span>Suppliers</span>
              <span>{suppliers.length}</span>
            </div>

            <div className="flex justify-between">
              <span>Purchase Orders</span>
              <span>{purchaseOrders.length}</span>
            </div>

            <div className="flex justify-between">
              <span>Warehouse Transfers</span>
              <span>{transfers.length}</span>
            </div>

            <div className="flex justify-between">
              <span>Warehouses</span>
              <span>{warehouses.length}</span>
            </div>

          </div>

        </div>

      </div>

      <div className="card p-6 mt-8">

        <h2 className="text-xl font-bold text-navy mb-5">
          Report Downloads
        </h2>

        <div className="grid md:grid-cols-4 gap-4">

          <button className="btn-primary">
            Inventory Report
          </button>

          <button className="btn-primary">
            Warehouse Report
          </button>

          <button className="btn-primary">
            Supplier Report
          </button>

          <button className="btn-primary">
            Purchase Report
          </button>

        </div>

      </div>
    </DashboardLayout>
  );
}