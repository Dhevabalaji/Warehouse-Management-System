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
import { supplierService } from "../../services/supplierService.js";

const initialForm = {
  name: "",
  contactPerson: "",
  email: "",
  phone: "",
  city: "",
};

export default function SuppliersPage() {
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [form, setForm] = useState(initialForm);

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadSuppliers() {
    try {
      setLoading(true);
      const data = await supplierService.getAll();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSuppliers();
  }, []);

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
      name: item.name || "",
      contactPerson: item.contactPerson || "",
      email: item.email || "",
      phone: item.phone || "",
      city: item.city || "",
    });
    setOpen(true);
  }

  async function deleteItem(id) {
    try {
      await supplierService.remove(id);
      setSuppliers((prev) => prev.filter((item) => item.id !== id));
      setDeleteTarget(null);
      toast.success("Supplier deleted");
    } catch (error) {
      toast.error(error.message || "Failed to delete supplier");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      contactPerson: form.contactPerson.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
    };

    try {
      if (editingItem) {
        const res = await supplierService.update(editingItem.id, payload);
        const updatedSupplier = res.supplier;

        setSuppliers((prev) =>
          prev.map((item) =>
            item.id === editingItem.id ? updatedSupplier : item
          )
        );

        toast.success("Supplier updated");
      } else {
        const res = await supplierService.create(payload);
        setSuppliers((prev) => [res.supplier, ...prev]);
        toast.success("Supplier added");
      }

      setOpen(false);
      setEditingItem(null);
      setForm(initialForm);
    } catch (error) {
      toast.error(error.message || "Failed to save supplier");
    }
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

  if (loading) {
    return <PageLoader text="Loading suppliers..." />;
  }

  return (
    <>
      <PageHeader
        title="Suppliers"
        description="Manage suppliers directly using Flask backend"
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