import DashboardLayout from "../../layouts/DashboardLayout";

const users = [
  { id: 1, name: "Marcus Chen", email: "admin@wms.io", role: "Company Admin", status: "Active" },
  { id: 2, name: "Sarah Okonkwo", email: "manager@wms.io", role: "Manager", status: "Active" },
  { id: 3, name: "Priya Nair", email: "staff@wms.io", role: "Staff", status: "Active" },
];

export default function UserManagementPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">User Management</h1>
      <p className="text-muted mt-1">Manage company users and role access</p>

      <div className="card p-6 mt-8 overflow-x-auto">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold text-navy">Users</h2>
          <button className="btn-primary">Add User</button>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="text-muted border-b">
              <th className="py-3">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b last:border-0">
                <td className="py-4 font-semibold">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <span className="px-3 py-1 rounded-full bg-green/10 text-green font-semibold">
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}