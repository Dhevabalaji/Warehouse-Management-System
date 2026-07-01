import PlaceholderPage from "../shared/PlaceholderPage";

export default function ManagerAnalytics() {
  return (
    <PlaceholderPage
      title="Analytics"
      subtitle="Warehouse performance and stock insights"
    >
      <div className="grid md:grid-cols-3 gap-5">
        <div className="stat-card">
          <p className="stat-label">Stock Accuracy</p>
          <h2 className="stat-value">99.4%</h2>
        </div>

        <div className="stat-card">
          <p className="stat-label">Order Fulfillment</p>
          <h2 className="stat-value">94%</h2>
        </div>

        <div className="stat-card">
          <p className="stat-label">Capacity Used</p>
          <h2 className="stat-value">72%</h2>
        </div>
      </div>
    </PlaceholderPage>
  );
}