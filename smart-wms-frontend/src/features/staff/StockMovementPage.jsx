import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../../components/common/PageHeader.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import Modal from "../../components/common/Modal.jsx";
import SearchFilterBar from "../../components/common/SearchFilterBar.jsx";
import PageLoader from "../../components/common/PageLoader.jsx";

import { searchRows } from "../../utils/filterUtils.js";
import { stockMovementService } from "../../services/stockMovementService.js";

const initialForm = {
  type: "Stock In",
  sku: "",
  itemName: "",
  quantity: "",
  warehouse: "",
  remarks: "",
};

export default function StockMovementPage() {
  const [movements, setMovements] = useState([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);

  async function loadMovements() {
    try {
      setLoading(true);
      const data = await stockMovementService.getAll();
      setMovements(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Failed to load stock movements");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMovements();
  }, []);

  const filteredMovements = useMemo(() => {
    return searchRows(movements, search, [
      "id",
      "type",
      "sku",
      "itemName",
      "warehouse",
      "createdBy",
    ]);
  }, [movements, search]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      type: form.type,
      sku: form.sku.trim(),
      itemName: form.itemName.trim(),
      quantity: Number(form.quantity),
      warehouse: form.warehouse.trim(),
      remarks: form.remarks.trim(),
    };

    try {
      const res = await stockMovementService.create(payload);
      setMovements((prev) => [res.movement, ...prev]);
      setOpen(false);
      setForm(initialForm);
      toast.success("Stock movement added");
    } catch (error) {
      toast.error(error.message || "Failed to create stock movement");
    }
  }

  const columns = [
    { key: "id", label: "Movement ID" },
    { key: "type", label: "Type" },
    { key: "sku", label: "SKU" },
    { key: "itemName", label: "Item" },
    { key: "quantity", label: "Qty" },
    { key: "warehouse", label: "Warehouse" },
    { key: "date", label: "Date" },
    { key: "createdBy", label: "Created By" },
  ];

  if (loading) return <PageLoader text="Loading stock movements..." />;

  return (
    <>
      <PageHeader
        title="Stock Movement"
        description="Record stock in and stock out directly to backend"
        action={
          <button onClick={() => setOpen(true)} className="btn-primary">
            <Plus size={18} /> Add Movement
          </button>
        }
      />

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        filterValue=""
        onFilterChange={() => {}}
        filterPlaceholder="All"
        filterOptions={[]}
      />

      <DataTable columns={columns} data={filteredMovements} />

      {open && (
        <Modal title="Add Stock Movement" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-300">Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="input"
              >
                <option value="Stock In">Stock In</option>
                <option value="Stock Out">Stock Out</option>
              </select>
            </div>

            <Input label="SKU" name="sku" value={form.sku} onChange={handleChange} />
            <Input label="Item Name" name="itemName" value={form.itemName} onChange={handleChange} />
            <Input label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} />
            <Input label="Warehouse" name="warehouse" value={form.warehouse} onChange={handleChange} />

            <div className="md:col-span-2">
              <label className="text-sm text-slate-300">Remarks</label>
              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                className="input"
                rows="3"
              />
            </div>

            <button className="btn-primary md:col-span-2">
              Save Movement
            </button>
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