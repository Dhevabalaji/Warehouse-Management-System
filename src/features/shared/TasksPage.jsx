import { useState } from "react";
import { Plus } from "lucide-react";
import PageHeader from "../../components/common/PageHeader.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import Modal from "../../components/common/Modal.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import useAuthContext from "../../hooks/useAuthContext";
import { getStorage, setStorage } from "../../utils/storageService.js";

export default function TasksPage() {
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);

  const allTasks = getStorage("wms_tasks", []);

  const visibleTasks =
    user.role === "manager"
      ? allTasks.filter((item) => item.companyCode === user.companyCode)
      : allTasks.filter(
          (item) =>
            item.companyCode === user.companyCode &&
            item.assignedTo === user.name
        );

  const [tasks, setTasks] = useState(visibleTasks);

  const [form, setForm] = useState({
    title: "",
    assignedTo: "",
    priority: "Medium",
    dueDate: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function addTask(e) {
    e.preventDefault();

    const task = {
      id: `TASK-${Date.now()}`,
      ...form,
      status: "Pending",
      companyCode: user.companyCode,
      tenantId: user.tenantId,
      createdBy: user.name,
    };

    const all = getStorage("wms_tasks", []);
    setStorage("wms_tasks", [...all, task]);

    setTasks([...tasks, task]);
    setOpen(false);
    setForm({
      title: "",
      assignedTo: "",
      priority: "Medium",
      dueDate: "",
    });
  }

  function completeTask(id) {
    const all = getStorage("wms_tasks", []);

    const updatedAll = all.map((task) =>
      task.id === id ? { ...task, status: "Completed" } : task
    );

    const updatedLocal = tasks.map((task) =>
      task.id === id ? { ...task, status: "Completed" } : task
    );

    setStorage("wms_tasks", updatedAll);
    setTasks(updatedLocal);
  }

  const columns = [
    { key: "title", label: "Task" },
    { key: "assignedTo", label: "Assigned To" },
    { key: "priority", label: "Priority" },
    { key: "dueDate", label: "Due Date" },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    {
      key: "action",
      label: "Action",
      render: (_, row) =>
        row.status !== "Completed" ? (
          <button
            onClick={() => completeTask(row.id)}
            className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-300"
          >
            Complete
          </button>
        ) : (
          <span className="text-slate-500">Done</span>
        ),
    },
  ];

  return (
    <>
      <PageHeader
        title={user.role === "manager" ? "Staff Tasks" : "My Tasks"}
        description="Manage warehouse operational tasks"
        action={
          user.role === "manager" && (
            <button onClick={() => setOpen(true)} className="btn-primary">
              <Plus size={18} /> Assign Task
            </button>
          )
        }
      />

      <DataTable columns={columns} data={tasks} />

      {open && (
        <Modal title="Assign Task" onClose={() => setOpen(false)}>
          <form onSubmit={addTask} className="grid md:grid-cols-2 gap-4">
            <Input label="Task Title" name="title" value={form.title} onChange={handleChange} />
            <Input label="Assigned To" name="assignedTo" value={form.assignedTo} onChange={handleChange} />

            <div>
              <label className="text-sm text-slate-300">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="input"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <Input label="Due Date" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />

            <button className="btn-primary md:col-span-2">Assign Task</button>
          </form>
        </Modal>
      )}
    </>
  );
}

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-slate-300">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="input"
      />
    </div>
  );
}