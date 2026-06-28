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
  name: "",
  code: "",
  location: "",
  capacity: "",
  manager: "",
};

export default function WarehousesPage() {
  const { user } = useAuthContext();

  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [form, setForm] = useState(initialForm);

  const [warehouses, setWarehouses] = useState(
    getStorage("wms_warehouses", []).filter(
      (item) => item.companyCode === user.companyCode
    )
  );

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
      name: item.name,
      code: item.code,
      location: item.location,
      capacity: item.capacity,
      manager: item.manager,
    });
    setOpen(true);
  }

  function deleteItem(id) {
    const selected = warehouses.find((item) => item.id === id);
    const all = getStorage("wms_warehouses", []);

    const updatedAll = all.filter((item) => item.id !== id);
    const updatedLocal = warehouses.filter((item) => item.id !== id);

    setStorage("wms_warehouses", updatedAll);
    setWarehouses(updatedLocal);
    setDeleteTarget(null);

    addActivity({
      title: "Warehouse Deleted",
      description: `${selected?.name || "Warehouse"} was deleted`,
      type: "danger",
      user,
    });

    addNotification({
      title: "Warehouse Deleted",
      message: `${selected?.name || "Warehouse"} was deleted by ${user.name}`,
      type: "danger",
      user,
      targetRole: "admin",
    });

    toast.success("Warehouse deleted");
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (editingItem) {
      const updatedItem = {
        ...editingItem,
        ...form,
      };

      const all = getStorage("wms_warehouses", []);

      const updatedAll = all.map((item) =>
        item.id === editingItem.id ? updatedItem : item
      );

      const updatedLocal = warehouses.map((item) =>
        item.id === editingItem.id ? updatedItem : item
      );

      setStorage("wms_warehouses", updatedAll);
      setWarehouses(updatedLocal);
      setOpen(false);
      setEditingItem(null);

      addActivity({
        title: "Warehouse Updated",
        description: `${form.name} warehouse details were updated`,
        type: "success",
        user,
      });

      addNotification({
        title: "Warehouse Updated",
        message: `${form.name} was updated by ${user.name}`,
        type: "success",
        user,
        targetRole: "admin",
      });

      toast.success("Warehouse updated");
      return;
    }

    const codeExists = warehouses.some(
      (item) => item.code.toLowerCase() === form.code.toLowerCase()
    );

    if (codeExists) {
      toast.error("Warehouse code already exists");
      return;
    }

    const newWarehouse = {
      id: `WH-${Date.now()}`,
      ...form,
      status: "Active",
      companyCode: user.companyCode,
      tenantId: user.tenantId,
    };

    const all = getStorage("wms_warehouses", []);
    setStorage("wms_warehouses", [...all, newWarehouse]);

    setWarehouses([...warehouses, newWarehouse]);
    setOpen(false);
    setForm(initialForm);

    addActivity({
      title: "Warehouse Added",
      description: `${form.name} warehouse was added`,
      type: "success",
      user,
    });

    addNotification({
      title: "Warehouse Added",
      message: `${form.name} was added by ${user.name}`,
      type: "success",
      user,
      targetRole: "admin",
    });

    toast.success("Warehouse added");
  }

  const columns = [
    { key: "name", label: "Warehouse" },
    { key: "code", label: "Code" },
    { key: "location", label: "Location" },
    { key: "capacity", label: "Capacity %" },
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

  return (
    <>
      <PageHeader
        title="Warehouses"
        description="Manage company warehouse branches"
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
            <Input label="Capacity %" name="capacity" value={form.capacity} onChange={handleChange} />
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

function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="text-sm text-slate-300">{label}</label>
      <input name={name} value={value} onChange={onChange} required className="input" />
    </div>
  );
}