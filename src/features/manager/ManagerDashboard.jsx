import { Package, ClipboardList, ArrowLeftRight, AlertTriangle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import useAuthContext from "../../hooks/useAuthContext";
import { getStorage } from "../../utils/storageService.js";

export default function ManagerDashboard() {
  const { user } = useAuthContext();

  const inventory = getStorage("wms_inventory", []).filter(
    (item) => item.companyCode === user.companyCode
  );

  const requests = getStorage("wms_stock_requests", []).filter(
    (item) => item.companyCode === user.companyCode
  );

  const transfers = getStorage("wms_inventory_transfers", []).filter(
    (item) => item.companyCode === user.companyCode
  );

  const damaged = getStorage("wms_damaged_goods", []).filter(
    (item) => item.companyCode === user.companyCode
  );

  const tasks = getStorage("wms_tasks", []).filter(
    (item) => item.companyCode === user.companyCode
  );

  const lowStock = inventory.filter(
    (item) => item.status === "Low Stock" || item.status === "Out of Stock"
  );

  const categoryChart = Object.values(
    inventory.reduce((acc, item) => {
      const category = item.category || "Other";

      if (!acc[category]) {
        acc[category] = {
          category,
          quantity: 0,
        };
      }

      acc[category].quantity += Number(item.qty || 0);

      return acc;
    }, {})
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

  const taskColumns = [
    { key: "title", label: "Task" },
    { key: "assignedTo", label: "Assigned To" },
    { key: "priority", label: "Priority" },
    { key: "dueDate", label: "Due Date" },
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
        description="Monitor stock requests, transfers, tasks, and warehouse alerts"
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
        <StatCard title="Inventory" value={inventory.length} icon={Package} />
        <StatCard title="Requests" value={requests.length} icon={ClipboardList} />
        <StatCard title="Transfers" value={transfers.length} icon={ArrowLeftRight} />
        <StatCard title="Damaged" value={damaged.length} icon={AlertTriangle} />
        <StatCard title="Tasks" value={tasks.length} icon={ClipboardList} />
      </div>

      <div className="grid xl:grid-cols-2 gap-6 mb-8">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <h2 className="text-xl font-black mb-5">Category Stock Quantity</h2>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChart}>
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

      <h2 className="text-xl font-black mb-4">Staff Tasks</h2>
      <DataTable columns={taskColumns} data={tasks.slice(0, 8)} pageSize={5} />
    </div>
  );
}