import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { addStorageItem } from "../../utils/storageService";
import useAuthContext from "../../hooks/useAuthContext";

export default function CreateWarehousePage() {
  const { user } = useAuthContext();

  const [warehouse, setWarehouse] = useState({
    name: "",
    code: "",
    location: "",
    capacity: "",
    manager: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newWarehouse = {
      id: Date.now(),
      tenantId: user?.tenantId,
      companyCode: user?.companyCode,
      ...warehouse,
    };

    addStorageItem("wms_warehouses", newWarehouse);

    alert("Warehouse created successfully");

    setWarehouse({
      name: "",
      code: "",
      location: "",
      capacity: "",
      manager: "",
    });
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Create Warehouse</h1>
      <p className="text-muted mt-1">Add warehouse under your tenant/company</p>

      <form onSubmit={handleSubmit} className="card p-6 mt-8 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-4">
          <input className="input" placeholder="Warehouse Name" value={warehouse.name} onChange={(e) => setWarehouse({ ...warehouse, name: e.target.value })} required />
          <input className="input" placeholder="Warehouse Code" value={warehouse.code} onChange={(e) => setWarehouse({ ...warehouse, code: e.target.value })} required />
          <input className="input" placeholder="Location" value={warehouse.location} onChange={(e) => setWarehouse({ ...warehouse, location: e.target.value })} required />
          <input className="input" placeholder="Capacity" value={warehouse.capacity} onChange={(e) => setWarehouse({ ...warehouse, capacity: e.target.value })} required />
          <input className="input" placeholder="Manager Name" value={warehouse.manager} onChange={(e) => setWarehouse({ ...warehouse, manager: e.target.value })} />
        </div>

        <button className="btn-primary mt-5">Create Warehouse</button>
      </form>
    </DashboardLayout>
  );
}