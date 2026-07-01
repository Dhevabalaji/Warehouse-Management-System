import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-bg">
      <Sidebar />

      <main className="flex-1">
        <Topbar />
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}