import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { addStorageItem } from "../../utils/storageService";
import useAuthContext from "../../hooks/useAuthContext";

export default function InventoryTransferPage() {
  const { user } = useAuthContext();

  const [transfer, setTransfer] = useState({
    product: "",
    sku: "",
    quantity: "",
    fromWarehouse: "",
    toWarehouse: "",
    reason: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    addStorageItem("wms_inventory_transfers", {
      id: `TRF-${Date.now()}`,
      tenantId: user?.tenantId,
      companyCode: user?.companyCode,
      requestedBy: user?.name,
      status: "Pending",
      date: new Date().toLocaleString(),
      ...transfer,
    });

    alert("Inventory transfer request created");

    setTransfer({
      product: "",
      sku: "",
      quantity: "",
      fromWarehouse: "",
      toWarehouse: "",
      reason: "",
    });
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Inventory Transfer</h1>
      <p className="text-muted mt-1">
        Transfer stock between warehouses under the same tenant
      </p>

      <form onSubmit={handleSubmit} className="card p-6 mt-8 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Product Name"
            value={transfer.product}
            onChange={(e) => setTransfer({ ...transfer, product: e.target.value })}
            required
          />

          <input
            className="input"
            placeholder="SKU Code"
            value={transfer.sku}
            onChange={(e) => setTransfer({ ...transfer, sku: e.target.value })}
            required
          />

          <input
            className="input"
            type="number"
            placeholder="Quantity"
            value={transfer.quantity}
            onChange={(e) => setTransfer({ ...transfer, quantity: e.target.value })}
            required
          />

          <input
            className="input"
            placeholder="From Warehouse"
            value={transfer.fromWarehouse}
            onChange={(e) =>
              setTransfer({ ...transfer, fromWarehouse: e.target.value })
            }
            required
          />

          <input
            className="input"
            placeholder="To Warehouse"
            value={transfer.toWarehouse}
            onChange={(e) =>
              setTransfer({ ...transfer, toWarehouse: e.target.value })
            }
            required
          />
        </div>

        <textarea
          className="input mt-4"
          rows="4"
          placeholder="Transfer Reason"
          value={transfer.reason}
          onChange={(e) => setTransfer({ ...transfer, reason: e.target.value })}
          required
        />

        <button className="btn-primary mt-5">Create Transfer</button>
      </form>
    </DashboardLayout>
  );
}