import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../../components/common/PageHeader.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import Modal from "../../components/common/Modal.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import SearchFilterBar from "../../components/common/SearchFilterBar.jsx";
import ActionButtons from "../../components/common/ActionButtons.jsx";
import ConfirmModal from "../../components/common/ConfirmModal.jsx";
import PageLoader from "../../components/common/PageLoader.jsx";

import useAuthContext from "../../hooks/useAuthContext";
import { searchRows, filterRows } from "../../utils/filterUtils.js";
import { taskService } from "../../services/taskService.js";

const initialForm = {
  title: "",
  assignedTo: "",
  priority: "Medium",
  dueDate: "",
};

export default function TasksPage() {
  const { user } = useAuthContext();

  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);

  const canModify = user?.role === "admin" || user?.role === "manager";

  async function loadTasks() {
    try {
      setLoading(true);
      const data = await taskService.getAll();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    const searched = searchRows(tasks, search, [
      "title",
      "assignedTo",
      "priority",
      "status",
    ]);

    return filterRows(searched, statusFilter, "status");
  }, [tasks, search, statusFilter]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function openCreateModal() {
    setEditingItem(null);
    setForm(initialForm);
    setOpen(true);
  }

  function openEditModal(task) {
    setEditingItem(task);
    setForm({
      title: task.title || "",
      assignedTo: task.assignedTo || "",
      priority: task.priority || "Medium",
      dueDate: task.dueDate || "",
    });
    setOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      title: form.title.trim(),
      assignedTo: form.assignedTo.trim(),
      priority: form.priority,
      dueDate: form.dueDate,
    };

    try {
      if (editingItem) {
        const res = await taskService.update(editingItem.dbId, payload);

        setTasks((prev) =>
          prev.map((item) =>
            item.dbId === editingItem.dbId ? res.task : item
          )
        );

        toast.success("Task updated");
      } else {
        const res = await taskService.create(payload);
        setTasks((prev) => [res.task, ...prev]);
        toast.success("Task created");
      }

      setOpen(false);
      setEditingItem(null);
      setForm(initialForm);
    } catch (error) {
      toast.error(error.message || "Failed to save task");
    }
  }

  async function completeTask(row) {
    try {
      const res = await taskService.updateStatus(row.dbId, "Completed");

      setTasks((prev) =>
        prev.map((item) => (item.dbId === row.dbId ? res.task : item))
      );

      toast.success("Task marked as completed");
    } catch (error) {
      toast.error(error.message || "Failed to update task");
    }
  }

  async function deleteTask(row) {
    try {
      await taskService.remove(row.dbId);
      setTasks((prev) => prev.filter((item) => item.dbId !== row.dbId));
      setDeleteTarget(null);
      toast.success("Task deleted");
    } catch (error) {
      toast.error(error.message || "Failed to delete task");
    }
  }

  const columns = [
    { key: "id", label: "Task ID" },
    { key: "title", label: "Task" },
    { key: "assignedTo", label: "Assigned To" },
    { key: "priority", label: "Priority" },
    { key: "dueDate", label: "Due Date" },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: "workflow",
      label: "Workflow",
      render: (_, row) =>
        row.status === "Completed" ? (
          <span className="text-slate-500">Done</span>
        ) : (
          <button
            onClick={() => completeTask(row)}
            className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-300"
          >
            Complete
          </button>
        ),
    },
    ...(canModify
      ? [
          {
            key: "actions",
            label: "Actions",
            render: (_, row) => (
              <ActionButtons
                onEdit={() => openEditModal(row)}
                onDelete={() => setDeleteTarget(row)}
              />
            ),
          },
        ]
      : []),
  ];

  if (loading) {
    return <PageLoader text="Loading tasks..." />;
  }

  return (
    <>
      <PageHeader
        title={user?.role === "staff" ? "My Tasks" : "Staff Tasks"}
        description="Manage task assignments using Flask backend"
        action={
          canModify && (
            <button onClick={openCreateModal} className="btn-primary">
              <Plus size={18} /> Add Task
            </button>
          )
        }
      />

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterPlaceholder="All Status"
        filterOptions={["Pending", "Completed"]}
      />

      <DataTable columns={columns} data={filteredTasks} />

      {open && (
        <Modal
          title={editingItem ? "Edit Task" : "Add Task"}
          onClose={() => setOpen(false)}
        >
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <Input
              label="Task Title"
              name="title"
              value={form.title}
              onChange={handleChange}
            />

            <Input
              label="Assigned To"
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
            />

            <div>
              <label className="text-sm text-slate-300">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="input"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <Input
              label="Due Date"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
            />

            <button className="btn-primary md:col-span-2">
              {editingItem ? "Update Task" : "Save Task"}
            </button>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Task?"
          message={`Are you sure you want to delete ${deleteTarget.title}?`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => deleteTask(deleteTarget)}
        />
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