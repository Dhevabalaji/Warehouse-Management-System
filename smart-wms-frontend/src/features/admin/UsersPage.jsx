import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../../components/common/PageHeader.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import Modal from "../../components/common/Modal.jsx";
import SearchFilterBar from "../../components/common/SearchFilterBar.jsx";
import ActionButtons from "../../components/common/ActionButtons.jsx";
import ConfirmModal from "../../components/common/ConfirmModal.jsx";
import PageLoader from "../../components/common/PageLoader.jsx";

import { searchRows, filterRows } from "../../utils/filterUtils.js";
import { userService } from "../../services/userService.js";

const initialForm = {
  name: "",
  email: "",
  password: "12345678",
  role: "staff",
  warehouse: "",
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const searched = searchRows(users, search, [
      "name",
      "email",
      "role",
      "warehouse",
    ]);

    return filterRows(searched, roleFilter, "role");
  }, [users, search, roleFilter]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function openCreateModal() {
    setEditingItem(null);
    setForm(initialForm);
    setOpen(true);
  }

  function openEditModal(item) {
    if (item.role === "admin") {
      toast.error("Admin user cannot be edited");
      return;
    }

    setEditingItem(item);
    setForm({
      name: item.name || "",
      email: item.email || "",
      password: "",
      role: item.role || "staff",
      warehouse: item.warehouse || "",
    });
    setOpen(true);
  }

  async function deleteItem(id) {
    try {
      await userService.remove(id);
      setUsers((prev) => prev.filter((item) => item.id !== id));
      setDeleteTarget(null);
      toast.success("User deleted");
    } catch (error) {
      toast.error(error.message || "Failed to delete user");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      warehouse: form.warehouse.trim(),
    };

    if (!editingItem || form.password) {
      payload.password = form.password;
    }

    try {
      if (editingItem) {
        const res = await userService.update(editingItem.id, payload);
        setUsers((prev) =>
          prev.map((item) => (item.id === editingItem.id ? res.user : item))
        );
        toast.success("User updated");
      } else {
        const res = await userService.create(payload);
        setUsers((prev) => [res.user, ...prev]);
        toast.success("User added");
      }

      setOpen(false);
      setEditingItem(null);
      setForm(initialForm);
    } catch (error) {
      toast.error(error.message || "Failed to save user");
    }
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "warehouse", label: "Warehouse" },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) =>
        row.role === "admin" ? (
          <span className="text-slate-500 text-sm">Locked</span>
        ) : (
          <ActionButtons
            onEdit={() => openEditModal(row)}
            onDelete={() => setDeleteTarget(row)}
          />
        ),
    },
  ];

  if (loading) {
    return <PageLoader text="Loading users..." />;
  }

  return (
    <>
      <PageHeader
        title="Users"
        description="Create managers and staff using backend API"
        action={
          <button onClick={openCreateModal} className="btn-primary">
            <Plus size={18} /> Add User
          </button>
        }
      />

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        filterValue={roleFilter}
        onFilterChange={setRoleFilter}
        filterPlaceholder="All Roles"
        filterOptions={["admin", "manager", "staff"]}
      />

      <DataTable columns={columns} data={filteredUsers} />

      {open && (
        <Modal
          title={editingItem ? "Edit User" : "Add User"}
          onClose={() => setOpen(false)}
        >
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <Input label="Name" name="name" value={form.name} onChange={handleChange} />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
            <Input
              label={editingItem ? "New Password (optional)" : "Password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required={!editingItem}
            />

            <div>
              <label className="text-sm text-slate-300">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="input">
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            <Input label="Warehouse" name="warehouse" value={form.warehouse} onChange={handleChange} />

            <button className="btn-primary md:col-span-2">
              {editingItem ? "Update User" : "Save User"}
            </button>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete User?"
          message={`Are you sure you want to delete ${deleteTarget.name}?`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => deleteItem(deleteTarget.id)}
        />
      )}
    </>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = true,
}) {
  return (
    <div>
      <label className="text-sm text-slate-300">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="input"
      />
    </div>
  );
}