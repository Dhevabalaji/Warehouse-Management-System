import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { addStorageItem } from "../../utils/storageService";
import useAuthContext from "../../hooks/useAuthContext";

export default function CreateManagerPage() {
  const { user } = useAuthContext();

  const [manager, setManager] = useState({
    name: "",
    email: "",
    password: "",
    warehouse: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newManager = {
      id: Date.now(),
      tenantId: user?.tenantId,
      companyCode: user?.companyCode,
      role: "manager",
      ...manager,
    };

    addStorageItem("wms_custom_users", newManager);

    alert("Manager created successfully");

    setManager({
      name: "",
      email: "",
      password: "",
      warehouse: "",
    });
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Create Manager</h1>
      <p className="text-muted mt-1">Create warehouse manager login account</p>

      <form onSubmit={handleSubmit} className="card p-6 mt-8 max-w-3xl space-y-4">
        <input className="input" placeholder="Manager Name" value={manager.name} onChange={(e) => setManager({ ...manager, name: e.target.value })} required />
        <input className="input" placeholder="Manager Email" value={manager.email} onChange={(e) => setManager({ ...manager, email: e.target.value })} required />
        <input className="input" type="password" placeholder="Temporary Password" value={manager.password} onChange={(e) => setManager({ ...manager, password: e.target.value })} required />
        <input className="input" placeholder="Assigned Warehouse" value={manager.warehouse} onChange={(e) => setManager({ ...manager, warehouse: e.target.value })} required />

        <button className="btn-primary">Create Manager</button>
      </form>
    </DashboardLayout>
  );
}