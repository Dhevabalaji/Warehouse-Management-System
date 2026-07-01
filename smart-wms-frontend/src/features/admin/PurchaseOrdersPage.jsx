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
import { purchaseOrderService } from "../../services/purchaseOrderService.js";

const initialForm = {
  supplier: "",
  item: "",
  quantity: "",
  amount: "",
};

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    try {
      setLoading(true);
      const data = await purchaseOrderService.getAll();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Failed to load purchase orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const searched = searchRows(orders, search, [
      "id",
      "supplier",
      "item",
      "status",
      "date",
    ]);

    return filterRows(searched, statusFilter, "status");
  }, [orders, search, statusFilter]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function openCreateModal() {
    setEditingItem(null);
    setForm(initialForm);
    setOpen(true);
  }

  function openEditModal(item) {
    if (item.status === "Received") {
      toast.error("Received order cannot be edited");
      return;
    }

    setEditingItem(item);
    setForm({
      supplier: item.supplier || "",
      item: item.item || "",
      quantity: item.quantity || "",
      amount: item.amount || "",
    });
    setOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      supplier: form.supplier.trim(),
      item: form.item.trim(),
      quantity: Number(form.quantity),
      amount: Number(form.amount),
    };

    try {
      if (editingItem) {
        const res = await purchaseOrderService.update(editingItem.dbId, payload);
        setOrders((prev) =>
          prev.map((item) => (item.dbId === editingItem.dbId ? res.order : item))
        );
        toast.success("Purchase order updated");
      } else {
        const res = await purchaseOrderService.create(payload);
        setOrders((prev) => [res.order, ...prev]);
        toast.success("Purchase order created");
      }

      setOpen(false);
      setEditingItem(null);
      setForm(initialForm);
    } catch (error) {
      toast.error(error.message || "Failed to save purchase order");
    }
  }

  async function updateStatus(row, status) {
    try {
      const res = await purchaseOrderService.updateStatus(row.dbId, status);
      setOrders((prev) =>
        prev.map((item) => (item.dbId === row.dbId ? res.order : item))
      );
      toast.success(`Order ${status}`);
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    }
  }

  async function receiveOrder(row) {
    try {
      const res = await purchaseOrderService.receive(row.dbId);
      setOrders((prev) =>
        prev.map((item) => (item.dbId === row.dbId ? res.order : item))
      );
      toast.success("Goods received and inventory updated");
    } catch (error) {
      toast.error(error.message || "Failed to receive goods");
    }
  }

  async function deleteItem(row) {
    try {
      await purchaseOrderService.remove(row.dbId);
      setOrders((prev) => prev.filter((item) => item.dbId !== row.dbId));
      setDeleteTarget(null);
      toast.success("Purchase order deleted");
    } catch (error) {
      toast.error(error.message || "Failed to delete purchase order");
    }
  }

  const columns = [
    { key: "id", label: "PO ID" },
    { key: "supplier", label: "Supplier" },
    { key: "item", label: "Item" },
    { key: "quantity", label: "Qty" },
    {
      key: "amount",
      label: "Amount",
      render: (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`,
    },
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
              onClick={() => receiveOrder(row)}
              className="px-3 py-2 rounded-lg bg-blue-500/10 text-blue-300"
            >
              Receive
            </button>
          )}

          {(row.status === "Rejected" || row.status === "Received") && (
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
          onEdit={() => openEditModal(row)}
          onDelete={() => setDeleteTarget(row)}
        />
      ),
    },
  ];

  if (loading) {
    return <PageLoader text="Loading purchase orders..." />;
  }

  return (
    <>
      <PageHeader
        title="Purchase Orders"
        description="Create, approve, reject, receive and track orders from backend"
        action={
          <button onClick={openCreateModal} className="btn-primary">
            <Plus size={18} /> New Order
          </button>
        }
      />

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterPlaceholder="All Status"
        filterOptions={["Pending", "Approved", "Rejected", "Received"]}
      />

      <DataTable columns={columns} data={filteredOrders} />

      {open && (
        <Modal
          title={editingItem ? "Edit Purchase Order" : "Create Purchase Order"}
          onClose={() => setOpen(false)}
        >
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <Input label="Supplier" name="supplier" value={form.supplier} onChange={handleChange} />
            <Input label="Item" name="item" value={form.item} onChange={handleChange} />
            <Input label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} />
            <Input label="Amount" name="amount" type="number" value={form.amount} onChange={handleChange} />

            <button className="btn-primary md:col-span-2">
              {editingItem ? "Update Order" : "Create Order"}
            </button>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Purchase Order?"
          message={`Are you sure you want to delete ${deleteTarget.id}?`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => deleteItem(deleteTarget)}
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