import { Building2, Package, Users, AlertTriangle } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";

const stats = [
  { title: "Total Warehouses", value: "12", icon: Building2 },
  { title: "Total Products", value: "8,420", icon: Package },
  { title: "Total Staff", value: "248", icon: Users },
  { title: "Low Stock Items", value: "37", icon: AlertTriangle },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Admin Dashboard</h1>
      <p className="text-muted mt-1">Company-level warehouse overview</p>

      <div className="grid md:grid-cols-4 gap-6 mt-8">
        {stats.map(({ title, value, icon: Icon }) => (
          <div key={title} className="card p-6">
            <Icon className="text-green mb-4" size={30} />
            <h3 className="text-3xl font-bold text-navy">{value}</h3>
            <p className="text-muted">{title}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-navy">Recent Activities</h2>
          <div className="mt-5 space-y-4">
            <p className="text-muted">New manager added to Central Hub</p>
            <p className="text-muted">Low stock alert generated for PPE category</p>
            <p className="text-muted">Warehouse WH-004 updated capacity details</p>
            <p className="text-muted">Monthly inventory report generated</p>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-navy">Admin Controls</h2>
          <div className="grid grid-cols-2 gap-4 mt-5">
            <button className="btn-primary">Manage Users</button>
            <button className="btn-primary">Warehouses</button>
            <button className="btn-primary">Reports</button>
            <button className="btn-primary">Settings</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}