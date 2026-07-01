import DashboardLayout from "../../layouts/DashboardLayout";
import { demoUsers } from "../../data/mockData";
import { getStorage } from "../../utils/storageService";
import useAuthContext from "../../hooks/useAuthContext";

export default function UserManagementPage() {
  const { user } = useAuthContext();

  const customUsers = getStorage("wms_custom_users", []);

  const allUsers = [...demoUsers, ...customUsers].filter(
    (u) => u.companyCode === user?.companyCode
  );

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">User Management</h1>
      <p className="text-muted mt-1">Manage users inside your tenant company</p>

      <div className="card p-6 mt-8 overflow-x-auto">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold text-navy">Company Users</h2>
          <span className="px-4 py-2 rounded-xl bg-green/10 text-green font-semibold">
            {allUsers.length} Users
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
            </tr>
          </thead>

          <tbody>
            {allUsers.map((u) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}