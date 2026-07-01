import DashboardLayout from "../../layouts/DashboardLayout";
import { products } from "../../data/mockData";

export default function ProductsPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Products</h1>
      <p className="text-muted mt-1">Manage product catalog and SKU details</p>

      <div className="card p-6 mt-8 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-muted border-b">
              <th className="py-3">Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="py-4 font-semibold">{p.name}</td>
                <td>{p.sku}</td>
                <td>{p.category}</td>
                <td>{p.qty}</td>
                <td>{p.location}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      p.status === "In Stock"
                        ? "bg-green/10 text-green"
                        : "bg-red-100 text-danger"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}