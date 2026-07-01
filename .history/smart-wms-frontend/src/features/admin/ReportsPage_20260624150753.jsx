import DashboardLayout from "../../layouts/DashboardLayout";

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Reports</h1>
      <p className="text-muted mt-1">Company-level warehouse reports</p>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {["Inventory Report", "Stock Movement Report", "Supplier Report", "Warehouse Capacity Report", "Low Stock Report", "User Activity Report"].map((report) => (
          <div key={report} className="card p-6">
            <h2 className="text-xl font-bold text-navy">{report}</h2>
            <p className="text-muted mt-2">View and export {report.toLowerCase()}.</p>
            <button className="btn-primary mt-5">View Report</button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}