import { useEffect, useState } from "react";
import {
  Package,
  ClipboardList,
  ArrowLeftRight,
  AlertTriangle,
  Warehouse,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";

import PageHeader from "../../components/common/PageHeader.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import PageLoader from "../../components/common/PageLoader.jsx";

import { dashboardService } from "../../services/dashboardService.js";

export default function ManagerDashboard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      setLoading(true);
      const data = await dashboardService.getReports();
      setReport(data);
    } catch (error) {
      toast.error(error.message || "Failed to load manager dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <PageLoader text="Loading manager dashboard..." />;
  }

  const summary = report?.summary || {};
  const charts = report?.charts || {};
  const inventory = report?.inventory || [];

  const lowStock = inventory.filter(
    (item) => item.status === "Low Stock" || item.status === "Out of Stock"
  );

  const alertColumns = [
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
        title="Warehouse Manager Dashboard"
        description="Live warehouse analytics from Flask backend"
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard title="Inventory Items" value={summary.inventoryItems || 0} icon={Package} />
        <StatCard title="Warehouses" value={summary.warehouses || 0} icon={Warehouse} />
        <StatCard title="Stock Alerts" value={summary.stockAlerts || 0} icon={AlertTriangle} />
        <StatCard title="Reports" value="Live" icon={ClipboardList} />
      </div>

      <div className="grid xl:grid-cols-2 gap-6 mb-8">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <h2 className="text-xl font-black mb-5">Category Stock Quantity</h2>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.categoryQuantity || []}>
                <XAxis dataKey="category" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="quantity" fill="#facc15" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-black mb-4">Low Stock Alerts</h2>
          <DataTable columns={alertColumns} data={lowStock} pageSize={5} />
        </div>
      </div>
    </div>
  );
}