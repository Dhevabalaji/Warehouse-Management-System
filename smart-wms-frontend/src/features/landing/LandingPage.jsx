import { Link } from "react-router-dom";
import { Warehouse, ShieldCheck, Users, BarChart3 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-content-bg">
      <nav className="bg-sidebar-bg text-white px-8 py-5 flex justify-between">
        <h1 className="font-bold text-xl">WMS Pro</h1>
        <div className="flex gap-4">
          <Link to="/login">Login</Link>
          <Link to="/register" className="text-primary">
            Register
          </Link>
        </div>
      </nav>

      <section className="p-10 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-primary font-bold">Smart Warehouse Management</p>
          <h2 className="text-5xl font-bold text-slate-900 mt-3">
            Manage inventory, warehouses, users and stock movement.
          </h2>
          <p className="text-slate-500 mt-5">
            Multi-tenant WMS with Admin, Manager and Staff dashboards.
          </p>

          <div className="flex gap-4 mt-8">
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn-outline">
              Login
            </Link>
          </div>
        </div>

        <div className="content-card p-8 grid grid-cols-2 gap-4">
          {[
            [Warehouse, "Warehouses"],
            [Users, "Role Access"],
            [ShieldCheck, "Secure Flow"],
            [BarChart3, "Reports"],
          ].map(([Icon, title]) => (
            <div key={title} className="p-5 bg-slate-50 rounded-xl">
              <Icon className="text-primary mb-3" />
              <h3 className="font-bold">{title}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}