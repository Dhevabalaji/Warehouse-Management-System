import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { addStorageItem } from "../../utils/storageService";
import useAuthContext from "../../hooks/useAuthContext";

export default function DamagedGoodsPage() {
  const { user } = useAuthContext();

  const [form, setForm] = useState({
    product: "",
    sku: "",
    quantity: "",
    damageType: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    addStorageItem("wms_damaged_goods", {
      id: `DMG-${Date.now()}`,
      tenantId: user?.tenantId,
      companyCode: user?.companyCode,
      reportedBy: user?.name,
      status: "Reported",
      date: new Date().toLocaleString(),
      ...form,
    });

    alert("Damaged goods report submitted");

    setForm({
      product: "",
      sku: "",
      quantity: "",
      damageType: "",
      description: "",
    });
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Damaged Goods Report</h1>
      <p className="text-muted mt-1">Report damaged or missing warehouse stock</p>

      <form onSubmit={handleSubmit} className="card p-6 mt-8 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Product Name"
            value={form.product}
            onChange={(e) => setForm({ ...form, product: e.target.value })}
            required
          />

          <input
            className="input"
            placeholder="SKU Code"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            required
          />

          <input
            className="input"
            type="number"
            placeholder="Damaged Quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            required
          />

          <select
            className="input"
            value={form.damageType}
            onChange={(e) => setForm({ ...form, damageType: e.target.value })}
            required
          >
            <option value="">Select Damage Type</option>
            <option value="Broken">Broken</option>
            <option value="Expired">Expired</option>
            <option value="Missing">Missing</option>
            <option value="Wrong Item">Wrong Item</option>
          </select>
        </div>

        <textarea
          className="input mt-4"
          rows="4"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        <button className="btn-primary mt-5">Submit Report</button>
      </form>
    </DashboardLayout>
  );
}