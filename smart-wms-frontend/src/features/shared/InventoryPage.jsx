import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../../components/common/PageHeader.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import Modal from "../../components/common/Modal.jsx";
import SearchFilterBar from "../../components/common/SearchFilterBar.jsx";
import ActionButtons from "../../components/common/ActionButtons.jsx";
import ConfirmModal from "../../components/common/ConfirmModal.jsx";
import PageLoader from "../../components/common/PageLoader.jsx";

import useAuthContext from "../../hooks/useAuthContext";
import { searchRows, filterRows } from "../../utils/filterUtils.js";
import { inventoryService } from "../../services/inventoryService.js";

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

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const canModify = user?.role === "admin" || user?.role === "manager";

  async function loadInventory() {
    try {
      setLoading(true);
      const data = await inventoryService.getAll();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInventory();
  }, []);

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

  function openCreateModal() {
    setEditingItem(null);
    setForm(initialForm);
    setOpen(true);
  }

  function openEditModal(item) {
    setEditingItem(item);
    setForm({
      sku: item.sku || "",
      name: item.name || "",
      category: item.category || "",
      warehouse: item.warehouse || "",
      qty: item.qty || "",
      minQty: item.minQty || "",
      price: item.price || "",
    });
    setOpen(true);
  }

  async function deleteItem(id) {
    try {
      await inventoryService.remove(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setDeleteTarget(null);
      toast.success("Inventory item deleted");
    } catch (error) {
      toast.error(error.message || "Failed to delete inventory item");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      sku: form.sku.trim(),
      name: form.name.trim(),
      category: form.category.trim(),
      warehouse: form.warehouse.trim(),
      qty: Number(form.qty),
      minQty: Number(form.minQty),
      price: Number(form.price),
    };

    try {
      if (editingItem) {
        const res = await inventoryService.update(editingItem.id, payload);
        const updatedItem = res.item;

        setItems((prev) =>
          prev.map((item) => (item.id === editingItem.id ? updatedItem : item))
        );

        toast.success("Inventory item updated");
      } else {
        const res = await inventoryService.create(payload);
        setItems((prev) => [res.item, ...prev]);
        toast.success("Inventory item added");
      }

      setOpen(false);
      setEditingItem(null);
      setForm(initialForm);
    } catch (error) {
      toast.error(error.message || "Failed to save inventory item");
    }
  }

  const columns = [
    { key: "sku", label: "SKU" },
    { key: "name", label: "Product" },
    { key: "category", label: "Category" },
    { key: "warehouse", label: "Warehouse" },
    { key: "qty", label: "Qty" },
    { key: "minQty", label: "Min Qty" },
    {
      key: "price",
      label: "Price",
      render: (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`,
    },
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

  if (loading) {
    return <PageLoader text="Loading inventory..." />;
  }

  return (
    <>
      <PageHeader
        title="Inventory"
        description="Track stock items directly from MySQL backend"
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