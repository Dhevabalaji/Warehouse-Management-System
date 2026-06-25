import DashboardLayout from "../../layouts/DashboardLayout";
import { getStorage } from "../../utils/storageService";
import useAuthContext from "../../hooks/useAuthContext";

export default function InventoryPage() {
  const { user } = useAuthContext();

  const inventory = getStorage("wms_inventory", []).filter(
    (item) => item.companyCode === user?.companyCode
  );

  const totalStock = inventory.reduce((sum, item) => sum + Number(item.qty), 0);

  const lowStock = inventory.filter(
    (item) => Number(item.qty) > 0 && Number(item.qty) <= Number(item.minQty)
  ).length;

  const outOfStock = inventory.filter((item) => Number(item.qty) === 0).length;

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Inventory</h1>
      <p className="text-muted mt-1">Live inventory from warehouse stock records</p>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="card p-6">
          <h3 className="text-muted">Total Stock</h3>
          <p className="text-3xl font-bold text-navy mt-2">{totalStock}</p>
        </div>

        <div className="card p-6">
          <h3 className="text-muted">Low Stock</h3>
          <p className="text-3xl font-bold text-danger mt-2">{lowStock}</p>
        </div>

        <div className="card p-6">
          <h3 className="text-muted">Out of Stock</h3>
          <p className="text-3xl font-bold text-warning mt-2">{outOfStock}</p>
        </div>
      </div>

      <div className="card p-6 mt-8">
        <h2 className="text-xl font-bold text-navy mb-5">Stock Overview</h2>

        <div className="space-y-4">
          {inventory.map((item) => (
            <div key={item.id}>
              <div className="flex justify-between mb-1">
                <span className="font-semibold">{item.name}</span>
                <span className="text-muted">{item.qty} units</span>
              </div>

              <div className="h-3 bg-slate-200 rounded-full">
                <div
                  className={`h-3 rounded-full ${
                    Number(item.qty) <= Number(item.minQty)
                      ? "bg-danger"
                      : "bg-green"
                  }`}
                  style={{
                    width: `${Math.min((Number(item.qty) / 1300) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}