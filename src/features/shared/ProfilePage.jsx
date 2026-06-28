import { useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader.jsx";
import useAuthContext from "../../hooks/useAuthContext";

export default function ProfilePage() {
  const { user } = useAuthContext();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "",
    companyCode: user?.companyCode || "",
    tenantId: user?.tenantId || "",
    warehouse: user?.warehouse || "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const updatedUser = {
      ...user,
      name: form.name,
      warehouse: form.warehouse,
    };

    localStorage.setItem("wms_user", JSON.stringify(updatedUser));

    toast.success("Profile updated. Login again to refresh full session.");
  }

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="View and update your account information"
      />

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
          <div className="h-24 w-24 rounded-3xl bg-yellow-400 text-slate-950 flex items-center justify-center text-4xl font-black mb-5">
            {user?.name?.charAt(0) || "U"}
          </div>

          <h2 className="text-2xl font-black">{user?.name}</h2>
          <p className="text-slate-400 mt-1">{user?.email}</p>

          <div className="mt-6 space-y-3 text-sm">
            <Info label="Role" value={user?.role} />
            <Info label="Company Code" value={user?.companyCode} />
            <Info label="Tenant ID" value={user?.tenantId} />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="xl:col-span-2 rounded-3xl bg-white/5 border border-white/10 p-6"
        >
          <h2 className="text-xl font-black mb-5">Account Details</h2>

          <div className="grid md:grid-cols-2 gap-5">
            <Input
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />

            <Input
              label="Email"
              name="email"
              value={form.email}
              disabled
              onChange={handleChange}
            />

            <Input
              label="Role"
              name="role"
              value={form.role}
              disabled
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
              label="Tenant ID"
              name="tenantId"
              value={form.tenantId}
              disabled
              onChange={handleChange}
            />

            <Input
              label="Warehouse"
              name="warehouse"
              value={form.warehouse}
              onChange={handleChange}
            />
          </div>

          <button className="btn-primary mt-6">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between border-b border-white/10 pb-3">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold capitalize">{value}</span>
    </div>
  );
}

function Input({ label, name, value, onChange, disabled = false }) {
  return (
    <div>
      <label className="text-sm text-slate-300">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`input ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
      />
    </div>
  );
}