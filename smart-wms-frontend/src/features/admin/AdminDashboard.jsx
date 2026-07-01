import { useEffect, useState } from "react";
import {
  Warehouse,
  Package,
  Users,
  ClipboardList,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import PageHeader from "../../components/common/PageHeader.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import PageLoader from "../../components/common/PageLoader.jsx";
import { dashboardService } from "../../services/dashboardService.js";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");
      const data = await dashboardService.getAdminDashboard();
      setDashboard(data);
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <PageLoader text="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div>
        <PageHeader title="Company Admin Dashboard" description="Complete overview of warehouse operations" />
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
          {error}
        </div>
      </div>
    );
  }

  const summary = dashboard?.summary || {};
  const charts = dashboard?.charts || {};
  const lowStockItems = dashboard?.lowStockItems || [];
  const recentActivity = dashboard?.recentActivity || [];

  const lowStockColumns = [
    { key: "sku", label: "SKU" },
    { key: "name", label: "Product" },
    { key: "warehouse", label: "Warehouse" },
    { key: "qty", label: "Qty" },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Company Admin Dashboard"
        description="Live overview from Flask + MySQL + MongoDB"
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-6 gap-5 mb-8">
        <StatCard title="Warehouses" value={summary.warehouses || 0} icon={Warehouse} />
        <StatCard title="Inventory" value={summary.inventory || 0} icon={Package} />
        <StatCard title="Users" value={summary.users || 0} icon={Users} />
        <StatCard title="Suppliers" value={summary.suppliers || 0} icon={Users} />
        <StatCard title="Orders" value={summary.purchaseOrders || 0} icon={ClipboardList} />
        <StatCard title="Low Stock" value={summary.lowStock || 0} icon={AlertTriangle} />
      </div>

      <div className="grid xl:grid-cols-2 gap-6 mb-8">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <h2 className="text-xl font-black mb-5">Warehouse Capacity</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.warehouseCapacity || []}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="capacity" fill="#facc15" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <h2 className="text-xl font-black mb-5">Stock Health</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.stockStatus || []}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label
                >
                  {(charts.stockStatus || []).map((_, index) => (
                    <Cell
                      key={index}
                      fill={["#22c55e", "#facc15", "#ef4444"][index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-yellow-400" />
            <h2 className="text-xl font-black">Low Stock Alerts</h2>
          </div>

          <DataTable columns={lowStockColumns} data={lowStockItems} pageSize={5} />
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <h2 className="text-xl font-black mb-5">Recent Activity</h2>

          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-slate-400 text-sm">No activity yet</p>
            ) : (
              recentActivity.map((log) => (
                <div key={log._id || log.id} className="border-b border-white/10 pb-3">
                  <h3 className="font-semibold">{log.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{log.description}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    {log.createdAt ? new Date(log.createdAt).toLocaleString() : "-"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}