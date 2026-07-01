import PlaceholderPage from "../shared/PlaceholderPage";

export default function StaffStockOut() {
  return (
    <PlaceholderPage title="Stock Out" subtitle="Record outgoing stock">
      <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
        <input className="form-input" placeholder="Product Name" />
        <input className="form-input" placeholder="SKU Code" />
        <input className="form-input" type="number" placeholder="Quantity" />
        <input className="form-input" placeholder="Reason / Dispatch ID" />
      </div>

      <button className="btn-primary mt-6">Submit Stock Out</button>
    </PlaceholderPage>
  );
}