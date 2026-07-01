import DashboardLayout from "../../layouts/DashboardLayout";
import { suppliers } from "../../data/mockData";

export default function SuppliersPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Suppliers</h1>
      <p className="text-muted mt-1">Manage supplier contacts and performance</p>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {suppliers.map((s) => (
          <div key={s.id} className="card p-6">
            <h2 className="text-xl font-bold text-navy">{s.name}</h2>
            <p className="text-muted mt-1">{s.category}</p>

            <div className="mt-5 space-y-2 text-sm">
              <p><b>Contact:</b> {s.contact}</p>
              <p><b>Orders:</b> {s.orders}</p>
              <p><b>On-time:</b> {s.onTime}</p>
              <p><b>Rating:</b> {s.rating}</p>
            </div>

            <span className="inline-block mt-5 px-3 py-1 rounded-full bg-green/10 text-green font-semibold">
              {s.status}
            </span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
