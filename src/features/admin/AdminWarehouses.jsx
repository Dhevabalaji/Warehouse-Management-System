import PlaceholderPage from "../shared/PlaceholderPage";

export default function AdminWarehouses() {
  return (
    <PlaceholderPage
      title="Warehouse Management"
      subtitle="Manage company warehouses and capacity"
    >
      <div className="grid md:grid-cols-3 gap-5">
        <div className="content-card p-5">
          <h3 className="font-bold text-lg">Central Hub</h3>
          <p className="text-slate-500 mt-1">WH-001 • Chennai</p>
          <p className="mt-4 text-sm">Manager: Warehouse Manager</p>

          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span>Capacity</span>
              <span>82%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full mt-2">
              <div className="h-2 bg-primary rounded-full w-[82%]" />
            </div>
          </div>
        </div>

        <div className="content-card p-5">
          <h3 className="font-bold text-lg">South Distribution</h3>
          <p className="text-slate-500 mt-1">WH-002 • Coimbatore</p>
          <p className="mt-4 text-sm">Manager: Not Assigned</p>

          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span>Capacity</span>
              <span>64%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full mt-2">
              <div className="h-2 bg-primary rounded-full w-[64%]" />
            </div>
          </div>
        </div>

        <div className="content-card p-5">
          <h3 className="font-bold text-lg">North Storage</h3>
          <p className="text-slate-500 mt-1">WH-003 • Bangalore</p>
          <p className="mt-4 text-sm">Manager: Not Assigned</p>

          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span>Capacity</span>
              <span>71%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full mt-2">
              <div className="h-2 bg-primary rounded-full w-[71%]" />
            </div>
          </div>
        </div>
      </div>
    </PlaceholderPage>
  );
}