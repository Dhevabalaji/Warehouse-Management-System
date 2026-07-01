import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function CreateStaffPage() {
  const [staff, setStaff] = useState({
    name: "",
    email: "",
    warehouse: "",
    shift: "",
  });

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">
        Create Staff
      </h1>

      <div className="card p-6 mt-8 max-w-3xl">
        <div className="space-y-4">
          <input
            className="input"
            placeholder="Staff Name"
            onChange={(e) =>
              setStaff({ ...staff, name: e.target.value })
            }
          />

          <input
            className="input"
            placeholder="Staff Email"
            onChange={(e) =>
              setStaff({ ...staff, email: e.target.value })
            }
          />

          <input
            className="input"
            placeholder="Assigned Warehouse"
            onChange={(e) =>
              setStaff({
                ...staff,
                warehouse: e.target.value,
              })
            }
          />

          <select
            className="input"
            onChange={(e) =>
              setStaff({ ...staff, shift: e.target.value })
            }
          >
            <option>Select Shift</option>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Night</option>
          </select>

          <button className="btn-primary">
            Create Staff
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}