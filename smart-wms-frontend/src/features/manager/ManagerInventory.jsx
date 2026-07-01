import PlaceholderPage from "../shared/PlaceholderPage";

export default function ManagerInventory() {
  return (
    <PlaceholderPage
      title="Inventory"
      subtitle="Track stock availability and warehouse locations"
    >
      <div className="space-y-4">
        {[
          ["Safety Helmet", 80],
          ["Barcode Rolls", 25],
          ["Pallet Jack", 65],
        ].map(([name, value]) => (
          <div key={name}>
            <div className="flex justify-between mb-2">
              <span>{name}</span>
              <span>{value}%</span>
            </div>

            <div className="h-3 bg-slate-200 rounded-full">
              <div
                className="h-3 bg-primary rounded-full"
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </PlaceholderPage>
  );
}