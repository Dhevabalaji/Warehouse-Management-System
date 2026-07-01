import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function CreateManagerPage() {
  const [manager, setManager] = useState({
    name: "",
    email: "",
    warehouse: "",
  });

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">
        Create Manager
      </h1>

      <div className="card p-6 mt-8 max-w-3xl">
        <div className="space-y-4">
          <input
            className="input"
            placeholder="Manager Name"
            onChange={(e) =>
              setManager({ ...manager, name: e.target.value })
            }
          />

          <input
            className="input"
            placeholder="Manager Email"
            onChange={(e) =>
              setManager({ ...manager, email: e.target.value })
            }
          />

          <input
            className="input"
            placeholder="Assigned Warehouse"
            onChange={(e) =>
              setManager({
                ...manager,
                warehouse: e.target.value,
              })
            }
          />

          <button className="btn-primary">
            Create Manager
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}