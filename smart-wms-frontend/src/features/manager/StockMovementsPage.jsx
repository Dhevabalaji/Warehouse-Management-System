import DashboardLayout from "../../layouts/DashboardLayout";
import { getStorage } from "../../utils/storageService";
import useAuthContext from "../../hooks/useAuthContext";

export default function StockMovementsPage() {
  const { user } = useAuthContext();

  const movements = getStorage("wms_stock_movements", []).filter(
    (m) => m.companyCode === user?.companyCode
  );

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Stock Movements</h1>
      <p className="text-muted mt-1">
        View Stock In and Stock Out records
      </p>

      <div className="card p-6 mt-8 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-muted border-b">
              <th className="py-3">Type</th>
              <th>Product</th>
              <th>SKU</th>
              <th>Quantity</th>
              <th>Staff</th>
              <th>Date</th>
              <th>Reference</th>
            </tr>
          </thead>

          <tbody>
            {movements.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-6 text-center text-muted">
                  No stock movements recorded yet.
                </td>
              </tr>
            ) : (
              movements.map((m) => (
                <tr key={m.id} className="border-b last:border-0">
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        m.type === "Stock In"
                          ? "bg-green/10 text-green"
                          : "bg-red-100 text-danger"
                      }`}
                    >
                      {m.type}
                    </span>
                  </td>
                  <td className="font-semibold">{m.product}</td>
                  <td>{m.sku}</td>
                  <td>{m.quantity}</td>
                  <td>{m.staffName}</td>
                  <td>{m.date}</td>
                  <td>{m.supplier || m.reason || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}