import DashboardLayout from "../../layouts/DashboardLayout";
import { getStorage, setStorage } from "../../utils/storageService";
import useAuthContext from "../../hooks/useAuthContext";

const defaultTasks = [
  {
    id: "TASK-001",
    title: "Receive PO-2024-0089",
    priority: "High",
    status: "Pending",
    assignedTo: "staff@wms.io",
    companyCode: "WMSPRO",
  },
  {
    id: "TASK-002",
    title: "Pick items for Dispatch DSP-1204",
    priority: "Medium",
    status: "Pending",
    assignedTo: "staff@wms.io",
    companyCode: "WMSPRO",
  },
];

export default function AssignedTasksPage() {
  const { user } = useAuthContext();

  const savedTasks = getStorage("wms_tasks", []);
  const tasks = [...defaultTasks, ...savedTasks].filter(
    (task) =>
      task.companyCode === user?.companyCode &&
      task.assignedTo === user?.email
  );

  const completeTask = (id) => {
    const updated = savedTasks.map((task) =>
      task.id === id ? { ...task, status: "Completed" } : task
    );

    setStorage("wms_tasks", updated);
    window.location.reload();
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Assigned Tasks</h1>
      <p className="text-muted mt-1">View and complete your daily tasks</p>

      <div className="card p-6 mt-8 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-muted border-b">
              <th className="py-3">Task ID</th>
              <th>Task</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b last:border-0">
                <td className="py-4 font-bold text-navy">{task.id}</td>
                <td>{task.title}</td>
                <td>{task.priority}</td>
                <td>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-navy font-semibold">
                    {task.status}
                  </span>
                </td>
                <td>
                  {task.status !== "Completed" && (
                    <button
                      onClick={() => completeTask(task.id)}
                      className="btn-primary text-sm"
                    >
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}