import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function StockInPage() {
  const [form, setForm] = useState({
    product: "",
    sku: "",
    quantity: "",
    supplier: "",
    note: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Stock In recorded successfully");
    setForm({ product: "", sku: "", quantity: "", supplier: "", note: "" });
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Stock In</h1>
      <p className="text-muted mt-1">Record incoming warehouse stock</p>

      <form onSubmit={handleSubmit} className="card p-6 mt-8 max-w-3xl space-y-4">
        <input className="input" placeholder="Product Name" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} required />
        <input className="input" placeholder="SKU Code" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
        <input className="input" type="number" placeholder="Quantity Received" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
        <input className="input" placeholder="Supplier Name" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} required />
        <textarea className="input" rows="4" placeholder="Notes" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />

        <button className="btn-primary">Submit Stock In</button>
      </form>
    </DashboardLayout>
  );
}