import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Boxes, Eye, EyeOff, Loader2 } from "lucide-react";
import useAuthContext from "../../hooks/useAuthContext";

const roleRoutes = {
  admin: "/admin/dashboard",
  manager: "/manager/dashboard",
  staff: "/staff/dashboard",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuthContext();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

const [form, setForm] = useState({
  companyCode: "SWMS001",
  email: "admin@smartwms.com",
  password: "Admin@123",
  role: "admin",
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

    const result = await login(form);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate(roleRoutes[result.user.role], { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-yellow-400 text-slate-950 flex items-center justify-center">
            <Boxes />
          </div>
          <div>
            <h1 className="text-xl font-bold">Smart WMS</h1>
            <p className="text-xs text-slate-400">Warehouse Intelligence</p>
          </div>
        </Link>

        <div>
          <h2 className="text-5xl font-black leading-tight">
            Control stock. Reduce errors. Move faster.
          </h2>
          <p className="text-slate-300 mt-5 max-w-lg">
            Login with company code, role, and credentials. Each role gets a
            separate dashboard and permissions.
          </p>
        </div>

        <p className="text-slate-500 text-sm">© 2026 Smart WMS</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-3xl bg-white/5 border border-white/10 p-8"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="h-11 w-11 rounded-2xl bg-yellow-400 text-slate-950 flex items-center justify-center">
              <Boxes />
            </div>
            <h1 className="text-xl font-bold">Smart WMS</h1>
          </div>

          <h2 className="text-3xl font-black mb-2">Login</h2>
          <p className="text-slate-400 mb-8">
            Enter your company and role details.
          </p>

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          <Input
            label="Company Code"
            name="companyCode"
            value={form.companyCode}
            onChange={handleChange}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />

          <div className="mb-5">
            <label className="text-sm text-slate-300">Password</label>
            <div className="mt-2 relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 pr-12 outline-none focus:border-yellow-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-slate-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm text-slate-300">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 outline-none focus:border-yellow-400"
            >
              <option value="admin">Company Admin</option>
              <option value="manager">Warehouse Manager</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-yellow-400 text-slate-950 font-bold py-3 hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-slate-400 text-sm mt-6">
            New company?{" "}
            <Link to="/register" className="text-yellow-400 font-semibold">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
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