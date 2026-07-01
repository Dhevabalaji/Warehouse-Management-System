import { Bell, Search, UserCircle } from "lucide-react";
import useAuthContext from "../../hooks/useAuthContext";

export default function Topbar() {
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

        <button className="relative p-3 bg-slate-100 rounded-xl">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full" />
        </button>

        <div className="flex items-center gap-2">
          <UserCircle size={34} className="text-navy" />
        </div>
      </div>
    </header>
  );
}