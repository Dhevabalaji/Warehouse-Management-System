import DashboardLayout from "../../layouts/DashboardLayout";
import { products } from "../../data/mockData";

export default function InventoryPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Inventory</h1>
      <p className="text-muted mt-1">Track current stock levels and locations</p>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="card p-6">
          <h3 className="text-muted">Total Stock</h3>
          <p className="text-3xl font-bold text-navy mt-2">1,705</p>
        </div>
        <div className="card p-6">
          <h3 className="text-muted">Low Stock</h3>
          <p className="text-3xl font-bold text-danger mt-2">2</p>
        </div>
        <div className="card p-6">
          <h3 className="text-muted">Out of Stock</h3>
          <p className="text-3xl font-bold text-warning mt-2">1</p>
        </div>
      </div>

      <div className="card p-6 mt-8">
        <h2 className="text-xl font-bold text-navy mb-5">Stock Overview</h2>

        <div className="space-y-4">
          {products.map((p) => (
            <div key={p.id}>
              <div className="flex justify-between mb-1">
                <span className="font-semibold">{p.name}</span>
                <span className="text-muted">{p.qty} units</span>
              </div>
              <div className="h-3 bg-slate-200 rounded-full">
                <div
                  className="h-3 bg-green rounded-full"
                  style={{ width: `${Math.min((p.qty / 1300) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}