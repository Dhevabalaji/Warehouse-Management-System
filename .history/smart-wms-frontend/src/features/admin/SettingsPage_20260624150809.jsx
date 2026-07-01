import DashboardLayout from "../../layouts/DashboardLayout";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Company Settings</h1>
      <p className="text-muted mt-1">Manage tenant profile and system preferences</p>

      <div className="card p-6 mt-8 max-w-3xl space-y-4">
        <input className="input" defaultValue="WMS Pro Logistics" />
        <input className="input" defaultValue="WMSPRO" />
        <input className="input" defaultValue="admin@wms.io" />
        <textarea className="input" rows="4" defaultValue="Main warehouse operations company." />
        <button className="btn-primary">Save Settings</button>
      </div>
    </DashboardLayout>
  );
}