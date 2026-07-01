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
import { warehouseService } from "../../services/warehouseService.js";

const initialForm = {
  name: "",
  code: "",
  location: "",
  capacity: "",
  manager: "",
};

export default function WarehousesPage() {
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [form, setForm] = useState(initialForm);

  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadWarehouses() {
    try {
      setLoading(true);
      const data = await warehouseService.getAll();
      setWarehouses(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Failed to load warehouses");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWarehouses();
  }, []);

  const filteredWarehouses = useMemo(() => {
    const searched = searchRows(warehouses, search, [
      "name",
      "code",
      "location",
      "manager",
    ]);

    return filterRows(searched, statusFilter, "status");
  }, [warehouses, search, statusFilter]);

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
      name: item.name || "",
      code: item.code || "",
      location: item.location || "",
      capacity: item.capacity || "",
      manager: item.manager || "",
    });
    setOpen(true);
  }

  async function deleteItem(id) {
    try {
      await warehouseService.remove(id);
      setWarehouses((prev) => prev.filter((item) => item.id !== id));
      setDeleteTarget(null);
      toast.success("Warehouse deleted");
    } catch (error) {
      toast.error(error.message || "Failed to delete warehouse");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      code: form.code.trim(),
      location: form.location.trim(),
      capacity: Number(form.capacity),
      manager: form.manager.trim(),
    };

    try {
      if (editingItem) {
        const res = await warehouseService.update(editingItem.id, payload);
        const updated = res.warehouse;

        setWarehouses((prev) =>
          prev.map((item) => (item.id === editingItem.id ? updated : item))
        );

        toast.success("Warehouse updated");
      } else {
        const res = await warehouseService.create(payload);
        setWarehouses((prev) => [res.warehouse, ...prev]);
        toast.success("Warehouse added");
      }

      setOpen(false);
      setEditingItem(null);
      setForm(initialForm);
    } catch (error) {
      toast.error(error.message || "Failed to save warehouse");
    }
  }

  const columns = [
    { key: "name", label: "Warehouse" },
    { key: "code", label: "Code" },
    { key: "location", label: "Location" },
    { key: "capacity", label: "Capacity" },
    { key: "manager", label: "Manager" },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge status={value} />,
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
    return <PageLoader text="Loading warehouses..." />;
  }

  return (
    <>
      <PageHeader
        title="Warehouses"
        description="Manage company warehouse branches from backend database"
        action={
          <button onClick={openCreateModal} className="btn-primary">
            <Plus size={18} /> Add Warehouse
          </button>
        }
      />

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterPlaceholder="All Status"
        filterOptions={["Active", "Inactive"]}
      />

      <DataTable columns={columns} data={filteredWarehouses} />

      {open && (
        <Modal
          title={editingItem ? "Edit Warehouse" : "Add Warehouse"}
          onClose={() => setOpen(false)}
        >
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <Input label="Warehouse Name" name="name" value={form.name} onChange={handleChange} />
            <Input label="Code" name="code" value={form.code} onChange={handleChange} />
            <Input label="Location" name="location" value={form.location} onChange={handleChange} />
            <Input label="Capacity" name="capacity" type="number" value={form.capacity} onChange={handleChange} />
            <Input label="Manager" name="manager" value={form.manager} onChange={handleChange} />

            <button className="btn-primary md:col-span-2">
              {editingItem ? "Update Warehouse" : "Save Warehouse"}
            </button>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Warehouse?"
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