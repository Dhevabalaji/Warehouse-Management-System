import { Link } from "react-router-dom";
import {
  Boxes,
  Building2,
  ShieldCheck,
  BarChart3,
  Warehouse,
  Users,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-yellow-400 text-slate-950 flex items-center justify-center">
            <Boxes size={26} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Smart WMS</h1>
            <p className="text-xs text-slate-400">Multi-Tenant Warehouse System</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-5 py-2 rounded-xl border border-white/15 hover:bg-white/10"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 rounded-xl bg-yellow-400 text-slate-950 font-semibold hover:bg-yellow-300"
          >
            Register Company
          </Link>
        </div>
      </nav>

      <section className="px-8 py-20 max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <p className="inline-flex px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-sm mb-6">
            Enterprise Warehouse Management Platform
          </p>

          <h2 className="text-5xl lg:text-6xl font-black leading-tight">
            Manage multiple warehouses with one powerful system.
          </h2>

          <p className="text-slate-300 text-lg mt-6 max-w-xl">
            Track inventory, suppliers, stock movements, purchase orders,
            damaged goods, warehouse users, and role-based dashboards in one
            clean system.
          </p>

          <div className="flex gap-4 mt-8">
            <Link
              to="/register"
              className="px-7 py-3 rounded-xl bg-yellow-400 text-slate-950 font-bold hover:bg-yellow-300"
            >
              Start Company Setup
            </Link>

            <Link
              to="/login"
              className="px-7 py-3 rounded-xl border border-white/15 hover:bg-white/10"
            >
              Login Dashboard
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
          <div className="grid grid-cols-2 gap-4">
            <Card icon={Building2} title="Tenants" value="Multi Company" />
            <Card icon={Warehouse} title="Warehouses" value="Live Control" />
            <Card icon={Users} title="Roles" value="Admin / Manager / Staff" />
            <Card icon={BarChart3} title="Reports" value="Inventory Insights" />
          </div>

          <div className="mt-5 rounded-2xl bg-slate-900 border border-white/10 p-5">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="text-yellow-400" />
              <h3 className="font-bold">Tenant-Safe Access</h3>
            </div>
            <p className="text-slate-400 text-sm">
              Each company sees only its own warehouses, inventory, users, and
              reports. No cross-company data leakage.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Card({ icon: Icon, title, value }) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-white/10 p-5">
      <Icon className="text-yellow-400 mb-4" />
      <p className="text-slate-400 text-sm">{title}</p>
      <h3 className="font-bold mt-1">{value}</h3>
    </div>
  );
}