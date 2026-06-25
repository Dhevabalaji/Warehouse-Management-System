import DashboardLayout from "../../layouts/DashboardLayout";

const notifications = [
  {
    id: 1,
    title: "Low Stock Alert",
    message: "Barcode Label Rolls stock below minimum threshold.",
    time: "10 mins ago",
    type: "warning",
  },
  {
    id: 2,
    title: "Purchase Order Approved",
    message: "PO-2024-0089 approved successfully.",
    time: "1 hour ago",
    type: "success",
  },
  {
    id: 3,
    title: "New User Created",
    message: "Warehouse Staff account created.",
    time: "Today",
    type: "info",
  },
];

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Notifications</h1>

      <div className="mt-8 space-y-4">
        {notifications.map((item) => (
          <div key={item.id} className="card p-5">
            <div className="flex justify-between">
              <h3 className="font-bold text-lg">{item.title}</h3>
              <span className="text-sm text-muted">{item.time}</span>
            </div>

            <p className="text-muted mt-2">{item.message}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}