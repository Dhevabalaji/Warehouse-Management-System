import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import Modal from "../../components/common/Modal.jsx";
import SearchFilterBar from "../../components/common/SearchFilterBar.jsx";
import ActionButtons from "../../components/common/ActionButtons.jsx";
import ConfirmModal from "../../components/common/ConfirmModal.jsx";
import useAuthContext from "../../hooks/useAuthContext";
import { demoUsers } from "../../data/mockData.js";
import { searchRows, filterRows } from "../../utils/filterUtils.js";
import { getStorage, setStorage } from "../../utils/storageService.js";
import { addActivity, addNotification } from "../../utils/activityLogger.js";

const initialForm = {
  name: "",
  email: "",
  password: "12345678",
  role: "staff",
  warehouse: "",
};

export default function UsersPage() {
  const { user } = useAuthContext();
  const customUsers = getStorage("wms_custom_users", []);

  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [form, setForm] = useState(initialForm);

  const [users, setUsers] = useState(
    [...demoUsers, ...customUsers].filter(
      (item) => item.companyCode === user.companyCode
    )
  );

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
      name: item.name,
      email: item.email,
      password: item.password || "12345678",
      role: item.role,
      warehouse: item.warehouse || "",
    });
    setOpen(true);
  }

  function deleteItem(id) {
    const selectedUser = users.find((item) => item.id === id);

    if (selectedUser?.role === "admin") {
      toast.error("Admin user cannot be deleted");
      setDeleteTarget(null);
      return;
    }

    const allCustom = getStorage("wms_custom_users", []);

    const updatedCustom = allCustom.filter((item) => item.id !== id);
    const updatedLocal = users.filter((item) => item.id !== id);

    setStorage("wms_custom_users", updatedCustom);
    setUsers(updatedLocal);
    setDeleteTarget(null);

    addActivity({
      title: "User Deleted",
      description: `${selectedUser?.name || "User"} was deleted`,
      type: "danger",
      user,
    });

    addNotification({
      title: "User Deleted",
      message: `${selectedUser?.name || "User"} was deleted by ${user.name}`,
      type: "danger",
      user,
      targetRole: "admin",
    });

    toast.success("User deleted");
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (editingItem) {
      const updatedUser = {
        ...editingItem,
        ...form,
      };

      const allCustom = getStorage("wms_custom_users", []);

      const updatedCustom = allCustom.map((item) =>
        item.id === editingItem.id ? updatedUser : item
      );

      const updatedLocal = users.map((item) =>
        item.id === editingItem.id ? updatedUser : item
      );

      setStorage("wms_custom_users", updatedCustom);
      setUsers(updatedLocal);
      setOpen(false);
      setEditingItem(null);

      addActivity({
        title: "User Updated",
        description: `${form.name} user details were updated`,
        type: "success",
        user,
      });

      addNotification({
        title: "User Updated",
        message: `${form.name} was updated by ${user.name}`,
        type: "success",
        user,
        targetRole: "admin",
      });

      toast.success("User updated");
      return;
    }

    const exists = users.some(
      (item) => item.email.toLowerCase() === form.email.toLowerCase()
    );

    if (exists) {
      toast.error("Email already exists");
      return;
    }

    const newUser = {
      id: Date.now(),
      ...form,
      companyCode: user.companyCode,
      tenantId: user.tenantId,
    };

    const allCustom = getStorage("wms_custom_users", []);
    setStorage("wms_custom_users", [...allCustom, newUser]);

    setUsers([...users, newUser]);
    setOpen(false);
    setForm(initialForm);

    addActivity({
      title: "User Added",
      description: `${form.name} user was added as ${form.role}`,
      type: "success",
      user,
    });

    addNotification({
      title: "User Added",
      message: `${form.name} was added by ${user.name}`,
      type: "success",
      user,
      targetRole: "admin",
    });

    toast.success("User added");
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

  return (
    <>
      <PageHeader
        title="Users"
        description="Create managers and staff under this company"
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
            <Input label="Password" name="password" value={form.password} onChange={handleChange} />

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

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-slate-300">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} required className="input" />
    </div>
  );
}