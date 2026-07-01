import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { suppliers as defaultSuppliers } from "../../data/mockData";
import { getStorage, setStorage } from "../../utils/storageService";
import useAuthContext from "../../hooks/useAuthContext";

export default function SuppliersPage() {
  const { user } = useAuthContext();
  const [editingSupplier, setEditingSupplier] = useState(null);

  const savedSuppliers = getStorage("wms_suppliers", []);

  const suppliers = [
    ...defaultSuppliers.map((supplier) => ({
      ...supplier,
      companyCode: "WMSPRO",
      tenantId: "TNT001",
      isDefault: true,
    })),
    ...savedSuppliers,
  ].filter((supplier) => supplier.companyCode === user?.companyCode);

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return;

    const updatedSuppliers = savedSuppliers.filter(
      (supplier) => supplier.id !== id
    );

    setStorage("wms_suppliers", updatedSuppliers);
    window.location.reload();
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    const updatedSuppliers = savedSuppliers.map((supplier) =>
      supplier.id === editingSupplier.id ? editingSupplier : supplier
    );

    setStorage("wms_suppliers", updatedSuppliers);
    setEditingSupplier(null);
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Suppliers</h1>
      <p className="text-muted mt-1">
        View, edit, and delete supplier records
      </p>

      {editingSupplier && (
        <form onSubmit={handleEditSubmit} className="card p-6 mt-8">
          <h2 className="text-xl font-bold text-navy mb-5">Edit Supplier</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              className="input"
              value={editingSupplier.name}
              onChange={(e) =>
                setEditingSupplier({
                  ...editingSupplier,
                  name: e.target.value,
                })
              }
            />

            <input
              className="input"
              value={editingSupplier.contact}
              onChange={(e) =>
                setEditingSupplier({
                  ...editingSupplier,
                  contact: e.target.value,
                })
              }
            />

            <input
              className="input"
              value={editingSupplier.email || ""}
              onChange={(e) =>
                setEditingSupplier({
                  ...editingSupplier,
                  email: e.target.value,
                })
              }
            />

            <input
              className="input"
              value={editingSupplier.phone || ""}
              onChange={(e) =>
                setEditingSupplier({
                  ...editingSupplier,
                  phone: e.target.value,
                })
              }
            />

            <input
              className="input"
              value={editingSupplier.category}
              onChange={(e) =>
                setEditingSupplier({
                  ...editingSupplier,
                  category: e.target.value,
                })
              }
            />

            <input
              className="input"
              value={editingSupplier.status}
              onChange={(e) =>
                setEditingSupplier({
                  ...editingSupplier,
                  status: e.target.value,
                })
              }
            />
          </div>

          <textarea
            className="input mt-4"
            rows="3"
            value={editingSupplier.address || ""}
            onChange={(e) =>
              setEditingSupplier({
                ...editingSupplier,
                address: e.target.value,
              })
            }
          />

          <div className="flex gap-3 mt-5">
            <button className="btn-primary">Save Changes</button>

            <button
              type="button"
              onClick={() => setEditingSupplier(null)}
              className="px-4 py-2 rounded-xl border"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="card p-6">
            <h2 className="text-xl font-bold text-navy">{supplier.name}</h2>
            <p className="text-muted mt-1">{supplier.category}</p>

            <div className="mt-5 space-y-2 text-sm">
              <p>
                <b>Contact:</b> {supplier.contact}
              </p>
              <p>
                <b>Email:</b> {supplier.email || "Not added"}
              </p>
              <p>
                <b>Phone:</b> {supplier.phone || "Not added"}
              </p>
              <p>
                <b>Orders:</b> {supplier.orders}
              </p>
              <p>
                <b>On-time:</b> {supplier.onTime}
              </p>
              <p>
                <b>Rating:</b> {supplier.rating}
              </p>
            </div>

            <span className="inline-block mt-5 px-3 py-1 rounded-full bg-green/10 text-green font-semibold">
              {supplier.status}
            </span>

            <div className="flex gap-3 mt-5">
              {!supplier.isDefault && (
                <>
                  <button
                    onClick={() => setEditingSupplier(supplier)}
                    className="px-3 py-1 rounded-lg bg-navy text-white text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(supplier.id)}
                    className="px-3 py-1 rounded-lg bg-danger text-white text-sm"
                  >
                    Delete
                  </button>
                </>
              )}

              {supplier.isDefault && (
                <span className="text-sm text-muted">
                  Demo supplier cannot be edited
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}