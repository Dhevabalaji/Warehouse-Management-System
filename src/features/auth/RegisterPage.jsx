import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Boxes, Loader2 } from "lucide-react";
import useAuthContext from "../../hooks/useAuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { registerTenant, loading } = useAuthContext();

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    companyName: "",
    companyCode: "",
    companyEmail: "",
    phone: "",
    address: "",
    adminName: "",
    adminEmail: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const result = await registerTenant(form);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-3 mb-8">
          <div className="h-11 w-11 rounded-2xl bg-yellow-400 text-slate-950 flex items-center justify-center">
            <Boxes />
          </div>
          <div>
            <h1 className="text-xl font-bold">Smart WMS</h1>
            <p className="text-xs text-slate-400">Company Registration</p>
          </div>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white/5 border border-white/10 p-8"
        >
          <h2 className="text-3xl font-black mb-2">Register Company</h2>
          <p className="text-slate-400 mb-8">
            Create tenant account and company admin.
          </p>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          <SectionTitle title="Company Details" />

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
          </div>

          <div className="mb-7">
            <label className="text-sm text-slate-300">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="3"
              className="mt-2 w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </div>

          <SectionTitle title="Admin Account" />

          <div className="grid md:grid-cols-2 gap-5">
            <Input
              label="Admin Name"
              name="adminName"
              value={form.adminName}
              onChange={handleChange}
            />

            <Input
              label="Admin Email"
              name="adminEmail"
              type="email"
              value={form.adminEmail}
              onChange={handleChange}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            disabled={loading}
            className="w-full md:w-auto px-8 rounded-xl bg-yellow-400 text-slate-950 font-bold py-3 hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Creating..." : "Create Company"}
          </button>

          <p className="text-slate-400 text-sm mt-6">
            Already registered?{" "}
            <Link to="/login" className="text-yellow-400 font-semibold">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <h3 className="text-lg font-bold text-yellow-400 mb-4 border-b border-white/10 pb-3">
      {title}
    </h3>
  );
}

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div className="mb-5">
      <label className="text-sm text-slate-300">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 outline-none focus:border-yellow-400"
        required
      />
    </div>
  );
}