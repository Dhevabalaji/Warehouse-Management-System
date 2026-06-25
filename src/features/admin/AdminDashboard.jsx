import { Building2, Package, Users, AlertTriangle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import DashboardLayout from "../../layouts/DashboardLayout";
import { demoUsers } from "../../data/mockData";
import { getStorage } from "../../utils/storageService";
import useAuthContext from "../../hooks/useAuthContext";

export default function AdminDashboard() {
  const { user } = useAuthContext();

  const customUsers = getStorage("wms_custom_users", []);
  const warehouses = getStorage("wms_warehouses", []);
  const inventory = getStorage("wms_inventory", []);

  const companyUsers = [...demoUsers, ...customUsers].filter(
    (item) => item.companyCode === user?.companyCode
  );

  const companyWarehouses = warehouses.filter(
    (item) => item.companyCode === user?.companyCode
  );

  const companyInventory = inventory.filter(
    (item) => item.companyCode === user?.companyCode
  );

  const lowStockItems = companyInventory.filter(
    (item) => Number(item.qty) <= Number(item.minQty)
  );

  const inventoryValue = companyInventory.reduce(
    (sum, item) => sum + Number(item.qty) * Number(item.price || 0),
    0
  );

  const stats = [
    { title: "Warehouses", value: companyWarehouses.length, icon: Building2 },
    { title: "Products", value: companyInventory.length, icon: Package },
    { title: "Users", value: companyUsers.length, icon: Users },
    { title: "Low Stock", value: lowStockItems.length, icon: AlertTriangle },
  ];

  const roleData = [
    {
      name: "Admins",
      value: companyUsers.filter((u) => u.role === "admin").length,
    },
    {
      name: "Managers",
      value: companyUsers.filter((u) => u.role === "manager").length,
    },
    {
      name: "Staff",
      value: companyUsers.filter((u) => u.role === "staff").length,
    },
  ];

  const warehouseData = companyWarehouses.map((warehouse) => ({
    name: warehouse.name,
    capacity: Number(warehouse.capacity),
  }));

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-navy">Admin Dashboard</h1>
      <p className="text-muted mt-1">
        Company-level overview for {user?.companyCode}
      </p>

      <div className="grid md:grid-cols-4 gap-6 mt-8">
        {stats.map(({ title, value, icon: Icon }) => (
          <div key={title} className="card p-6">
            <Icon className="text-green mb-4" size={30} />
            <h3 className="text-3xl font-bold text-navy">{value}</h3>
            <p className="text-muted">{title}</p>
          </div>
        ))}
      </div>

      <div className="card p-6 mt-8">
        <p className="text-muted">Total Inventory Value</p>
        <h2 className="text-4xl font-bold text-navy mt-2">
          ₹{inventoryValue.toLocaleString()}
        </h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-navy mb-5">
            Warehouse Capacity
          </h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={warehouseData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="capacity" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-navy mb-5">User Roles</h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={roleData} dataKey="value" nameKey="name" outerRadius={90} label>
                  <Cell fill="#071739" />
                  <Cell fill="#1f4ba5" />
                  <Cell fill="#10B981" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}