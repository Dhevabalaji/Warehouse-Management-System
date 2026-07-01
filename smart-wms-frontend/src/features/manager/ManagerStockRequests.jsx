import PlaceholderPage from "../shared/PlaceholderPage";

export default function ManagerStockRequests() {
  return (
    <PlaceholderPage
      title="Stock Requests"
      subtitle="Approve or reject staff stock requests"
    >
      <table className="data-table">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Product</th>
            <th>Requested By</th>
            <th>Qty</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>REQ-001</td>
            <td>Barcode Rolls</td>
            <td>Staff User</td>
            <td>20</td>
            <td><span className="badge-warning">Pending</span></td>
          </tr>
        </tbody>
      </table>
    </PlaceholderPage>
  );
}