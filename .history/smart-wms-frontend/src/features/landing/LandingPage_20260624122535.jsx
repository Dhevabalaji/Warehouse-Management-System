import { Link } from "react-router-dom";
import { Boxes, Building2, ShieldCheck, Users, BarChart3, ScanLine } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      <nav className="bg-navy text-white px-10 py-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold">WMS Pro</h1>
        <div className="flex gap-4">
          <Link to="/login" className="hover:text-green">Login</Link>
          <Link to="/register" className="bg-green px-5 py-2 rounded-xl font-semibold">
            Register
          </Link>
        </div>
      </nav>

      <section className="px-10 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-green font-bold mb-3">Multi-Tenant Warehouse Platform</p>
          <h2 className="text-5xl font-bold text-navy leading-tight">
            Manage warehouses, inventory, staff and stock movements in one system.
          </h2>
          <p className="text-muted mt-6 text-lg">
            Built for companies that need role-based warehouse operations with Admin,
            Manager and Staff dashboards.
          </p>

          <div className="flex gap-4 mt-8">
            <Link to="/register" className="btn-primary">Get Started</Link>
            <Link to="/login" className="px-5 py-2 rounded-xl border border-navy font-semibold">
              Login
            </Link>
          </div>
        </div>

        <div className="card p-8">
          <div className="grid grid-cols-2 gap-4">
            {[
              ["8,420", "Total SKUs"],
              ["1,240", "Daily Movements"],
              ["99.7%", "Accuracy"],
              ["24/7", "Monitoring"],
            ].map((item) => (
              <div key={item[1]} className="bg-slate-100 p-6 rounded-2xl">
                <h3 className="text-3xl font-bold text-navy">{item[0]}</h3>
                <p className="text-muted">{item[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-10 py-14">
        <h2 className="text-3xl font-bold text-center text-navy">Core Features</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {[
            [Building2, "Multi-Tenant Companies", "Each company has isolated warehouse data."],
            [Users, "Role-Based Access", "Admin, Manager and Staff see only their modules."],
            [Boxes, "Inventory Control", "Track stock in, stock out and low stock."],
            [ScanLine, "Barcode Scanner", "Staff can scan and search products quickly."],
            [BarChart3, "Reports", "Managers and admins can view warehouse analytics."],
            [ShieldCheck, "Secure Operations", "Protected routes and role-based control."],
          ].map(([Icon, title, desc]) => (
            <div className="card p-6" key={title}>
              <Icon className="text-green mb-4" size={34} />
              <h3 className="font-bold text-xl text-navy">{title}</h3>
              <p className="text-muted mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}