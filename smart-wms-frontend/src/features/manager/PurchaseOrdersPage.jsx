import DashboardLayout from "../../layouts/DashboardLayout";
import { purchaseOrders as defaultOrders } from "../../data/mockData";
import { getStorage, setStorage } from "../../utils/storageService";
import useAuthContext from "../../hooks/useAuthContext";

export default function PurchaseOrdersPage() {
  const { user } = useAuthContext();

  const savedOrders = getStorage("wms_purchase_orders", []);

  const orders = [
    ...defaultOrders.map((order) => ({
      ...order,
      companyCode: "WMSPRO",
      tenantId: "TNT001",
      createdAt: "Demo Data",
      expectedDate: "-",
    })),
    ...savedOrders,
  ].filter((order) => order.companyCode === user?.companyCode);

  const updateStatus = (id, status) => {
    const updated = savedOrders.map((order) =>
      order.id === id ? { ...order, status } : order
    );

    setStorage("wms_purchase_orders", updated);
    window.location.reload();
  };

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
              <th>Expected Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((po) => (
              <tr key={po.id} className="border-b last:border-0">
                <td className="py-4 font-bold text-navy">{po.id}</td>
                <td>{po.supplier}</td>
                <td>{po.products}</td>
                <td>{po.amount?.toString().startsWith("$") ? po.amount : `₹${po.amount}`}</td>
                <td>{po.expectedDate}</td>
                <td>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-navy font-semibold">
                    {po.status}
                  </span>
                </td>
                <td className="space-x-2">
                  {po.createdAt !== "Demo Data" && (
                    <>
                      <button
                        onClick={() => updateStatus(po.id, "Approved")}
                        className="px-3 py-1 rounded-lg bg-green text-white text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(po.id, "Received")}
                        className="px-3 py-1 rounded-lg bg-navy text-white text-sm"
                      >
                        Receive
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}