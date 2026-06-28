import { useState } from "react";
import { Plus } from "lucide-react";
import PageHeader from "../../components/common/PageHeader.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import Modal from "../../components/common/Modal.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import useAuthContext from "../../hooks/useAuthContext";
import { getStorage, setStorage } from "../../utils/storageService.js";

export default function TransfersPage() {
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);

  const [transfers, setTransfers] = useState(
    getStorage("wms_inventory_transfers", []).filter(
      (item) => item.companyCode === user.companyCode
    )
  );

  const [form, setForm] = useState({
    sku: "",
    itemName: "",
    fromWarehouse: "",
    toWarehouse: "",
    quantity: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const transfer = {
      id: `TR-${Date.now()}`,
      ...form,
      quantity: Number(form.quantity),
      status: "Pending",
      date: new Date().toISOString().slice(0, 10),
      companyCode: user.companyCode,
      tenantId: user.tenantId,
      createdBy: user.name,
    };

    const all = getStorage("wms_inventory_transfers", []);
    setStorage("wms_inventory_transfers", [...all, transfer]);
    setTransfers([...transfers, transfer]);
    setOpen(false);

    setForm({
      sku: "",
      itemName: "",
      fromWarehouse: "",
      toWarehouse: "",
      quantity: "",
    });
  }

  const columns = [
    { key: "sku", label: "SKU" },
    { key: "itemName", label: "Item" },
    { key: "fromWarehouse", label: "From" },
    { key: "toWarehouse", label: "To" },
    { key: "quantity", label: "Qty" },
    { key: "date", label: "Date" },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];

  return (
    <>
      <PageHeader
        title="Inventory Transfers"
        description="Move stock between warehouses"
        action={
          <button onClick={() => setOpen(true)} className="btn-primary">
            <Plus size={18} /> New Transfer
          </button>
        }
      />

      <DataTable columns={columns} data={transfers} />

      {open && (
        <Modal title="Create Transfer" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <Input label="SKU" name="sku" value={form.sku} onChange={handleChange} />
            <Input label="Item Name" name="itemName" value={form.itemName} onChange={handleChange} />
            <Input label="From Warehouse" name="fromWarehouse" value={form.fromWarehouse} onChange={handleChange} />
            <Input label="To Warehouse" name="toWarehouse" value={form.toWarehouse} onChange={handleChange} />
            <Input label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} />

            <button className="btn-primary md:col-span-2">Create Transfer</button>
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