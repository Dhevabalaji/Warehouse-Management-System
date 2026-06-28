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
  contactPerson: "",
  email: "",
  phone: "",
  city: "",
};

export default function SuppliersPage() {
  const { user } = useAuthContext();

  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [form, setForm] = useState(initialForm);

  const [suppliers, setSuppliers] = useState(
    getStorage("wms_suppliers", []).filter(
      (item) => item.companyCode === user.companyCode
    )
  );

  const filteredSuppliers = useMemo(() => {
    const searched = searchRows(suppliers, search, [
      "name",
      "contactPerson",
      "email",
      "phone",
      "city",
    ]);

    return filterRows(searched, statusFilter, "status");
  }, [suppliers, search, statusFilter]);

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
      contactPerson: item.contactPerson,
      email: item.email,
      phone: item.phone,
      city: item.city,
    });
    setOpen(true);
  }

  function deleteItem(id) {
    const selected = suppliers.find((item) => item.id === id);
    const all = getStorage("wms_suppliers", []);

    const updatedAll = all.filter((item) => item.id !== id);
    const updatedLocal = suppliers.filter((item) => item.id !== id);

    setStorage("wms_suppliers", updatedAll);
    setSuppliers(updatedLocal);
    setDeleteTarget(null);

    addActivity({
      title: "Supplier Deleted",
      description: `${selected?.name || "Supplier"} was deleted`,
      type: "danger",
      user,
    });

    addNotification({
      title: "Supplier Deleted",
      message: `${selected?.name || "Supplier"} was deleted by ${user.name}`,
      type: "danger",
      user,
      targetRole: "admin",
    });

    toast.success("Supplier deleted");
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (editingItem) {
      const updatedItem = {
        ...editingItem,
        ...form,
      };

      const all = getStorage("wms_suppliers", []);

      const updatedAll = all.map((item) =>
        item.id === editingItem.id ? updatedItem : item
      );

      const updatedLocal = suppliers.map((item) =>
        item.id === editingItem.id ? updatedItem : item
      );

      setStorage("wms_suppliers", updatedAll);
      setSuppliers(updatedLocal);
      setOpen(false);
      setEditingItem(null);

      addActivity({
        title: "Supplier Updated",
        description: `${form.name} supplier details were updated`,
        type: "success",
        user,
      });

      addNotification({
        title: "Supplier Updated",
        message: `${form.name} was updated by ${user.name}`,
        type: "success",
        user,
        targetRole: "admin",
      });

      toast.success("Supplier updated");
      return;
    }

    const emailExists = suppliers.some(
      (item) => item.email.toLowerCase() === form.email.toLowerCase()
    );

    if (emailExists) {
      toast.error("Supplier email already exists");
      return;
    }

    const supplier = {
      id: `S-${Date.now()}`,
      ...form,
      status: "Active",
      companyCode: user.companyCode,
      tenantId: user.tenantId,
    };

    const all = getStorage("wms_suppliers", []);
    setStorage("wms_suppliers", [...all, supplier]);

    setSuppliers([...suppliers, supplier]);
    setOpen(false);
    setForm(initialForm);

    addActivity({
      title: "Supplier Added",
      description: `${form.name} supplier was added`,
      type: "success",
      user,
    });

    addNotification({
      title: "Supplier Added",
      message: `${form.name} was added by ${user.name}`,
      type: "success",
      user,
      targetRole: "admin",
    });

    toast.success("Supplier added");
  }

  const columns = [
    { key: "name", label: "Supplier" },
    { key: "contactPerson", label: "Contact Person" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "city", label: "City" },
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
        title="Suppliers"
        description="Manage product suppliers"
        action={
          <button onClick={openCreateModal} className="btn-primary">
            <Plus size={18} /> Add Supplier
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

      <DataTable columns={columns} data={filteredSuppliers} />

      {open && (
        <Modal
          title={editingItem ? "Edit Supplier" : "Add Supplier"}
          onClose={() => setOpen(false)}
        >
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <Input label="Supplier Name" name="name" value={form.name} onChange={handleChange} />
            <Input label="Contact Person" name="contactPerson" value={form.contactPerson} onChange={handleChange} />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
            <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            <Input label="City" name="city" value={form.city} onChange={handleChange} />

            <button className="btn-primary md:col-span-2">
              {editingItem ? "Update Supplier" : "Save Supplier"}
            </button>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Supplier?"
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
      <input type={type} name={name} value={value} onChange={onChange} required className="input" />
    </div>
  );
}