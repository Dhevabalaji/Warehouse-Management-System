import { ClipboardList, PackagePlus, PackageMinus, Truck } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";

const stats = [
  { title: "Today’s Tasks", value: "14", icon: ClipboardList },
  { title: "Stock In", value: "8", icon: PackagePlus },
  { title: "Stock Out", value: "6", icon: PackageMinus },
  { title: "Incoming Deliveries", value: "3", icon: Truck },
];

export default function StaffDashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Staff Dashboard</h1>
      <p className="text-muted mt-1">Daily warehouse execution tasks</p>

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
          <h2 className="text-xl font-bold text-navy">Assigned Tasks</h2>

          <div className="mt-5 space-y-4">
            <div className="p-4 bg-slate-100 rounded-xl">
              Receive shipment PO-2024-0089
            </div>
            <div className="p-4 bg-slate-100 rounded-xl">
              Pick stock for Dispatch #DSP-1204
            </div>
            <div className="p-4 bg-slate-100 rounded-xl">
              Scan damaged goods in Zone B
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-navy">Quick Actions</h2>

          <div className="grid grid-cols-2 gap-4 mt-5">
            <button className="btn-primary">Stock In</button>
            <button className="btn-primary">Stock Out</button>
            <button className="btn-primary">Scan Barcode</button>
            <button className="btn-primary">Search Product</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}