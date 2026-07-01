import DashboardLayout from "../../layouts/DashboardLayout";
import { getStorage, setStorage } from "../../utils/storageService";
import useAuthContext from "../../hooks/useAuthContext";

export default function InventoryTransfersListPage() {
  const { user } = useAuthContext();

  const transfers = getStorage("wms_inventory_transfers", []).filter(
    (transfer) => transfer.companyCode === user?.companyCode
  );

  const updateStatus = (id, status) => {
    const allTransfers = getStorage("wms_inventory_transfers", []);

    const updatedTransfers = allTransfers.map((transfer) =>
      transfer.id === id ? { ...transfer, status } : transfer
    );

    setStorage("wms_inventory_transfers", updatedTransfers);
    window.location.reload();
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Transfer Requests</h1>
      <p className="text-muted mt-1">
        Track inventory movement between warehouses
      </p>

      <div className="card p-6 mt-8 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-muted border-b">
              <th className="py-3">Transfer ID</th>
              <th>Product</th>
              <th>SKU</th>
              <th>Quantity</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {transfers.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-6 text-center text-muted">
                  No transfer requests found.
                </td>
              </tr>
            ) : (
              transfers.map((transfer) => (
                <tr key={transfer.id} className="border-b last:border-0">
                  <td className="py-4 font-bold text-navy">{transfer.id}</td>
                  <td>{transfer.product}</td>
                  <td>{transfer.sku}</td>
                  <td>{transfer.quantity}</td>
                  <td>{transfer.fromWarehouse}</td>
                  <td>{transfer.toWarehouse}</td>
                  <td>
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-navy font-semibold">
                      {transfer.status}
                    </span>
                  </td>
                  <td className="space-x-2">
                    <button
                      onClick={() => updateStatus(transfer.id, "Approved")}
                      className="px-3 py-1 rounded-lg bg-green text-white text-sm"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => updateStatus(transfer.id, "Rejected")}
                      className="px-3 py-1 rounded-lg bg-danger text-white text-sm"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}