import {
  Package,
  ShoppingCart,
  Truck,
  BarChart3,
  ClipboardList,
  ArrowRightLeft,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getStorage } from "../../utils/storageService";
import useAuthContext from "../../hooks/useAuthContext";

export default function ManagerDashboard() {
  const { user } = useAuthContext();

  const inventory = getStorage("wms_inventory", []).filter(
    (item) => item.companyCode === user?.companyCode
  );

  const purchaseOrders = getStorage("wms_purchase_orders", []).filter(
    (order) => order.companyCode === user?.companyCode
  );

  const tasks = getStorage("wms_tasks", []).filter(
    (task) => task.companyCode === user?.companyCode
  );

  const transfers = getStorage("wms_inventory_transfers", []).filter(
    (transfer) => transfer.companyCode === user?.companyCode
  );

  const lowStockProducts = inventory.filter(
    (item) => Number(item.qty) <= Number(item.minQty)
  );

  const pendingTasks = tasks.filter((task) => task.status !== "Completed");

  const pendingTransfers = transfers.filter(
    (transfer) => transfer.status === "Pending"
  );

  const stats = [
    { title: "Inventory Items", value: inventory.length, icon: Package },
    { title: "Low Stock", value: lowStockProducts.length, icon: BarChart3 },
    { title: "Purchase Orders", value: purchaseOrders.length, icon: ShoppingCart },
    { title: "Pending Tasks", value: pendingTasks.length, icon: ClipboardList },
    { title: "Transfers", value: pendingTransfers.length, icon: ArrowRightLeft },
    { title: "Active Shipments", value: 9, icon: Truck },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Manager Dashboard</h1>
      <p className="text-muted mt-1">
        Warehouse operations, task control, and inventory monitoring
      </p>

      <div className="grid md:grid-cols-3 xl:grid-cols-6 gap-6 mt-8">
        {stats.map(({ title, value, icon: Icon }) => (
          <div key={title} className="card p-6">
            <Icon className="text-green mb-4" size={30} />
            <h3 className="text-3xl font-bold text-navy">{value}</h3>
            <p className="text-muted text-sm">{title}</p>
          </div>
        ))}
      </div>

      <div className="grid xl:grid-cols-3 gap-6 mt-8">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-navy">Low Stock Products</h2>

          <div className="mt-5 space-y-4">
            {lowStockProducts.length === 0 ? (
              <p className="text-muted">No low stock products.</p>
            ) : (
              lowStockProducts.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between border-b border-slate-100 pb-3"
                >
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-muted">{product.sku}</p>
                  </div>

                  <span
                    className={`font-bold ${
                      Number(product.qty) === 0 ? "text-danger" : "text-warning"
                    }`}
                  >
                    {product.qty}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-navy">Recent Tasks</h2>

          <div className="mt-5 space-y-4">
            {tasks.length === 0 ? (
              <p className="text-muted">No tasks assigned yet.</p>
            ) : (
              tasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="border-b border-slate-100 pb-3"
                >
                  <p className="font-semibold">{task.title}</p>
                  <p className="text-sm text-muted">
                    {task.priority} Priority • {task.status}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-navy">Transfer Requests</h2>

          <div className="mt-5 space-y-4">
            {transfers.length === 0 ? (
              <p className="text-muted">No transfers created yet.</p>
            ) : (
              transfers.slice(0, 5).map((transfer) => (
                <div
                  key={transfer.id}
                  className="border-b border-slate-100 pb-3"
                >
                  <p className="font-semibold">{transfer.product}</p>
                  <p className="text-sm text-muted">
                    {transfer.fromWarehouse} → {transfer.toWarehouse}
                  </p>
                  <p className="text-sm font-semibold text-navy">
                    {transfer.status}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}