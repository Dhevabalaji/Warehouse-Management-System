import DashboardLayout from "../../layouts/DashboardLayout";
import { getStorage } from "../../utils/storageService";
import useAuthContext from "../../hooks/useAuthContext";

const defaultWarehouses = [
  {
    id: "WH-001",
    name: "Central Hub",
    code: "CH-001",
    location: "Chennai",
    capacity: "82",
    manager: "Sarah Okonkwo",
    companyCode: "WMSPRO",
  },
  {
    id: "WH-002",
    name: "South Distribution",
    code: "SD-002",
    location: "Coimbatore",
    capacity: "64",
    manager: "Ravi Kumar",
    companyCode: "WMSPRO",
  },
];

export default function WarehouseManagementPage() {
  const { user } = useAuthContext();

  const savedWarehouses = getStorage("wms_warehouses", []);

  const warehouses = [...defaultWarehouses, ...savedWarehouses].filter(
    (w) => w.companyCode === user?.companyCode
  );

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Warehouse Management</h1>
      <p className="text-muted mt-1">View warehouses under your tenant</p>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {warehouses.map((w) => (
          <div key={w.id} className="card p-6">
            <h2 className="text-xl font-bold text-navy">{w.name}</h2>
            <p className="text-muted mt-1">
              {w.code || w.id} • {w.location}
            </p>

            <div className="mt-5">
              <div className="flex justify-between text-sm mb-2">
                <span>Capacity</span>
                <span>{w.capacity}%</span>
              </div>

              <div className="h-3 bg-slate-200 rounded-full">
                <div
                  className="h-3 bg-green rounded-full"
                  style={{ width: `${w.capacity}%` }}
                />
              </div>
            </div>

            <p className="mt-5 text-sm">
              <b>Manager:</b> {w.manager || "Not assigned"}
            </p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}