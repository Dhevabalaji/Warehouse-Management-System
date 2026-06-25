import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { registerTenant } = useAuthContext();

  const [form, setForm] = useState({
    companyName: "",
    companyCode: "",
    companyEmail: "",
    adminName: "",
    adminEmail: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    registerTenant(form);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="card w-full max-w-5xl grid md:grid-cols-2 overflow-hidden">
        <div className="bg-navy text-white p-10">
          <h1 className="text-3xl font-bold">Create Company Account</h1>
          <p className="text-blue-100 mt-4">
            Register your company and create the first admin account.
          </p>

          <div className="mt-10 space-y-5">
            <p>✓ Tenant company setup</p>
            <p>✓ Admin account creation</p>
            <p>✓ Role-based dashboards</p>
            <p>✓ Isolated company warehouse data</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10">
          <h2 className="text-2xl font-bold text-navy mb-6">Register</h2>

          {error && <p className="bg-red-100 text-danger p-3 rounded-xl mb-4">{error}</p>}

          <div className="grid md:grid-cols-2 gap-4">
            <input className="input" name="companyName" placeholder="Company Name" onChange={handleChange} required />
            <input className="input" name="companyCode" placeholder="Company Code" onChange={handleChange} required />
            <input className="input" name="companyEmail" placeholder="Company Email" onChange={handleChange} required />
            <input className="input" name="adminName" placeholder="Admin Full Name" onChange={handleChange} required />
            <input className="input" name="adminEmail" placeholder="Admin Email" onChange={handleChange} required />
            <input className="input" name="phone" placeholder="Phone Number" onChange={handleChange} required />
            <input className="input" name="password" type="password" placeholder="Password" onChange={handleChange} required />
            <input className="input" name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required />
          </div>

          <textarea
            className="input mt-4"
            name="address"
            placeholder="Company Address"
            rows="3"
            onChange={handleChange}
            required
          />

          <button className="btn-primary w-full mt-6">Create Account</button>

          <p className="text-center text-muted mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-navy font-bold">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}