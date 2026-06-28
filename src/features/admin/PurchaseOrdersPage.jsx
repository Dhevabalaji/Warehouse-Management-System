import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import Modal from "../../components/common/Modal.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import SearchFilterBar from "../../components/common/SearchFilterBar.jsx";
import ActionButtons from "../../components/common/ActionButtons.jsx";
import ConfirmModal from "../../components/common/ConfirmModal.jsx";
import useAuthContext from "../../hooks/useAuthContext";
import { searchRows, filterRows } from "../../utils/filterUtils.js";
import { getStorage, setStorage } from "../../utils/storageService.js";
import { addActivity, addNotification } from "../../utils/activityLogger.js";

const initialForm = {
  supplier: "",
  item: "",
  quantity: "",
  amount: "",
};

export default function PurchaseOrdersPage() {
  const { user } = useAuthContext();

  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [form, setForm] = useState(initialForm);

  const [orders, setOrders] = useState(
    getStorage("wms_purchase_orders", []).filter(
      (item) => item.companyCode === user.companyCode
    )
  );

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
      supplier: item.supplier,
      item: item.item,
      quantity: item.quantity,
      amount: item.amount,
    });
    setOpen(true);
  }

  function syncOrders(updatedLocal) {
    const all = getStorage("wms_purchase_orders", []);

    const otherCompanyOrders = all.filter(
      (item) => item.companyCode !== user.companyCode
    );

    setStorage("wms_purchase_orders", [...otherCompanyOrders, ...updatedLocal]);
    setOrders(updatedLocal);
  }

  function updateStatus(id, status) {
    const selected = orders.find((item) => item.id === id);

    const updatedLocal = orders.map((item) =>
      item.id === id ? { ...item, status } : item
    );

    syncOrders(updatedLocal);

    addActivity({
      title: "Purchase Order Status Updated",
      description: `${selected?.id} changed to ${status}`,
      type: "success",
      user,
    });

    addNotification({
      title: "Purchase Order Updated",
      message: `${selected?.id} changed to ${status} by ${user.name}`,
      type: "success",
      user,
      targetRole: "admin",
    });

    toast.success(`Order ${status}`);
  }

  function receiveOrder(id) {
    const selected = orders.find((item) => item.id === id);

    if (!selected) return;

    const inventory = getStorage("wms_inventory", []);

    const existingItem = inventory.find(
      (item) =>
        item.companyCode === user.companyCode &&
        item.name.toLowerCase() === selected.item.toLowerCase()
    );

    let updatedInventory;

    if (existingItem) {
      updatedInventory = inventory.map((item) => {
        if (item.id === existingItem.id) {
          const newQty = Number(item.qty) + Number(selected.quantity);

          return {
            ...item,
            qty: newQty,
            status:
              newQty === 0
                ? "Out of Stock"
                : newQty <= Number(item.minQty)
                ? "Low Stock"
                : "In Stock",
          };
        }

        return item;
      });
    } else {
      const newInventoryItem = {
        id: `P-${Date.now()}`,
        sku: `SKU-${Date.now().toString().slice(-5)}`,
        name: selected.item,
        category: "Purchased",
        warehouse: "Central Hub",
        qty: Number(selected.quantity),
        minQty: 10,
        price: Number(selected.amount) / Number(selected.quantity),
        status: "In Stock",
        companyCode: user.companyCode,
        tenantId: user.tenantId,
      };

      updatedInventory = [...inventory, newInventoryItem];
    }

    setStorage("wms_inventory", updatedInventory);
    updateStatus(id, "Received");

    addActivity({
      title: "Purchase Order Received",
      description: `${selected.id} goods received and inventory updated`,
      type: "success",
      user,
    });

    addNotification({
      title: "Goods Received",
      message: `${selected.item} added to inventory from ${selected.id}`,
      type: "success",
      user,
      targetRole: "admin",
    });

    toast.success("Goods received and inventory updated");
  }

  function deleteItem(id) {
    const selected = orders.find((item) => item.id === id);

    if (selected?.status === "Received") {
      toast.error("Received order cannot be deleted");
      setDeleteTarget(null);
      return;
    }

    const updatedLocal = orders.filter((item) => item.id !== id);
    syncOrders(updatedLocal);
    setDeleteTarget(null);

    addActivity({
      title: "Purchase Order Deleted",
      description: `${selected?.id || "Purchase order"} was deleted`,
      type: "danger",
      user,
    });

    toast.success("Purchase order deleted");
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (Number(form.quantity) <= 0 || Number(form.amount) <= 0) {
      toast.error("Quantity and amount must be greater than 0");
      return;
    }

    if (editingItem) {
      const updatedItem = {
        ...editingItem,
        ...form,
        quantity: Number(form.quantity),
        amount: Number(form.amount),
      };

      const updatedLocal = orders.map((item) =>
        item.id === editingItem.id ? updatedItem : item
      );

      syncOrders(updatedLocal);
      setOpen(false);
      setEditingItem(null);

      addActivity({
        title: "Purchase Order Updated",
        description: `${editingItem.id} was updated`,
        type: "success",
        user,
      });

      toast.success("Purchase order updated");
      return;
    }

    const order = {
      id: `PO-${Date.now()}`,
      ...form,
      quantity: Number(form.quantity),
      amount: Number(form.amount),
      status: "Pending",
      date: new Date().toISOString().slice(0, 10),
      companyCode: user.companyCode,
      tenantId: user.tenantId,
      createdBy: user.name,
    };

    const updatedLocal = [...orders, order];
    syncOrders(updatedLocal);

    setOpen(false);
    setForm(initialForm);

    addActivity({
      title: "Purchase Order Created",
      description: `${order.id} created for ${form.item}`,
      type: "success",
      user,
    });

    addNotification({
      title: "Purchase Order Created",
      message: `${order.id} created by ${user.name}`,
      type: "success",
      user,
      targetRole: "admin",
    });

    toast.success("Purchase order created");
  }

  const columns = [
    { key: "id", label: "PO ID" },
    { key: "supplier", label: "Supplier" },
    { key: "item", label: "Item" },
    { key: "quantity", label: "Qty" },
    {
      key: "amount",
      label: "Amount",
      render: (value) => `₹${Number(value).toLocaleString("en-IN")}`,
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
                onClick={() => updateStatus(row.id, "Approved")}
                className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-300"
              >
                Approve
              </button>
              <button
                onClick={() => updateStatus(row.id, "Rejected")}
                className="px-3 py-2 rounded-lg bg-red-500/10 text-red-300"
              >
                Reject
              </button>
            </>
          )}

          {row.status === "Approved" && (
            <button
              onClick={() => receiveOrder(row.id)}
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

  return (
    <>
      <PageHeader
        title="Purchase Orders"
        description="Create, approve, reject, receive, and track purchase orders"
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
            <Input
              label="Supplier"
              name="supplier"
              value={form.supplier}
              onChange={handleChange}
            />

            <Input
              label="Item"
              name="item"
              value={form.item}
              onChange={handleChange}
            />

            <Input
              label="Quantity"
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
            />

            <Input
              label="Amount"
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
            />

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
          onConfirm={() => deleteItem(deleteTarget.id)}
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