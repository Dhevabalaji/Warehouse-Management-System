import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const [form, setForm] = useState({
    companyCode: "WMSPRO",
    email: "admin@wms.io",
    password: "12345678",
    role: "admin",
  });

  const [error, setError] = useState("");

  const redirectByRole = (role) => {
    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "manager") navigate("/manager/dashboard");
    else if (role === "staff") navigate("/staff/dashboard");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = login(form);

    if (!result.success) {
      setError("Invalid company code, email, password or role");
      return;
    }

    redirectByRole(result.user.role);
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="card w-full max-w-5xl grid md:grid-cols-2 overflow-hidden">
        <div className="bg-navy text-white p-10">
          <h1 className="text-4xl font-bold">WMS Pro</h1>
          <p className="text-blue-100 mt-4">
            Role-based smart warehouse management system.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-10">
            <div className="bg-white/10 p-5 rounded-2xl">
              <h3 className="text-2xl font-bold">8,420</h3>
              <p className="text-sm text-blue-100">Total SKUs</p>
            </div>
            <div className="bg-white/10 p-5 rounded-2xl">
              <h3 className="text-2xl font-bold">99.7%</h3>
              <p className="text-sm text-blue-100">Accuracy</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10">
          <h2 className="text-2xl font-bold text-navy">Login</h2>
          <p className="text-muted mt-1">Access your warehouse dashboard</p>

          {error && <p className="bg-red-100 text-danger p-3 rounded-xl mt-4">{error}</p>}

          <div className="space-y-4 mt-6">
            <input
              className="input"
              placeholder="Company Code"
              value={form.companyCode}
              onChange={(e) => setForm({ ...form, companyCode: e.target.value })}
            />

            <input
              className="input"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              className="input"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <select
              className="input"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="admin">Company Admin</option>
              <option value="manager">Warehouse Manager</option>
              <option value="staff">Warehouse Staff</option>
            </select>
          </div>

          <button className="btn-primary w-full mt-6">Login</button>

          <p className="text-sm text-muted mt-5">
            Demo:
            <br /> admin@wms.io / manager@wms.io / staff@wms.io
            <br /> password: 12345678
          </p>

          <p className="text-center text-muted mt-5">
            New company?{" "}
            <Link to="/register" className="text-navy font-bold">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}