import {
  Warehouse,
  Package,
  Users,
  ClipboardList,
  AlertTriangle,
  IndianRupee,
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
import useAuthContext from "../../hooks/useAuthContext";
import { getStorage } from "../../utils/storageService.js";

export default function AdminDashboard() {
  const { user } = useAuthContext();

  const inventory = getStorage("wms_inventory", []).filter(
    (item) => item.companyCode === user.companyCode
  );

  const warehouses = getStorage("wms_warehouses", []).filter(
    (item) => item.companyCode === user.companyCode
  );

  const suppliers = getStorage("wms_suppliers", []).filter(
    (item) => item.companyCode === user.companyCode
  );

  const purchaseOrders = getStorage("wms_purchase_orders", []).filter(
    (item) => item.companyCode === user.companyCode
  );

  const customUsers = getStorage("wms_custom_users", []).filter(
    (item) => item.companyCode === user.companyCode
  );

  const logs = getStorage("wms_activity_logs", [])
    .filter((item) => item.companyCode === user.companyCode)
    .slice(0, 5);

  const lowStock = inventory.filter(
    (item) => item.status === "Low Stock" || item.status === "Out of Stock"
  );

  const totalValue = inventory.reduce(
    (sum, item) => sum + Number(item.qty) * Number(item.price),
    0
  );

  const stockChart = [
    {
      name: "In Stock",
      value: inventory.filter((item) => item.status === "In Stock").length,
    },
    {
      name: "Low Stock",
      value: inventory.filter((item) => item.status === "Low Stock").length,
    },
    {
      name: "Out of Stock",
      value: inventory.filter((item) => item.status === "Out of Stock").length,
    },
  ];

  const warehouseChart = warehouses.map((warehouse) => ({
    name: warehouse.name,
    capacity: Number(warehouse.capacity || 0),
  }));

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
        description="Complete overview of warehouse operations"
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-6 gap-5 mb-8">
        <StatCard title="Warehouses" value={warehouses.length} icon={Warehouse} />
        <StatCard title="Inventory" value={inventory.length} icon={Package} />
        <StatCard title="Users" value={customUsers.length + 3} icon={Users} />
        <StatCard title="Suppliers" value={suppliers.length} icon={Users} />
        <StatCard title="Orders" value={purchaseOrders.length} icon={ClipboardList} />
        <StatCard
          title="Value"
          value={`₹${totalValue.toLocaleString("en-IN")}`}
          icon={IndianRupee}
        />
      </div>

      <div className="grid xl:grid-cols-2 gap-6 mb-8">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <h2 className="text-xl font-black mb-5">Warehouse Capacity</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={warehouseChart}>
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
                  data={stockChart}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label
                >
                  {stockChart.map((_, index) => (
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

          <DataTable columns={lowStockColumns} data={lowStock} pageSize={5} />
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <h2 className="text-xl font-black mb-5">Recent Activity</h2>

          <div className="space-y-4">
            {logs.length === 0 ? (
              <p className="text-slate-400 text-sm">No activity yet</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="border-b border-white/10 pb-3">
                  <h3 className="font-semibold">{log.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {log.description}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    {new Date(log.createdAt).toLocaleString()}
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