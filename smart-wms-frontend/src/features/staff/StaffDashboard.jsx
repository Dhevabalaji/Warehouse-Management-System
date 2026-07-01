import { useEffect, useState } from "react";
import {
  Package,
  ClipboardList,
  ArrowLeftRight,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../../components/common/PageHeader.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import PageLoader from "../../components/common/PageLoader.jsx";

import { dashboardService } from "../../services/dashboardService.js";
import { taskService } from "../../services/taskService.js";
import { stockMovementService } from "../../services/stockMovementService.js";
import { damagedGoodsService } from "../../services/damagedGoodsService.js";

export default function StaffDashboard() {
  const [report, setReport] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [movements, setMovements] = useState([]);
  const [damaged, setDamaged] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      setLoading(true);

      const [reportData, taskData, movementData, damagedData] =
        await Promise.all([
          dashboardService.getReports(),
          taskService.getAll(),
          stockMovementService.getAll(),
          damagedGoodsService.getAll(),
        ]);

      setReport(reportData);
      setTasks(Array.isArray(taskData) ? taskData : []);
      setMovements(Array.isArray(movementData) ? movementData : []);
      setDamaged(Array.isArray(damagedData) ? damagedData : []);
    } catch (error) {
      toast.error(error.message || "Failed to load staff dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <PageLoader text="Loading staff dashboard..." />;
  }

  const inventory = report?.inventory || [];
  const pendingTasks = tasks.filter((item) => item.status !== "Completed");

  const taskColumns = [
    { key: "title", label: "Task" },
    { key: "priority", label: "Priority" },
    { key: "dueDate", label: "Due Date" },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const movementColumns = [
    { key: "type", label: "Type" },
    { key: "sku", label: "SKU" },
    { key: "itemName", label: "Item" },
    { key: "quantity", label: "Qty" },
    { key: "date", label: "Date" },
  ];

  return (
    <div>
      <PageHeader
        title="Staff Dashboard"
        description="Assigned tasks and stock work from backend APIs"
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard title="Inventory Items" value={inventory.length} icon={Package} />
        <StatCard title="Pending Tasks" value={pendingTasks.length} icon={ClipboardList} />
        <StatCard title="My Movements" value={movements.length} icon={ArrowLeftRight} />
        <StatCard title="Damage Reports" value={damaged.length} icon={AlertTriangle} />
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-black mb-4">My Tasks</h2>
          <DataTable columns={taskColumns} data={tasks} pageSize={5} />
        </div>

        <div>
          <h2 className="text-xl font-black mb-4">Recent Stock Movements</h2>
          <DataTable columns={movementColumns} data={movements} pageSize={5} />
        </div>
      </div>
    </div>
  );
}