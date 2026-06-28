import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import Modal from "../../components/common/Modal.jsx";
import SearchFilterBar from "../../components/common/SearchFilterBar.jsx";
import ActionButtons from "../../components/common/ActionButtons.jsx";
import ConfirmModal from "../../components/common/ConfirmModal.jsx";
import useAuthContext from "../../hooks/useAuthContext";
import { searchRows, filterRows } from "../../utils/filterUtils.js";
import { getStorage, setStorage } from "../../utils/storageService.js";
import { addActivity, addNotification } from "../../utils/activityLogger.js";

const initialForm = {
  sku: "",
  name: "",
  category: "",
  warehouse: "",
  qty: "",
  minQty: "",
  price: "",
};

export default function InventoryPage() {
  const { user } = useAuthContext();

  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [form, setForm] = useState(initialForm);

  const [items, setItems] = useState(
    getStorage("wms_inventory", []).filter(
      (item) => item.companyCode === user.companyCode
    )
  );

  const canModify = user.role === "admin" || user.role === "manager";

  const filteredItems = useMemo(() => {
    const searched = searchRows(items, search, [
      "sku",
      "name",
      "category",
      "warehouse",
    ]);

    return filterRows(searched, statusFilter, "status");
  }, [items, search, statusFilter]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function getStatus(qty, minQty) {
    const quantity = Number(qty);
    const minimumQuantity = Number(minQty);

    if (quantity === 0) return "Out of Stock";
    if (quantity <= minimumQuantity) return "Low Stock";
    return "In Stock";
  }

  function openCreateModal() {
    setEditingItem(null);
    setForm(initialForm);
    setOpen(true);
  }

  function openEditModal(item) {
    setEditingItem(item);
    setForm({
      sku: item.sku,
      name: item.name,
      category: item.category,
      warehouse: item.warehouse,
      qty: item.qty,
      minQty: item.minQty,
      price: item.price,
    });
    setOpen(true);
  }

  function deleteItem(id) {
    const selected = items.find((item) => item.id === id);
    const all = getStorage("wms_inventory", []);

    const updatedAll = all.filter((item) => item.id !== id);
    const updatedLocal = items.filter((item) => item.id !== id);

    setStorage("wms_inventory", updatedAll);
    setItems(updatedLocal);
    setDeleteTarget(null);

    addActivity({
      title: "Inventory Deleted",
      description: `${selected?.name || "Inventory item"} was deleted`,
      type: "danger",
      user,
    });

    addNotification({
      title: "Inventory Deleted",
      message: `${selected?.name || "Inventory item"} was deleted by ${user.name}`,
      type: "danger",
      user,
      targetRole: "admin",
    });

    toast.success("Inventory item deleted");
  }

  function handleSubmit(e) {
    e.preventDefault();

    const status = getStatus(form.qty, form.minQty);

    if (editingItem) {
      const updatedItem = {
        ...editingItem,
        ...form,
        qty: Number(form.qty),
        minQty: Number(form.minQty),
        price: Number(form.price),
        status,
      };

      const all = getStorage("wms_inventory", []);

      const updatedAll = all.map((item) =>
        item.id === editingItem.id ? updatedItem : item
      );

      const updatedLocal = items.map((item) =>
        item.id === editingItem.id ? updatedItem : item
      );

      setStorage("wms_inventory", updatedAll);
      setItems(updatedLocal);
      setOpen(false);
      setEditingItem(null);

      addActivity({
        title: "Inventory Updated",
        description: `${form.name} was updated`,
        type: "success",
        user,
      });

      addNotification({
        title: "Inventory Updated",
        message: `${form.name} was updated by ${user.name}`,
        type: "success",
        user,
        targetRole: "admin",
      });

      toast.success("Inventory item updated");
      return;
    }

    const skuExists = items.some(
      (item) => item.sku.toLowerCase() === form.sku.toLowerCase()
    );

    if (skuExists) {
      toast.error("SKU already exists");
      return;
    }

    const newItem = {
      id: `P-${Date.now()}`,
      ...form,
      qty: Number(form.qty),
      minQty: Number(form.minQty),
      price: Number(form.price),
      status,
      companyCode: user.companyCode,
      tenantId: user.tenantId,
    };

    const all = getStorage("wms_inventory", []);
    setStorage("wms_inventory", [...all, newItem]);

    setItems([...items, newItem]);
    setOpen(false);
    setForm(initialForm);

    addActivity({
      title: "Inventory Added",
      description: `${form.name} was added`,
      type: "success",
      user,
    });

    addNotification({
      title: "Inventory Added",
      message: `${form.name} was added by ${user.name}`,
      type: "success",
      user,
      targetRole: "admin",
    });

    toast.success("Inventory item added");
  }

  const columns = [
    { key: "sku", label: "SKU" },
    { key: "name", label: "Product" },
    { key: "category", label: "Category" },
    { key: "warehouse", label: "Warehouse" },
    { key: "qty", label: "Qty" },
    { key: "minQty", label: "Min Qty" },
    { key: "price", label: "Price" },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
    ...(canModify
      ? [
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
        ]
      : []),
  ];

  return (
    <>
      <PageHeader
        title="Inventory"
        description="Track stock items, quantity, warehouse, and stock status"
        action={
          canModify && (
            <button onClick={openCreateModal} className="btn-primary">
              <Plus size={18} /> Add Item
            </button>
          )
        }
      />

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterPlaceholder="All Status"
        filterOptions={["In Stock", "Low Stock", "Out of Stock"]}
      />

      <DataTable columns={columns} data={filteredItems} />

      {open && (
        <Modal
          title={editingItem ? "Edit Inventory Item" : "Add Inventory Item"}
          onClose={() => setOpen(false)}
        >
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <Input label="SKU" name="sku" value={form.sku} onChange={handleChange} />
            <Input label="Product Name" name="name" value={form.name} onChange={handleChange} />
            <Input label="Category" name="category" value={form.category} onChange={handleChange} />
            <Input label="Warehouse" name="warehouse" value={form.warehouse} onChange={handleChange} />
            <Input label="Quantity" name="qty" type="number" value={form.qty} onChange={handleChange} />
            <Input label="Minimum Quantity" name="minQty" type="number" value={form.minQty} onChange={handleChange} />
            <Input label="Price" name="price" type="number" value={form.price} onChange={handleChange} />

            <button className="btn-primary md:col-span-2">
              {editingItem ? "Update Item" : "Save Item"}
            </button>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Inventory Item?"
          message={`Are you sure you want to delete ${deleteTarget.name}?`}
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