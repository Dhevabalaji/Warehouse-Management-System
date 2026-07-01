import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { products } from "../../data/mockData";

export default function ProductSearchPage() {
  const [query, setQuery] = useState("");

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.sku.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Product Search</h1>
      <p className="text-muted mt-1">Search products using name or SKU</p>

      <div className="card p-6 mt-8">
        <input
          className="input"
          placeholder="Search product or SKU..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="mt-6 space-y-4">
          {filteredProducts.map((p) => (
            <div key={p.id} className="p-4 bg-slate-100 rounded-xl flex justify-between">
              <div>
                <h3 className="font-bold text-navy">{p.name}</h3>
                <p className="text-sm text-muted">{p.sku} • {p.location}</p>
              </div>
              <span className="font-bold text-navy">{p.qty} units</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}