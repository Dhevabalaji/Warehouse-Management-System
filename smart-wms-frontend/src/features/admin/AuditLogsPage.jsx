import DashboardLayout from "../../layouts/DashboardLayout";

const logs = [
  {
    id: 1,
    user: "Marcus Chen",
    action: "Created new warehouse",
    module: "Warehouse",
    time: "Today, 10:30 AM",
    status: "Success",
  },
  {
    id: 2,
    user: "Sarah Okonkwo",
    action: "Updated product quantity",
    module: "Inventory",
    time: "Today, 09:45 AM",
    status: "Success",
  },
  {
    id: 3,
    user: "Priya Nair",
    action: "Recorded stock out",
    module: "Stock Out",
    time: "Yesterday, 05:15 PM",
    status: "Success",
  },
  {
    id: 4,
    user: "System",
    action: "Low stock alert generated",
    module: "Alerts",
    time: "Yesterday, 02:20 PM",
    status: "Warning",
  },
];

export default function AuditLogsPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Audit Logs</h1>
      <p className="text-muted mt-1">
        Track user activities and system actions
      </p>

      <div className="card p-6 mt-8 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-muted border-b">
              <th className="py-3">User</th>
              <th>Action</th>
              <th>Module</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b last:border-0">
                <td className="py-4 font-semibold">{log.user}</td>
                <td>{log.action}</td>
                <td>{log.module}</td>
                <td>{log.time}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      log.status === "Warning"
                        ? "bg-yellow-100 text-warning"
                        : "bg-green/10 text-green"
                    }`}
                  >
                    {log.status}
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