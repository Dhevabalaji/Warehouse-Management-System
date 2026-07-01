import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getStorage } from "../../utils/storageService";
import useAuthContext from "../../hooks/useAuthContext";

export default function ProductSearchPage() {
  const { user } = useAuthContext();
  const [query, setQuery] = useState("");

  const inventory = getStorage("wms_inventory", []).filter(
    (item) => item.companyCode === user?.companyCode
  );

  const filteredProducts = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.sku.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Product Search</h1>
      <p className="text-muted mt-1">Search live inventory using product name or SKU</p>

      <div className="card p-6 mt-8">
        <input
          className="input"
          placeholder="Search product or SKU..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="mt-6 space-y-4">
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-slate-100 rounded-xl flex justify-between"
            >
              <div>
                <h3 className="font-bold text-navy">{item.name}</h3>
                <p className="text-sm text-muted">
                  {item.sku} • {item.location}
                </p>
              </div>

              <span
                className={`font-bold ${
                  Number(item.qty) <= Number(item.minQty)
                    ? "text-danger"
                    : "text-navy"
                }`}
              >
                {item.qty} units
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}