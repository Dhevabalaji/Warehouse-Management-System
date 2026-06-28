import PlaceholderPage from "../shared/PlaceholderPage";

export default function ManagerSuppliers() {
  return (
    <PlaceholderPage
      title="Suppliers"
      subtitle="Supplier details and performance"
    >
      <div className="grid md:grid-cols-3 gap-5">
        {["Apex Industrial", "SafeGuard Ltd", "PrintMaster"].map((supplier) => (
          <div key={supplier} className="content-card p-5">
            <h3 className="font-bold">{supplier}</h3>
            <p className="text-slate-500 mt-1">Active Supplier</p>
            <p className="mt-3 text-sm">On-time Delivery: 92%</p>
            <p className="text-sm">Rating: 4.5/5</p>
          </div>
        ))}
      </div>
    </PlaceholderPage>
  );
}