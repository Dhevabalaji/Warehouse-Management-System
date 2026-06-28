import { NavLink } from "react-router-dom";
import {
  Boxes,
  LayoutDashboard,
  Warehouse,
  Package,
  Users,
  Truck,
  ClipboardList,
  ArrowLeftRight,
  AlertTriangle,
  BarChart3,
  LogOut,
  Settings,
  UserCog,
  X,
  UserCircle,
  Bell,
  History,
} from "lucide-react";
import useAuthContext from "../../hooks/useAuthContext";

const links = {
  admin: [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Warehouses", path: "/admin/warehouses", icon: Warehouse },
    { label: "Inventory", path: "/admin/inventory", icon: Package },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Suppliers", path: "/admin/suppliers", icon: Truck },
    { label: "Purchase Orders", path: "/admin/purchase-orders", icon: ClipboardList },
    { label: "Reports", path: "/admin/reports", icon: BarChart3 },
    { label: "Notifications", path: "/admin/notifications", icon: Bell },
    { label: "Activity Logs", path: "/admin/activity-logs", icon: History },
    { label: "Settings", path: "/admin/settings", icon: Settings },
    { label: "Profile", path: "/admin/profile", icon: UserCircle },
  ],
  manager: [
    { label: "Dashboard", path: "/manager/dashboard", icon: LayoutDashboard },
    { label: "Inventory", path: "/manager/inventory", icon: Package },
    { label: "Stock Requests", path: "/manager/stock-requests", icon: ClipboardList },
    { label: "Transfers", path: "/manager/transfers", icon: ArrowLeftRight },
    { label: "Damaged Goods", path: "/manager/damaged-goods", icon: AlertTriangle },
    { label: "Staff Tasks", path: "/manager/tasks", icon: UserCog },
    { label: "Reports", path: "/manager/reports", icon: BarChart3 },
    { label: "Notifications", path: "/manager/notifications", icon: Bell },
    { label: "Profile", path: "/manager/profile", icon: UserCircle },
  ],
  staff: [
    { label: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard },
    { label: "Inventory", path: "/staff/inventory", icon: Package },
    { label: "Stock Movement", path: "/staff/stock-movement", icon: ArrowLeftRight },
    { label: "My Tasks", path: "/staff/tasks", icon: ClipboardList },
    { label: "Damaged Goods", path: "/staff/damaged-goods", icon: AlertTriangle },
    { label: "Notifications", path: "/staff/notifications", icon: Bell },
    { label: "Profile", path: "/staff/profile", icon: UserCircle },
  ],
};

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuthContext();
  const navLinks = links[user?.role] || [];

  return (
    <>
      {open && (
        <button
          onClick={onClose}
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 z-50 w-72 shrink-0 min-h-screen border-r border-white/10 bg-slate-900 p-5 flex flex-col transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-yellow-400 text-slate-950 flex items-center justify-center">
              <Boxes />
            </div>
            <div>
              <h1 className="text-lg font-black">Smart WMS</h1>
              <p className="text-xs text-slate-400">{user?.companyCode}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-2 flex-1 overflow-y-auto pr-1">
          {navLinks.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-yellow-400 text-slate-950"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 mt-4"
        >
          <LogOut size={19} />
          Logout
        </button>
      </aside>
    </>
  );
}