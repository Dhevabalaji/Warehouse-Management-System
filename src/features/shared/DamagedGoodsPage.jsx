import { useState } from "react";
import { Plus } from "lucide-react";
import PageHeader from "../../components/common/PageHeader.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import Modal from "../../components/common/Modal.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import useAuthContext from "../../hooks/useAuthContext";
import { getStorage, setStorage } from "../../utils/storageService.js";

export default function DamagedGoodsPage() {
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);

  const [items, setItems] = useState(
    getStorage("wms_damaged_goods", []).filter(
      (item) => item.companyCode === user.companyCode
    )
  );

  const [form, setForm] = useState({
    sku: "",
    itemName: "",
    quantity: "",
    warehouse: "",
    reason: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const damagedItem = {
      id: `DG-${Date.now()}`,
      ...form,
      quantity: Number(form.quantity),
      status: "Pending",
      date: new Date().toISOString().slice(0, 10),
      companyCode: user.companyCode,
      tenantId: user.tenantId,
      reportedBy: user.name,
    };

    const all = getStorage("wms_damaged_goods", []);
    setStorage("wms_damaged_goods", [...all, damagedItem]);

    setItems([...items, damagedItem]);
    setOpen(false);

    setForm({
      sku: "",
      itemName: "",
      quantity: "",
      warehouse: "",
      reason: "",
    });
  }

  const columns = [
    { key: "sku", label: "SKU" },
    { key: "itemName", label: "Item" },
    { key: "quantity", label: "Qty" },
    { key: "warehouse", label: "Warehouse" },
    { key: "reason", label: "Reason" },
    { key: "reportedBy", label: "Reported By" },
    { key: "date", label: "Date" },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];

  return (
    <>
      <PageHeader
        title="Damaged Goods"
        description="Report and track damaged inventory"
        action={
          <button onClick={() => setOpen(true)} className="btn-primary">
            <Plus size={18} /> Report Damage
          </button>
        }
      />

      <DataTable columns={columns} data={items} />

      {open && (
        <Modal title="Report Damaged Goods" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <Input label="SKU" name="sku" value={form.sku} onChange={handleChange} />
            <Input label="Item Name" name="itemName" value={form.itemName} onChange={handleChange} />
            <Input label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} />
            <Input label="Warehouse" name="warehouse" value={form.warehouse} onChange={handleChange} />

            <div className="md:col-span-2">
              <label className="text-sm text-slate-300">Reason</label>
              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                rows="3"
                required
                className="input"
              />
            </div>

            <button className="btn-primary md:col-span-2">Save Report</button>
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