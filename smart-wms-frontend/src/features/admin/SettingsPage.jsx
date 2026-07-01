import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader.jsx";
import PageLoader from "../../components/common/PageLoader.jsx";
import useAuthContext from "../../hooks/useAuthContext";
import { tenantService } from "../../services/tenantService.js";

export default function SettingsPage() {
  const { user } = useAuthContext();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    companyName: "",
    companyCode: "",
    companyEmail: "",
    phone: "",
    address: "",
    lowStockAlert: "enabled",
    emailNotifications: "enabled",
    timezone: "Asia/Kolkata",
  });

  async function loadTenant() {
    try {
      setLoading(true);
      const tenant = await tenantService.getProfile();

      setForm({
        companyName: tenant?.companyName || "",
        companyCode: tenant?.companyCode || user?.companyCode || "",
        companyEmail: tenant?.companyEmail || "",
        phone: tenant?.phone || "",
        address: tenant?.address || "",
        lowStockAlert: tenant?.lowStockAlert || "enabled",
        emailNotifications: tenant?.emailNotifications || "enabled",
        timezone: tenant?.timezone || "Asia/Kolkata",
      });
    } catch (error) {
      toast.error(error.message || "Failed to load company settings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTenant();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await tenantService.updateSettings(form);
      const tenant = res.tenant;

      setForm({
        companyName: tenant?.companyName || "",
        companyCode: tenant?.companyCode || user?.companyCode || "",
        companyEmail: tenant?.companyEmail || "",
        phone: tenant?.phone || "",
        address: tenant?.address || "",
        lowStockAlert: tenant?.lowStockAlert || "enabled",
        emailNotifications: tenant?.emailNotifications || "enabled",
        timezone: tenant?.timezone || "Asia/Kolkata",
      });

      toast.success("Settings updated");
    } catch (error) {
      toast.error(error.message || "Failed to update settings");
    }
  }

  if (loading) {
    return <PageLoader text="Loading settings..." />;
  }

  return (
    <div>
      <PageHeader
        title="Company Settings"
        description="Manage tenant profile, alerts, and notification settings from backend"
      />

      <form onSubmit={handleSubmit} className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-3xl bg-white/5 border border-white/10 p-6">
          <h2 className="text-xl font-black mb-5">Company Profile</h2>

          <div className="grid md:grid-cols-2 gap-5">
            <Input label="Company Name" name="companyName" value={form.companyName} onChange={handleChange} />

            <Input label="Company Code" name="companyCode" value={form.companyCode} disabled onChange={handleChange} />

            <Input label="Company Email" name="companyEmail" type="email" value={form.companyEmail} onChange={handleChange} />

            <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />

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

            <button className="btn-primary w-full">Save Settings</button>
          </div>
        </div>
      </form>

      <div className="rounded-3xl bg-white/5 border border-white/10 p-6 mt-6">
        <h2 className="text-xl font-black mb-5">Tenant Information</h2>

        <div className="grid md:grid-cols-4 gap-5">
          <Info label="Tenant ID" value={user?.tenantId} />
          <Info label="Company Code" value={user?.companyCode} />
          <Info label="Logged Admin" value={user?.name} />
          <Info label="Role" value={user?.role} />
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
      <select name={name} value={value} onChange={onChange} className="input">
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