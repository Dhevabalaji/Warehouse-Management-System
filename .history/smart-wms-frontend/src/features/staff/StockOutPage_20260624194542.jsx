import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { addStorageItem } from "../../utils/storageService";
import useAuthContext from "../../hooks/useAuthContext";

export default function StockOutPage() {
  const { user } = useAuthContext();

  const [form, setForm] = useState({
    product: "",
    sku: "",
    quantity: "",
    reason: "",
    approvedBy: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    addStorageItem("wms_stock_movements", {
      id: Date.now(),
      type: "Stock Out",
      tenantId: user?.tenantId,
      companyCode: user?.companyCode,
      staffName: user?.name,
      date: new Date().toLocaleString(),
      ...form,
    });

    alert("Stock Out recorded successfully");

    setForm({
      product: "",
      sku: "",
      quantity: "",
      reason: "",
      approvedBy: "",
    });
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Stock Out</h1>
      <p className="text-muted mt-1">Record outgoing warehouse stock</p>

      <form onSubmit={handleSubmit} className="card p-6 mt-8 max-w-3xl space-y-4">
        <input className="input" placeholder="Product Name" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} required />
        <input className="input" placeholder="SKU Code" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
        <input className="input" type="number" placeholder="Quantity Issued" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
        <input className="input" placeholder="Reason / Dispatch ID" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required />
        <input className="input" placeholder="Approved By" value={form.approvedBy} onChange={(e) => setForm({ ...form, approvedBy: e.target.value })} required />
        <button className="btn-primary">Submit Stock Out</button>
      </form>
    </DashboardLayout>
  );
}