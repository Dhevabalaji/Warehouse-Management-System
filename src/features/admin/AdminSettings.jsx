import PlaceholderPage from "../shared/PlaceholderPage";

export default function AdminSettings() {
  return (
    <PlaceholderPage
      title="Company Settings"
      subtitle="Manage tenant preferences and company details"
    >
      <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
        <input className="form-input" defaultValue="WMS Pro Logistics" />
        <input className="form-input" defaultValue="WMSPRO" />
        <input className="form-input" defaultValue="admin@wms.io" />
        <input className="form-input" defaultValue="Chennai, Tamil Nadu" />
      </div>

      <button className="btn-primary mt-6">Save Settings</button>
    </PlaceholderPage>
  );
}