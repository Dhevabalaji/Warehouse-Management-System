import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { addStorageItem } from "../../utils/storageService";
import useAuthContext from "../../hooks/useAuthContext";

export default function CreatePurchaseOrderPage() {
  const { user } = useAuthContext();

  const [po, setPo] = useState({
    supplier: "",
    products: "",
    amount: "",
    expectedDate: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    addStorageItem("wms_purchase_orders", {
      id: `PO-${Date.now()}`,
      tenantId: user?.tenantId,
      companyCode: user?.companyCode,
      createdBy: user?.name,
      status: "Pending",
      createdAt: new Date().toLocaleString(),
      ...po,
    });

    alert("Purchase order created successfully");

    setPo({
      supplier: "",
      products: "",
      amount: "",
      expectedDate: "",
    });
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Create Purchase Order</h1>
      <p className="text-muted mt-1">Create supplier purchase order request</p>

      <form onSubmit={handleSubmit} className="card p-6 mt-8 max-w-4xl space-y-4">
        <input
          className="input"
          placeholder="Supplier Name"
          value={po.supplier}
          onChange={(e) => setPo({ ...po, supplier: e.target.value })}
          required
        />

        <input
          className="input"
          placeholder="Products / Items"
          value={po.products}
          onChange={(e) => setPo({ ...po, products: e.target.value })}
          required
        />

        <input
          className="input"
          type="number"
          placeholder="Amount"
          value={po.amount}
          onChange={(e) => setPo({ ...po, amount: e.target.value })}
          required
        />

        <input
          className="input"
          type="date"
          value={po.expectedDate}
          onChange={(e) => setPo({ ...po, expectedDate: e.target.value })}
          required
        />

        <button className="btn-primary">Create Purchase Order</button>
      </form>
    </DashboardLayout>
  );
}