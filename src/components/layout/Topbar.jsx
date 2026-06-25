import { Bell, Search, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";

export default function Topbar() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-textDark">
          Welcome, {user?.name}
        </h2>

        <p className="text-sm text-muted">
          {user?.companyCode} • {user?.role?.toUpperCase()}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
          <Search size={18} className="text-muted" />

          <input
            className="bg-transparent outline-none text-sm"
            placeholder="Search..."
          />
        </div>

        <button
          onClick={() => navigate("/notifications")}
          className="relative p-3 bg-slate-100 rounded-xl hover:bg-slate-200"
        >
          <Bell size={20} />

          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 hover:bg-slate-100 p-2 rounded-xl"
        >
          <UserCircle size={34} className="text-navy" />

          <div className="hidden md:block text-left">
            <p className="font-semibold text-sm">{user?.name}</p>
            <p className="text-xs text-muted">{user?.role}</p>
          </div>
        </button>
      </div>
    </header>
  );
}