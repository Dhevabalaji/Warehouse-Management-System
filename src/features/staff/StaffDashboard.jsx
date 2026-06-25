import {
  ClipboardList,
  PackagePlus,
  PackageMinus,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getStorage } from "../../utils/storageService";
import useAuthContext from "../../hooks/useAuthContext";

export default function StaffDashboard() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const tasks = getStorage("wms_tasks", []).filter(
    (task) =>
      task.companyCode === user?.companyCode &&
      task.assignedTo === user?.email
  );

  const movements = getStorage("wms_stock_movements", []).filter(
    (movement) => movement.companyCode === user?.companyCode
  );

  const myMovements = movements.filter(
    (movement) => movement.staffName === user?.name
  );

  const stockInCount = myMovements.filter(
    (movement) => movement.type === "Stock In"
  ).length;

  const stockOutCount = myMovements.filter(
    (movement) => movement.type === "Stock Out"
  ).length;

  const pendingTasks = tasks.filter((task) => task.status !== "Completed");

  const stats = [
    { title: "Assigned Tasks", value: tasks.length, icon: ClipboardList },
    { title: "Pending Tasks", value: pendingTasks.length, icon: Truck },
    { title: "Stock In Done", value: stockInCount, icon: PackagePlus },
    { title: "Stock Out Done", value: stockOutCount, icon: PackageMinus },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Staff Dashboard</h1>
      <p className="text-muted mt-1">Daily warehouse execution tasks</p>

      <div className="grid md:grid-cols-4 gap-6 mt-8">
        {stats.map(({ title, value, icon: Icon }) => (
          <div key={title} className="card p-6">
            <Icon className="text-green mb-4" size={30} />
            <h3 className="text-3xl font-bold text-navy">{value}</h3>
            <p className="text-muted">{title}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-navy">Pending Tasks</h2>

          <div className="mt-5 space-y-4">
            {pendingTasks.length === 0 ? (
              <p className="text-muted">No pending tasks.</p>
            ) : (
              pendingTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="p-4 bg-slate-100 rounded-xl">
                  <p className="font-semibold">{task.title}</p>
                  <p className="text-sm text-muted">
                    Priority: {task.priority} • Status: {task.status}
                  </p>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => navigate("/staff/tasks")}
            className="btn-primary mt-5"
          >
            View All Tasks
          </button>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-navy">Quick Actions</h2>

          <div className="grid grid-cols-2 gap-4 mt-5">
            <button
              onClick={() => navigate("/staff/stock-in")}
              className="btn-primary"
            >
              Stock In
            </button>

            <button
              onClick={() => navigate("/staff/stock-out")}
              className="btn-primary"
            >
              Stock Out
            </button>

            <button
              onClick={() => navigate("/staff/scanner")}
              className="btn-primary"
            >
              Scan Barcode
            </button>

            <button
              onClick={() => navigate("/staff/damaged-goods")}
              className="btn-primary"
            >
              Report Damage
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}