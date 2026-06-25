import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { addStorageItem, getStorage } from "../../utils/storageService";
import useAuthContext from "../../hooks/useAuthContext";
import { demoUsers } from "../../data/mockData";

export default function AssignTaskPage() {
  const { user } = useAuthContext();

  const customUsers = getStorage("wms_custom_users", []);
  const staffUsers = [...demoUsers, ...customUsers].filter(
    (u) => u.companyCode === user?.companyCode && u.role === "staff"
  );

  const [task, setTask] = useState({
    title: "",
    priority: "",
    assignedTo: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    addStorageItem("wms_tasks", {
      id: `TASK-${Date.now()}`,
      companyCode: user?.companyCode,
      tenantId: user?.tenantId,
      createdBy: user?.name,
      status: "Pending",
      createdAt: new Date().toLocaleString(),
      ...task,
    });

    alert("Task assigned successfully");

    setTask({
      title: "",
      priority: "",
      assignedTo: "",
    });
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Assign Task</h1>
      <p className="text-muted mt-1">Assign daily warehouse tasks to staff</p>

      <form onSubmit={handleSubmit} className="card p-6 mt-8 max-w-3xl space-y-4">
        <input
          className="input"
          placeholder="Task Title"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          required
        />

        <select
          className="input"
          value={task.assignedTo}
          onChange={(e) => setTask({ ...task, assignedTo: e.target.value })}
          required
        >
          <option value="">Select Staff</option>
          {staffUsers.map((staff) => (
            <option key={staff.id} value={staff.email}>
              {staff.name} - {staff.email}
            </option>
          ))}
        </select>

        <select
          className="input"
          value={task.priority}
          onChange={(e) => setTask({ ...task, priority: e.target.value })}
          required
        >
          <option value="">Select Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <button className="btn-primary">Assign Task</button>
      </form>
    </DashboardLayout>
  );
}