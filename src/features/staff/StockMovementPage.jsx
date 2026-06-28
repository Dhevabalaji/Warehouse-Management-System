import { useState } from "react";
import { Plus } from "lucide-react";
import PageHeader from "../../components/common/PageHeader.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import Modal from "../../components/common/Modal.jsx";
import useAuthContext from "../../hooks/useAuthContext";
import {
  getStorage,
  setStorage,
  updateInventoryQuantity,
} from "../../utils/storageService.js";

export default function StockMovementPage() {
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);

  const [movements, setMovements] = useState(
    getStorage("wms_stock_movements", []).filter(
      (item) => item.companyCode === user.companyCode
    )
  );

  const [form, setForm] = useState({
    type: "Stock In",
    sku: "",
    itemName: "",
    quantity: "",
    warehouse: "",
    remarks: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const movement = {
      id: `SM-${Date.now()}`,
      ...form,
      quantity: Number(form.quantity),
      date: new Date().toISOString().slice(0, 10),
      companyCode: user.companyCode,
      tenantId: user.tenantId,
      createdBy: user.name,
    };

    const all = getStorage("wms_stock_movements", []);
    setStorage("wms_stock_movements", [...all, movement]);

    updateInventoryQuantity({
      sku: form.sku,
      quantity: Number(form.quantity),
      type: form.type,
      companyCode: user.companyCode,
    });

    setMovements([...movements, movement]);
    setOpen(false);

    setForm({
      type: "Stock In",
      sku: "",
      itemName: "",
      quantity: "",
      warehouse: "",
      remarks: "",
    });
  }

  const columns = [
    { key: "type", label: "Type" },
    { key: "sku", label: "SKU" },
    { key: "itemName", label: "Item" },
    { key: "quantity", label: "Qty" },
    { key: "warehouse", label: "Warehouse" },
    { key: "date", label: "Date" },
    { key: "createdBy", label: "Updated By" },
  ];

  return (
    <>
      <PageHeader
        title="Stock Movement"
        description="Record stock in and stock out operations"
        action={
          <button onClick={() => setOpen(true)} className="btn-primary">
            <Plus size={18} /> Add Movement
          </button>
        }
      />

      <DataTable columns={columns} data={movements} />

      {open && (
        <Modal title="Add Stock Movement" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-300">Movement Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="input"
              >
                <option>Stock In</option>
                <option>Stock Out</option>
              </select>
            </div>

            <Input label="SKU" name="sku" value={form.sku} onChange={handleChange} />
            <Input label="Item Name" name="itemName" value={form.itemName} onChange={handleChange} />
            <Input label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} />
            <Input label="Warehouse" name="warehouse" value={form.warehouse} onChange={handleChange} />

            <div className="md:col-span-2">
              <label className="text-sm text-slate-300">Remarks</label>
              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                rows="3"
                className="input"
              />
            </div>

            <button className="btn-primary md:col-span-2">Save Movement</button>
          </form>
        </Modal>
      )}
    </>
  );
}

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-slate-300">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="input"
      />
    </div>
  );
}