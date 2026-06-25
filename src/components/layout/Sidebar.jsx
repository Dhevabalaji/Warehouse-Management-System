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
  Building2,
  Bell,
  User,
  ArrowRightLeft,
  ShoppingCart,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";

const menuItems = {
  admin: [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Company Profile", path: "/admin/company-profile", icon: Building2 },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Warehouses", path: "/admin/warehouses", icon: Warehouse },
    { label: "Create Warehouse", path: "/admin/create-warehouse", icon: Warehouse },
    { label: "Create Manager", path: "/admin/create-manager", icon: Users },
    { label: "Create Staff", path: "/admin/create-staff", icon: Users },
    { label: "Reports", path: "/admin/reports", icon: BarChart3 },
    { label: "Audit Logs", path: "/admin/audit-logs", icon: ClipboardList },
    { label: "Settings", path: "/admin/settings", icon: Settings },
  ],

  manager: [
    { label: "Dashboard", path: "/manager/dashboard", icon: LayoutDashboard },
    { label: "Products", path: "/manager/products", icon: Package },
    { label: "Create Product", path: "/manager/create-product", icon: Package },
    { label: "Inventory", path: "/manager/inventory", icon: ClipboardList },
    { label: "Suppliers", path: "/manager/suppliers", icon: Truck },
    { label: "Create Supplier", path: "/manager/create-supplier", icon: Truck },
    { label: "Purchase Orders", path: "/manager/purchase-orders", icon: ShoppingCart },
    { label: "Create Purchase Order", path: "/manager/create-purchase-order", icon: ShoppingCart },
    { label: "Stock Requests", path: "/manager/stock-requests", icon: ClipboardList },
    { label: "Stock Movements", path: "/manager/stock-movements", icon: ClipboardList },
    { label: "Inventory Transfer", path: "/manager/create-transfer", icon: ArrowRightLeft },
    { label: "Transfer History", path: "/manager/transfers", icon: ArrowRightLeft },
    { label: "Assign Task", path: "/manager/assign-task", icon: ClipboardList },
    { label: "Analytics", path: "/manager/analytics", icon: BarChart3 },
  ],

  staff: [
    { label: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard },
    { label: "Assigned Tasks", path: "/staff/tasks", icon: ClipboardList },
    { label: "Stock In", path: "/staff/stock-in", icon: Package },
    { label: "Stock Out", path: "/staff/stock-out", icon: ClipboardList },
    { label: "Scanner", path: "/staff/scanner", icon: ScanLine },
    { label: "Search Products", path: "/staff/search", icon: Search },
    { label: "Damaged Goods", path: "/staff/damaged-goods", icon: Package },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const role = user?.role?.toLowerCase();
  const items = menuItems[role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-72 min-h-screen bg-[#071739] text-white flex flex-col shadow-2xl">
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white">Smart WMS</h1>
        <p className="text-sm text-slate-300 mt-1">
          Warehouse Management System
        </p>
      </div>

      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#1f4ba5] flex items-center justify-center">
            <User size={22} />
          </div>

          <div>
            <h3 className="font-semibold">{user?.name || "User"}</h3>
            <p className="text-xs text-slate-300 capitalize">{user?.role}</p>
            <p className="text-xs text-slate-400">{user?.companyCode}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-5">
        <div className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-[#1f4ba5] text-white shadow-lg"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-white/10 p-4 space-y-2">
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl ${
              isActive ? "bg-[#1f4ba5]" : "hover:bg-white/10"
            }`
          }
        >
          <Bell size={20} />
          Notifications
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl ${
              isActive ? "bg-[#1f4ba5]" : "hover:bg-white/10"
            }`
          }
        >
          <User size={20} />
          Profile
        </NavLink>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-600 transition-all"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}