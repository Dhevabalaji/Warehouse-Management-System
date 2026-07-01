import { Package, ShoppingCart, Truck, BarChart3 } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { products, purchaseOrders } from "../../data/mockData";

const stats = [
  { title: "Inventory Items", value: "8,420", icon: Package },
  { title: "Low Stock", value: "37", icon: BarChart3 },
  { title: "Purchase Orders", value: "18", icon: ShoppingCart },
  { title: "Active Shipments", value: "9", icon: Truck },
];

export default function ManagerDashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Manager Dashboard</h1>
      <p className="text-muted mt-1">Warehouse operations and inventory control</p>

      <div className="grid md:grid-cols-4 gap-6 mt-8">
        {stats.map(({ title, value, icon: Icon }) => (
          <div key={title} className="card p-6">
            <Icon className="text-green mb-4" size={30} />
            <h3 className="text-3xl font-bold text-navy">{value}</h3>
            <p className="text-muted">{title}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-navy">Low Stock Products</h2>

          <div className="mt-5 space-y-4">
            {products
              .filter((p) => p.status !== "In Stock")
              .map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between border-b border-slate-100 pb-3"
                >
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-muted">{product.sku}</p>
                  </div>
                  <span className="text-danger font-bold">{product.qty}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-navy">Purchase Orders</h2>

          <div className="mt-5 space-y-4">
            {purchaseOrders.map((po) => (
              <div
                key={po.id}
                className="flex justify-between border-b border-slate-100 pb-3"
              >
                <div>
                  <p className="font-semibold">{po.id}</p>
                  <p className="text-sm text-muted">{po.supplier}</p>
                </div>
                <span className="text-navy font-bold">{po.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}