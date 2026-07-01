import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
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
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import {
  Package,
  AlertTriangle,
  IndianRupee,
  Warehouse,
  Download,
} from "lucide-react";

import PageHeader from "../../components/common/PageHeader.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import PageLoader from "../../components/common/PageLoader.jsx";
import { dashboardService } from "../../services/dashboardService.js";

export default function ReportsPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("");

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadReports() {
    try {
      setLoading(true);
      const data = await dashboardService.getReports();
      setReport(data);
    } catch (error) {
      toast.error(error.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  const inventory = report?.inventory || [];
  const summary = report?.summary || {};
  const charts = report?.charts || {};

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesStatus = statusFilter ? item.status === statusFilter : true;
      const matchesWarehouse = warehouseFilter
        ? item.warehouse === warehouseFilter
        : true;

      return matchesStatus && matchesWarehouse;
    });
  }, [inventory, statusFilter, warehouseFilter]);

  const warehouseOptions = [...new Set(inventory.map((item) => item.warehouse).filter(Boolean))];

  function exportCSV() {
    if (filteredInventory.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = [
      "SKU",
      "Product",
      "Category",
      "Warehouse",
      "Quantity",
      "Minimum Quantity",
      "Price",
      "Status",
    ];

    const rows = filteredInventory.map((item) => [
      item.sku,
      item.name,
      item.category,
      item.warehouse,
      item.qty,
      item.minQty,
      item.price,
      item.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => `"${value ?? ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "inventory-report.csv";
    link.click();

    URL.revokeObjectURL(url);
    toast.success("Report exported");
  }

  const columns = [
    { key: "sku", label: "SKU" },
    { key: "name", label: "Product" },
    { key: "category", label: "Category" },
    { key: "warehouse", label: "Warehouse" },
    { key: "qty", label: "Qty" },
    {
      key: "price",
      label: "Price",
      render: (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`,
    },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  if (loading) {
    return <PageLoader text="Loading reports..." />;
  }

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Inventory value, warehouse performance, purchase trends, and export reports from backend"
        action={
          <button onClick={exportCSV} className="btn-primary">
            <Download size={18} />
            Export CSV
          </button>
        }
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard title="Inventory Items" value={summary.inventoryItems || 0} icon={Package} />
        <StatCard title="Warehouses" value={summary.warehouses || 0} icon={Warehouse} />
        <StatCard title="Stock Alerts" value={summary.stockAlerts || 0} icon={AlertTriangle} />
        <StatCard
          title="Inventory Value"
          value={`₹${Number(summary.inventoryValue || 0).toLocaleString("en-IN")}`}
          icon={IndianRupee}
        />
      </div>

      <div className="grid xl:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Warehouse Capacity">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.warehouseCapacity || []}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="capacity" fill="#facc15" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Stock Status">
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
        </ChartCard>

        <ChartCard title="Purchase Order Status">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={charts.purchaseOrderStatus || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="status" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#facc15" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Inventory Value by Warehouse">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.inventoryValueByWarehouse || []}>
              <XAxis dataKey="warehouse" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="value" fill="#facc15" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mb-5">
        <h2 className="text-xl font-black mb-5">Report Filters</h2>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm text-slate-300">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-300">Warehouse</label>
            <select
              value={warehouseFilter}
              onChange={(e) => setWarehouseFilter(e.target.value)}
              className="input"
            >
              <option value="">All Warehouses</option>
              {warehouseOptions.map((warehouse) => (
                <option key={warehouse} value={warehouse}>
                  {warehouse}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={filteredInventory} />
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
      <h2 className="text-xl font-black mb-5">{title}</h2>
      <div className="h-80">{children}</div>
    </div>
  );
}