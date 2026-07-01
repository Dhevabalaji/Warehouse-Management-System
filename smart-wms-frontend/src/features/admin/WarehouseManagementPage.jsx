import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getStorage, setStorage } from "../../utils/storageService";
import useAuthContext from "../../hooks/useAuthContext";

export default function WarehouseManagementPage() {
  const { user } = useAuthContext();

  const [editingWarehouse, setEditingWarehouse] = useState(null);

  const warehouses = getStorage("wms_warehouses", []).filter(
    (warehouse) => warehouse.companyCode === user?.companyCode
  );

  const handleDelete = (id) => {
    if (!window.confirm("Delete this warehouse?")) return;

    const allWarehouses = getStorage("wms_warehouses", []);

    const updatedWarehouses = allWarehouses.filter(
      (warehouse) => warehouse.id !== id
    );

    setStorage("wms_warehouses", updatedWarehouses);

    window.location.reload();
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const allWarehouses = getStorage("wms_warehouses", []);

    const updatedWarehouses = allWarehouses.map((warehouse) =>
      warehouse.id === editingWarehouse.id
        ? {
            ...editingWarehouse,
            capacity: Number(editingWarehouse.capacity),
          }
        : warehouse
    );

    setStorage("wms_warehouses", updatedWarehouses);

    setEditingWarehouse(null);

    window.location.reload();
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">
        Warehouse Management
      </h1>

      <p className="text-muted mt-1">
        Manage company warehouses
      </p>

      {editingWarehouse && (
        <form
          onSubmit={handleUpdate}
          className="card p-6 mt-8"
        >
          <h2 className="text-xl font-bold mb-5">
            Edit Warehouse
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              className="input"
              placeholder="Warehouse Name"
              value={editingWarehouse.name}
              onChange={(e) =>
                setEditingWarehouse({
                  ...editingWarehouse,
                  name: e.target.value,
                })
              }
            />

            <input
              className="input"
              placeholder="Warehouse Code"
              value={editingWarehouse.code}
              onChange={(e) =>
                setEditingWarehouse({
                  ...editingWarehouse,
                  code: e.target.value,
                })
              }
            />

            <input
              className="input"
              placeholder="Location"
              value={editingWarehouse.location}
              onChange={(e) =>
                setEditingWarehouse({
                  ...editingWarehouse,
                  location: e.target.value,
                })
              }
            />

            <input
              className="input"
              placeholder="Manager"
              value={editingWarehouse.manager}
              onChange={(e) =>
                setEditingWarehouse({
                  ...editingWarehouse,
                  manager: e.target.value,
                })
              }
            />

            <input
              type="number"
              className="input"
              placeholder="Capacity (%)"
              value={editingWarehouse.capacity}
              onChange={(e) =>
                setEditingWarehouse({
                  ...editingWarehouse,
                  capacity: e.target.value,
                })
              }
            />

          </div>

          <div className="flex gap-3 mt-6">
            <button className="btn-primary">
              Save Changes
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => setEditingWarehouse(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        {warehouses.length === 0 ? (
          <div className="card p-6">
            No warehouses found.
          </div>
        ) : (
          warehouses.map((warehouse) => (
            <div
              key={warehouse.id}
              className="card p-6"
            >
              <h2 className="text-xl font-bold text-navy">
                {warehouse.name}
              </h2>

              <p className="text-muted mt-2">
                {warehouse.code}
              </p>

              <p className="mt-3">
                📍 {warehouse.location}
              </p>

              <p className="mt-2">
                👤 {warehouse.manager}
              </p>

              <div className="mt-5">
                <div className="flex justify-between text-sm mb-2">
                  <span>Capacity</span>
                  <span>{warehouse.capacity}%</span>
                </div>

                <div className="h-3 rounded-full bg-slate-200">
                  <div
                    className="h-3 rounded-full bg-green"
                    style={{
                      width: `${warehouse.capacity}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">

                <button
                  className="btn-primary"
                  onClick={() => setEditingWarehouse(warehouse)}
                >
                  Edit
                </button>

                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
                  onClick={() => handleDelete(warehouse.id)}
                >
                  Delete
                </button>

              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}