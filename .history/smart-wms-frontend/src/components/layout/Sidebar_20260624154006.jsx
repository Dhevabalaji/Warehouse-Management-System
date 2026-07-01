import {
  LayoutDashboard,
  Package,
  Users,
  Warehouse,
  BarChart3,
  Settings,
  Truck,
  ClipboardList,
  ScanLine,
  Search,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";

const menuItems = {
  admin: [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Warehouses", path: "/admin/warehouses", icon: Warehouse },
    { label: "Reports", path: "/admin/reports", icon: BarChart3 },
    { label: "Audit Logs", path: "/admin/audit-logs", icon: ClipboardList },
    { label: "Settings", path: "/admin/settings", icon: Settings },
  ],

  manager: [
    { label: "Dashboard", path: "/manager/dashboard", icon: LayoutDashboard },
    { label: "Products", path: "/manager/products", icon: Package },
    { label: "Inventory", path: "/manager/inventory", icon: ClipboardList },
    { label: "Suppliers", path: "/manager/suppliers", icon: Truck },
    { label: "Purchase Orders", path: "/manager/purchase-orders", icon: ClipboardList },
    { label: "Stock Requests", path: "/manager/stock-requests", icon: ClipboardList },
    { label: "Analytics", path: "/manager/analytics", icon: BarChart3 },
  ],

  staff: [
    { label: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard },
    { label: "Stock In", path: "/staff/stock-in", icon: Package },
    { label: "Stock Out", path: "/staff/stock-out", icon: ClipboardList },
    { label: "Scanner", path: "/staff/scanner", icon: ScanLine },
    { label: "Search", path: "/staff/search", icon: Search },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const items = menuItems[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-72 min-h-screen bg-navy text-white flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold">WMS Pro</h1>
        <p className="text-sm text-blue-100 mt-1">
          Smart Warehouse Management
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-white text-navy font-semibold"
                    : "text-blue-100 hover:bg-white/10"
                }`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-100 hover:bg-white/10"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}