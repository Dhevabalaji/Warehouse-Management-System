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

import useAuthContext from "../../hooks/useAuthContext";
import { searchRows, filterRows } from "../../utils/filterUtils.js";
import { damagedGoodsService } from "../../services/damagedGoodsService.js";

const initialForm = {
  sku: "",
  itemName: "",
  quantity: "",
  warehouse: "",
  reason: "",
};

export default function DamagedGoodsPage() {
  const { user } = useAuthContext();

  const [records, setRecords] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);

  const canApprove = user?.role === "admin" || user?.role === "manager";

  async function loadRecords() {
    try {
      setLoading(true);
      const data = await damagedGoodsService.getAll();
      setRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Failed to load damaged goods");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
  }, []);

  const filteredRecords = useMemo(() => {
    const searched = searchRows(records, search, [
      "id",
      "sku",
      "itemName",
      "warehouse",
      "reportedBy",
      "status",
    ]);

    return filterRows(searched, statusFilter, "status");
  }, [records, search, statusFilter]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      sku: form.sku.trim(),
      itemName: form.itemName.trim(),
      quantity: Number(form.quantity),
      warehouse: form.warehouse.trim(),
      reason: form.reason.trim(),
    };

    try {
      const res = await damagedGoodsService.create(payload);
      setRecords((prev) => [res.damagedGood, ...prev]);
      setOpen(false);
      setForm(initialForm);
      toast.success("Damaged goods reported");
    } catch (error) {
      toast.error(error.message || "Failed to report damaged goods");
    }
  }

  async function updateStatus(row, status) {
    try {
      const res = await damagedGoodsService.updateStatus(row.dbId, status);

      setRecords((prev) =>
        prev.map((item) =>
          item.dbId === row.dbId ? res.damagedGood : item
        )
      );

      toast.success(`Damage report ${status}`);
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    }
  }

  async function deleteRecord(row) {
    try {
      await damagedGoodsService.remove(row.dbId);
      setRecords((prev) => prev.filter((item) => item.dbId !== row.dbId));
      setDeleteTarget(null);
      toast.success("Damaged goods record deleted");
    } catch (error) {
      toast.error(error.message || "Failed to delete record");
    }
  }

  const columns = [
    { key: "id", label: "Damage ID" },
    { key: "sku", label: "SKU" },
    { key: "itemName", label: "Item" },
    { key: "quantity", label: "Qty" },
    { key: "warehouse", label: "Warehouse" },
    { key: "reportedBy", label: "Reported By" },
    { key: "date", label: "Date" },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
    ...(canApprove
      ? [
          {
            key: "workflow",
            label: "Workflow",
            render: (_, row) =>
              row.status === "Pending" ? (
                <div className="flex gap-2">
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
                </div>
              ) : (
                <span className="text-slate-500">Closed</span>
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
        ]
      : []),
  ];

  if (loading) return <PageLoader text="Loading damaged goods..." />;

  return (
    <>
      <PageHeader
        title="Damaged Goods"
        description="Report and review damaged goods using backend API"
        action={
          <button onClick={() => setOpen(true)} className="btn-primary">
            <Plus size={18} /> Report Damage
          </button>
        }
      />

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterPlaceholder="All Status"
        filterOptions={["Pending", "Approved", "Rejected"]}
      />

      <DataTable columns={columns} data={filteredRecords} />

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
                required
                className="input"
                rows="3"
              />
            </div>

            <button className="btn-primary md:col-span-2">
              Submit Report
            </button>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Damage Report?"
          message={`Are you sure you want to delete ${deleteTarget.id}?`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => deleteRecord(deleteTarget)}
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