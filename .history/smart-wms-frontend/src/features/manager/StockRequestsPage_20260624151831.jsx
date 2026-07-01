import DashboardLayout from "../../layouts/DashboardLayout";

const requests = [
  {
    id: "REQ-1001",
    product: "Nitrile Gloves",
    requestedBy: "Priya Nair",
    qty: 120,
    type: "Stock In",
    status: "Pending",
  },
  {
    id: "REQ-1002",
    product: "Barcode Label Rolls",
    requestedBy: "Arjun Mehta",
    qty: 40,
    type: "Stock Out",
    status: "Approved",
  },
  {
    id: "REQ-1003",
    product: "Safety Helmet",
    requestedBy: "Priya Nair",
    qty: 80,
    type: "Stock Out",
    status: "Pending",
  },
];

export default function StockRequestsPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Stock Requests</h1>
      <p className="text-muted mt-1">
        Review and approve staff stock requests
      </p>

      <div className="card p-6 mt-8 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-muted border-b">
              <th className="py-3">Request ID</th>
              <th>Product</th>
              <th>Requested By</th>
              <th>Quantity</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="py-4 font-bold text-navy">{r.id}</td>
                <td>{r.product}</td>
                <td>{r.requestedBy}</td>
                <td>{r.qty}</td>
                <td>{r.type}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      r.status === "Approved"
                        ? "bg-green/10 text-green"
                        : "bg-yellow-100 text-warning"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td>
                  <button className="btn-primary text-sm">Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}