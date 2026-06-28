import { useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader.jsx";
import useAuthContext from "../../hooks/useAuthContext";
import { getStorage, setStorage } from "../../utils/storageService.js";
import { addActivity } from "../../utils/activityLogger.js";

export default function SettingsPage() {
  const { user } = useAuthContext();

  const tenants = getStorage("wms_tenants", []);
  const currentTenant = tenants.find(
    (tenant) => tenant.companyCode === user.companyCode
  );

  const [form, setForm] = useState({
    companyName: currentTenant?.companyName || "",
    companyCode: currentTenant?.companyCode || user.companyCode,
    companyEmail: currentTenant?.companyEmail || "",
    phone: currentTenant?.phone || "",
    address: currentTenant?.address || "",
    lowStockAlert: currentTenant?.lowStockAlert || "enabled",
    emailNotifications: currentTenant?.emailNotifications || "enabled",
    timezone: currentTenant?.timezone || "Asia/Kolkata",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const updatedTenant = {
      ...(currentTenant || {}),
      ...form,
      companyCode: user.companyCode,
      tenantId: user.tenantId,
      updatedAt: new Date().toISOString(),
    };

    const exists = tenants.some(
      (tenant) => tenant.companyCode === user.companyCode
    );

    const updatedTenants = exists
      ? tenants.map((tenant) =>
          tenant.companyCode === user.companyCode ? updatedTenant : tenant
        )
      : [...tenants, updatedTenant];

    setStorage("wms_tenants", updatedTenants);

    addActivity({
      title: "Company Settings Updated",
      description: `${form.companyName || user.companyCode} settings were updated`,
      type: "success",
      user,
    });

    toast.success("Settings updated");
  }

  return (
    <div>
      <PageHeader
        title="Company Settings"
        description="Manage tenant profile, alerts, and notification settings"
      />

      <form
        onSubmit={handleSubmit}
        className="grid xl:grid-cols-3 gap-6"
      >
        <div className="xl:col-span-2 rounded-3xl bg-white/5 border border-white/10 p-6">
          <h2 className="text-xl font-black mb-5">Company Profile</h2>

          <div className="grid md:grid-cols-2 gap-5">
            <Input
              label="Company Name"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
            />

            <Input
              label="Company Code"
              name="companyCode"
              value={form.companyCode}
              disabled
              onChange={handleChange}
            />

            <Input
              label="Company Email"
              name="companyEmail"
              type="email"
              value={form.companyEmail}
              onChange={handleChange}
            />

            <Input
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />

            <div className="md:col-span-2">
              <label className="text-sm text-slate-300">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows="3"
                className="input"
              />
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
          <h2 className="text-xl font-black mb-5">System Preferences</h2>

          <div className="space-y-5">
            <Select
              label="Low Stock Alert"
              name="lowStockAlert"
              value={form.lowStockAlert}
              onChange={handleChange}
              options={["enabled", "disabled"]}
            />

            <Select
              label="Email Notifications"
              name="emailNotifications"
              value={form.emailNotifications}
              onChange={handleChange}
              options={["enabled", "disabled"]}
            />

            <Select
              label="Timezone"
              name="timezone"
              value={form.timezone}
              onChange={handleChange}
              options={["Asia/Kolkata", "UTC", "America/New_York", "Europe/London"]}
            />

            <button className="btn-primary w-full">
              Save Settings
            </button>
          </div>
        </div>
      </form>

      <div className="rounded-3xl bg-white/5 border border-white/10 p-6 mt-6">
        <h2 className="text-xl font-black mb-5">Tenant Information</h2>

        <div className="grid md:grid-cols-4 gap-5">
          <Info label="Tenant ID" value={user.tenantId} />
          <Info label="Company Code" value={user.companyCode} />
          <Info label="Logged Admin" value={user.name} />
          <Info label="Role" value={user.role} />
        </div>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text", disabled = false }) {
  return (
    <div>
      <label className="text-sm text-slate-300">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        required
        className={`input ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="text-sm text-slate-300">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="input"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-white/10 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="font-bold mt-2 capitalize">{value || "-"}</p>
    </div>
  );
}