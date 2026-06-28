import { Package, ClipboardList, ArrowLeftRight, AlertTriangle } from "lucide-react";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import useAuthContext from "../../hooks/useAuthContext";
import { getStorage } from "../../utils/storageService.js";

export default function StaffDashboard() {
  const { user } = useAuthContext();

  const inventory = getStorage("wms_inventory", []).filter(
    (item) => item.companyCode === user.companyCode
  );

  const movements = getStorage("wms_stock_movements", []).filter(
    (item) => item.companyCode === user.companyCode && item.createdBy === user.name
  );

  const tasks = getStorage("wms_tasks", []).filter(
    (item) => item.companyCode === user.companyCode && item.assignedTo === user.name
  );

  const damaged = getStorage("wms_damaged_goods", []).filter(
    (item) => item.companyCode === user.companyCode && item.reportedBy === user.name
  );

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
        description="View assigned tasks and update stock operations"
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard title="Inventory Items" value={inventory.length} icon={Package} />
        <StatCard title="Pending Tasks" value={pendingTasks.length} icon={ClipboardList} />
        <StatCard title="My Movements" value={movements.length} icon={ArrowLeftRight} />
        <StatCard title="Damaged Reports" value={damaged.length} icon={AlertTriangle} />
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