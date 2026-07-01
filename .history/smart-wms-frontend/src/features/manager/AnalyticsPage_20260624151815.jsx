import DashboardLayout from "../../layouts/DashboardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const stockData = [
  { month: "Jan", stockIn: 420, stockOut: 310 },
  { month: "Feb", stockIn: 520, stockOut: 390 },
  { month: "Mar", stockIn: 610, stockOut: 460 },
  { month: "Apr", stockIn: 580, stockOut: 510 },
  { month: "May", stockIn: 700, stockOut: 620 },
];

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Analytics</h1>
      <p className="text-muted mt-1">Warehouse stock movement insights</p>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="card p-6">
          <p className="text-muted">Stock Accuracy</p>
          <h2 className="text-3xl font-bold text-green mt-2">99.7%</h2>
        </div>
        <div className="card p-6">
          <p className="text-muted">Order Fulfillment</p>
          <h2 className="text-3xl font-bold text-navy mt-2">94.2%</h2>
        </div>
        <div className="card p-6">
          <p className="text-muted">Low Stock Risk</p>
          <h2 className="text-3xl font-bold text-danger mt-2">37 Items</h2>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-navy mb-5">
            Stock In vs Stock Out
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stockIn" fill="#10B981" />
                <Bar dataKey="stockOut" fill="#0F2748" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-navy mb-5">
            Inventory Movement Trend
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stockData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="stockIn" stroke="#10B981" />
                <Line type="monotone" dataKey="stockOut" stroke="#0F2748" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}