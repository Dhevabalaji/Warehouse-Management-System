import PlaceholderPage from "../shared/PlaceholderPage";

const logs = [
  {
    id: 1,
    user: "Admin User",
    action: "Created warehouse",
    module: "Warehouse",
    time: "Today 10:30 AM",
    status: "Success",
  },
  {
    id: 2,
    user: "Warehouse Manager",
    action: "Updated inventory",
    module: "Inventory",
    time: "Today 09:45 AM",
    status: "Success",
  },
  {
    id: 3,
    user: "System",
    action: "Low stock alert generated",
    module: "Alert",
    time: "Yesterday 04:20 PM",
    status: "Warning",
  },
];

export default function AdminAuditLogs() {
  return (
    <PlaceholderPage
      title="Audit Logs"
      subtitle="Track user actions and system events"
    >
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Module</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.user}</td>
                <td>{log.action}</td>
                <td>{log.module}</td>
                <td>{log.time}</td>
                <td>
                  <span
                    className={
                      log.status === "Warning"
                        ? "badge-warning"
                        : "badge-success"
                    }
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PlaceholderPage>
  );
}