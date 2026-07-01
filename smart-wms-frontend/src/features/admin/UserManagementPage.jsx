import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { demoUsers } from "../../data/mockData";
import { getStorage, setStorage } from "../../utils/storageService";
import useAuthContext from "../../hooks/useAuthContext";

export default function UserManagementPage() {
  const { user } = useAuthContext();
  const [editingUser, setEditingUser] = useState(null);

  const customUsers = getStorage("wms_custom_users", []);

  const users = [
    ...demoUsers.map((u) => ({ ...u, isDefault: true })),
    ...customUsers,
  ].filter((u) => u.companyCode === user?.companyCode);

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const updatedUsers = customUsers.filter((u) => u.id !== id);
    setStorage("wms_custom_users", updatedUsers);
    window.location.reload();
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    const updatedUsers = customUsers.map((u) =>
      u.id === editingUser.id ? editingUser : u
    );

    setStorage("wms_custom_users", updatedUsers);
    setEditingUser(null);
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">User Management</h1>
      <p className="text-muted mt-1">Manage users inside your tenant company</p>

      {editingUser && (
        <form onSubmit={handleEditSubmit} className="card p-6 mt-8">
          <h2 className="text-xl font-bold text-navy mb-5">Edit User</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              className="input"
              value={editingUser.name}
              onChange={(e) =>
                setEditingUser({ ...editingUser, name: e.target.value })
              }
            />

            <input
              className="input"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
            />

            <select
              className="input"
              value={editingUser.role}
              onChange={(e) =>
                setEditingUser({ ...editingUser, role: e.target.value })
              }
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
            </select>

            <input
              className="input"
              value={editingUser.warehouse || ""}
              placeholder="Assigned Warehouse"
              onChange={(e) =>
                setEditingUser({ ...editingUser, warehouse: e.target.value })
              }
            />

            <input
              className="input"
              value={editingUser.password || ""}
              placeholder="Password"
              onChange={(e) =>
                setEditingUser({ ...editingUser, password: e.target.value })
              }
            />
          </div>

          <div className="flex gap-3 mt-5">
            <button className="btn-primary">Save Changes</button>

            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="px-4 py-2 rounded-xl border"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="card p-6 mt-8 overflow-x-auto">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold text-navy">Company Users</h2>

          <span className="px-4 py-2 rounded-xl bg-green/10 text-green font-semibold">
            {users.length} Users
          </span>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="text-muted border-b">
              <th className="py-3">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Company Code</th>
              <th>Warehouse</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b last:border-0">
                <td className="py-4 font-semibold">{u.name}</td>
                <td>{u.email}</td>
                <td className="capitalize">{u.role}</td>
                <td>{u.companyCode}</td>
                <td>{u.warehouse || "Company Level"}</td>
                <td>
                  <span className="px-3 py-1 rounded-full bg-green/10 text-green font-semibold">
                    Active
                  </span>
                </td>
                <td className="space-x-2">
                  {!u.isDefault ? (
                    <>
                      <button
                        onClick={() => setEditingUser(u)}
                        className="px-3 py-1 rounded-lg bg-navy text-white text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(u.id)}
                        className="px-3 py-1 rounded-lg bg-danger text-white text-sm"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <span className="text-sm text-muted">Demo user</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}