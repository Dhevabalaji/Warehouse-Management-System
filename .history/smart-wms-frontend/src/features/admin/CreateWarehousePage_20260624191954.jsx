import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function CreateWarehousePage() {
  const [warehouse, setWarehouse] = useState({
    name: "",
    code: "",
    location: "",
    capacity: "",
    manager: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Warehouse Created Successfully");
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">
        Create Warehouse
      </h1>

      <form
        onSubmit={handleSubmit}
        className="card p-6 mt-8 max-w-4xl"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Warehouse Name"
            onChange={(e) =>
              setWarehouse({
                ...warehouse,
                name: e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="Warehouse Code"
            onChange={(e) =>
              setWarehouse({
                ...warehouse,
                code: e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="Location"
            onChange={(e) =>
              setWarehouse({
                ...warehouse,
                location: e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="Capacity"
            onChange={(e) =>
              setWarehouse({
                ...warehouse,
                capacity: e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="Manager Name"
            onChange={(e) =>
              setWarehouse({
                ...warehouse,
                manager: e.target.value,
              })
            }
          />
        </div>

        <button className="btn-primary mt-5">
          Create Warehouse
        </button>
      </form>
    </DashboardLayout>
  );
}