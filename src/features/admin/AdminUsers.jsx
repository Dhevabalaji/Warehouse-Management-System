import PlaceholderPage from "../shared/PlaceholderPage";

export default function AdminUsers() {
  return (
    <PlaceholderPage
      title="User Management"
      subtitle="Manage admins, managers and warehouse staff"
    >
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Warehouse</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Admin User</td>
              <td>admin@wms.io</td>
              <td>Admin</td>
              <td>Company Level</td>
              <td>
                <span className="badge-success">Active</span>
              </td>
            </tr>

            <tr>
              <td>Warehouse Manager</td>
              <td>manager@wms.io</td>
              <td>Manager</td>
              <td>Central Hub</td>
              <td>
                <span className="badge-success">Active</span>
              </td>
            </tr>

            <tr>
              <td>Warehouse Staff</td>
              <td>staff@wms.io</td>
              <td>Staff</td>
              <td>Central Hub</td>
              <td>
                <span className="badge-success">Active</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </PlaceholderPage>
  );
}