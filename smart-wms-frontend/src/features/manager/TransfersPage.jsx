import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../../components/common/PageHeader.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import Modal from "../../components/common/Modal.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import SearchFilterBar from "../../components/common/SearchFilterBar.jsx";
import ActionButtons from "../../components/common/ActionButtons.jsx";
import ConfirmModal from "../../components/common/ConfirmModal.jsx";
import PageLoader from "../../components/common/PageLoader.jsx";

import { searchRows, filterRows } from "../../utils/filterUtils.js";
import { transferService } from "../../services/transferService.js";

const initialForm = {
  sku: "",
  itemName: "",
  fromWarehouse: "",
  toWarehouse: "",
  quantity: "",
};

export default function TransfersPage() {
  const [transfers, setTransfers] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);

  async function loadTransfers() {
    try {
      setLoading(true);
      const data = await transferService.getAll();
      setTransfers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Failed to load transfers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransfers();
  }, []);

  const filteredTransfers = useMemo(() => {
    const searched = searchRows(transfers, search, [
      "id",
      "sku",
      "itemName",
      "fromWarehouse",
      "toWarehouse",
      "status",
    ]);

    return filterRows(searched, statusFilter, "status");
  }, [transfers, search, statusFilter]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      sku: form.sku.trim(),
      itemName: form.itemName.trim(),
      fromWarehouse: form.fromWarehouse.trim(),
      toWarehouse: form.toWarehouse.trim(),
      quantity: Number(form.quantity),
    };

    try {
      const res = await transferService.create(payload);
      setTransfers((prev) => [res.transfer, ...prev]);
      setOpen(false);
      setForm(initialForm);
      toast.success("Transfer created");
    } catch (error) {
      toast.error(error.message || "Failed to create transfer");
    }
  }

  async function updateStatus(row, status) {
    try {
      const res = await transferService.updateStatus(row.dbId, status);

      setTransfers((prev) =>
        prev.map((item) => (item.dbId === row.dbId ? res.transfer : item))
      );

      toast.success(`Transfer ${status}`);
    } catch (error) {
      toast.error(error.message || "Failed to update transfer");
    }
  }

  async function deleteTransfer(row) {
    try {
      await transferService.remove(row.dbId);
      setTransfers((prev) => prev.filter((item) => item.dbId !== row.dbId));
      setDeleteTarget(null);
      toast.success("Transfer deleted");
    } catch (error) {
      toast.error(error.message || "Failed to delete transfer");
    }
  }

  const columns = [
    { key: "id", label: "Transfer ID" },
    { key: "sku", label: "SKU" },
    { key: "itemName", label: "Item" },
    { key: "fromWarehouse", label: "From" },
    { key: "toWarehouse", label: "To" },
    { key: "quantity", label: "Qty" },
    { key: "date", label: "Date" },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: "workflow",
      label: "Workflow",
      render: (_, row) => (
        <div className="flex gap-2">
          {row.status === "Pending" && (
            <>
              <button
                onClick={() => updateStatus(row, "Approved")}
                className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-300"
              >
                Approve
              </button>
              <button
                onClick={() => updateStatus(row, "Rejected")}
                className="px-3 py-2 rounded-lg bg-red-500/10 text-red-300"
              >
                Reject
              </button>
            </>
          )}

          {row.status === "Approved" && (
            <button
              onClick={() => updateStatus(row, "Completed")}
              className="px-3 py-2 rounded-lg bg-blue-500/10 text-blue-300"
            >
              Complete
            </button>
          )}

          {(row.status === "Rejected" || row.status === "Completed") && (
            <span className="text-slate-500">Closed</span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <ActionButtons
          onEdit={null}
          onDelete={() => setDeleteTarget(row)}
        />
      ),
    },
  ];

  if (loading) return <PageLoader text="Loading transfers..." />;

  return (
    <>
      <PageHeader
        title="Inventory Transfers"
        description="Move stock between warehouses using backend API"
        action={
          <button onClick={() => setOpen(true)} className="btn-primary">
            <Plus size={18} /> New Transfer
          </button>
        }
      />

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterPlaceholder="All Status"
        filterOptions={["Pending", "Approved", "Rejected", "Completed"]}
      />

      <DataTable columns={columns} data={filteredTransfers} />

      {open && (
        <Modal title="Create Transfer" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <Input label="SKU" name="sku" value={form.sku} onChange={handleChange} />
            <Input label="Item Name" name="itemName" value={form.itemName} onChange={handleChange} />
            <Input label="From Warehouse" name="fromWarehouse" value={form.fromWarehouse} onChange={handleChange} />
            <Input label="To Warehouse" name="toWarehouse" value={form.toWarehouse} onChange={handleChange} />
            <Input label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} />

            <button className="btn-primary md:col-span-2">
              Create Transfer
            </button>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Transfer?"
          message={`Are you sure you want to delete ${deleteTarget.id}?`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => deleteTransfer(deleteTarget)}
        />
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