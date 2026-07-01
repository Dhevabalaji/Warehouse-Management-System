import DashboardLayout from "../../layouts/DashboardLayout";
import { purchaseOrders } from "../../data/mockData";

export default function PurchaseOrdersPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Purchase Orders</h1>
      <p className="text-muted mt-1">Track supplier purchase orders</p>

      <div className="card p-6 mt-8 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-muted border-b">
              <th className="py-3">PO ID</th>
              <th>Supplier</th>
              <th>Products</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {purchaseOrders.map((po) => (
              <tr key={po.id} className="border-b last:border-0">
                <td className="py-4 font-bold text-navy">{po.id}</td>
                <td>{po.supplier}</td>
                <td>{po.products}</td>
                <td>{po.amount}</td>
                <td>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-navy font-semibold">
                    {po.status}
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