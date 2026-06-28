import PlaceholderPage from "../shared/PlaceholderPage";

export default function AdminReports() {
  return (
    <PlaceholderPage
      title="Reports"
      subtitle="Inventory, warehouse and user activity reports"
    >
      <div className="grid md:grid-cols-3 gap-5">
        {[
          "Inventory Report",
          "Warehouse Capacity Report",
          "User Activity Report",
          "Stock Movement Report",
          "Supplier Report",
          "Low Stock Report",
        ].map((report) => (
          <div key={report} className="content-card p-5">
            <h3 className="font-bold">{report}</h3>
            <p className="text-slate-500 text-sm mt-2">
              View and export {report.toLowerCase()}.
            </p>
            <button className="btn-primary mt-4">View Report</button>
          </div>
        ))}
      </div>
    </PlaceholderPage>
  );
}