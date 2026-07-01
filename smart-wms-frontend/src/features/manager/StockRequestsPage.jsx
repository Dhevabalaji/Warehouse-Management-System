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
import { stockRequestService } from "../../services/stockRequestService.js";

const initialForm = {
  sku: "",
  itemName: "",
  quantity: "",
};

export default function StockRequestsPage() {
  const { user } = useAuthContext();

  const [requests, setRequests] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);

  const canCreate = user?.role === "staff" || user?.role === "manager";
  const canApprove = user?.role === "admin" || user?.role === "manager";

  async function loadRequests() {
    try {
      setLoading(true);
      const data = await stockRequestService.getAll();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Failed to load stock requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    const searched = searchRows(requests, search, [
      "id",
      "sku",
      "itemName",
      "requestedBy",
      "status",
    ]);

    return filterRows(searched, statusFilter, "status");
  }, [requests, search, statusFilter]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function openCreateModal() {
    setForm(initialForm);
    setOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      sku: form.sku.trim(),
      itemName: form.itemName.trim(),
      quantity: Number(form.quantity),
    };

    try {
      const res = await stockRequestService.create(payload);
      setRequests((prev) => [res.request, ...prev]);
      setOpen(false);
      setForm(initialForm);
      toast.success("Stock request created");
    } catch (error) {
      toast.error(error.message || "Failed to create stock request");
    }
  }

  async function updateStatus(row, status) {
    try {
      const res = await stockRequestService.updateStatus(row.dbId, status);

      setRequests((prev) =>
        prev.map((item) => (item.dbId === row.dbId ? res.request : item))
      );

      toast.success(`Request ${status}`);
    } catch (error) {
      toast.error(error.message || "Failed to update request");
    }
  }

  async function deleteRequest(row) {
    try {
      await stockRequestService.remove(row.dbId);
      setRequests((prev) => prev.filter((item) => item.dbId !== row.dbId));
      setDeleteTarget(null);
      toast.success("Stock request deleted");
    } catch (error) {
      toast.error(error.message || "Failed to delete request");
    }
  }

  const columns = [
    { key: "id", label: "Request ID" },
    { key: "sku", label: "SKU" },
    { key: "itemName", label: "Item" },
    { key: "quantity", label: "Qty" },
    { key: "requestedBy", label: "Requested By" },
    { key: "date", label: "Date" },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
    ...(canApprove
      ? [
          {
            key: "workflow",
            label: "Workflow",
            render: (_, row) => (
              <div className="flex gap-2">
                {row.status === "Pending" ? (
                  <>
                    <button
                      onClick={() => updateStatus(row, "Approved")}
                      className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-300"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(row, "Rejected")}
                      className="px-3 py-2 rounded-lg bg-red-500/10 text-red-300"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="text-slate-500">Closed</span>
                )}
              </div>
            ),
          },
          {
            key: "actions",
            label: "Actions",
            render: (_, row) => (
              <ActionButtons
                onEdit={null}
                onDelete={() => setDeleteTarget(row)}
              />
            ),
          },
        ]
      : []),
  ];

  if (loading) {
    return <PageLoader text="Loading stock requests..." />;
  }

  return (
    <>
      <PageHeader
        title="Stock Requests"
        description="Create and approve stock requests from backend"
        action={
          canCreate && (
            <button onClick={openCreateModal} className="btn-primary">
              <Plus size={18} /> New Request
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
        filterOptions={["Pending", "Approved", "Rejected"]}
      />

      <DataTable columns={columns} data={filteredRequests} />

      {open && (
        <Modal title="Create Stock Request" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <Input
              label="SKU"
              name="sku"
              value={form.sku}
              onChange={handleChange}
            />

            <Input
              label="Item Name"
              name="itemName"
              value={form.itemName}
              onChange={handleChange}
            />

            <Input
              label="Quantity"
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
            />

            <button className="btn-primary md:col-span-2">
              Submit Request
            </button>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Stock Request?"
          message={`Are you sure you want to delete ${deleteTarget.id}?`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => deleteRequest(deleteTarget)}
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