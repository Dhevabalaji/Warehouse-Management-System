import { Bell, Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
import { getStorage } from "../../utils/storageService.js";

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const unreadCount = getStorage("wms_notifications", []).filter(
    (item) =>
      item.companyCode === user?.companyCode &&
      !item.read &&
      (item.targetRole === "all" || item.targetRole === user?.role)
  ).length;

  function goToNotifications() {
    navigate(`/${user.role}/notifications`);
  }

  return (
    <header className="h-20 border-b border-white/10 bg-slate-950/80 backdrop-blur flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center"
        >
          <Menu />
        </button>

        <div>
          <h2 className="font-bold text-base md:text-lg">
            Welcome, {user?.name || "User"}
          </h2>
          <p className="text-xs md:text-sm text-slate-400 capitalize">
            {user?.role} Dashboard
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3 w-80 rounded-xl bg-slate-900 border border-white/10 px-4 py-3">
        <Search size={18} className="text-slate-400" />
        <input
          placeholder="Search..."
          className="bg-transparent outline-none text-sm flex-1"
        />
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={goToNotifications}
          className="relative h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center"
        >
          <Bell size={19} />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-yellow-400 text-slate-950 text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => navigate(`/${user.role}/profile`)}
          className="h-10 w-10 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center font-black"
        >
          {user?.name?.charAt(0) || "U"}
        </button>
      </div>
    </header>
  );
}