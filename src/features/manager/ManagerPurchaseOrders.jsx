import PlaceholderPage from "../shared/PlaceholderPage";

export default function ManagerPurchaseOrders() {
  return (
    <PlaceholderPage
      title="Purchase Orders"
      subtitle="Track supplier purchase orders"
    >
      <table className="data-table">
        <thead>
          <tr>
            <th>PO ID</th>
            <th>Supplier</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>PO-001</td>
            <td>Apex Industrial</td>
            <td>₹25,000</td>
            <td><span className="badge-warning">Pending</span></td>
          </tr>

          <tr>
            <td>PO-002</td>
            <td>SafeGuard Ltd</td>
            <td>₹18,500</td>
            <td><span className="badge-success">Approved</span></td>
          </tr>
        </tbody>
      </table>
    </PlaceholderPage>
  );
}