import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";

import ManagerDashboard from "../features/manager/ManagerDashboard.jsx";
import InventoryPage from "../features/shared/InventoryPage.jsx";
import StockRequestsPage from "../features/manager/StockRequestsPage.jsx";
import TransfersPage from "../features/manager/TransfersPage.jsx";
import DamagedGoodsPage from "../features/shared/DamagedGoodsPage.jsx";
import TasksPage from "../features/shared/TasksPage.jsx";
import ReportsPage from "../features/shared/ReportsPage.jsx";
import ProfilePage from "../features/shared/ProfilePage.jsx";
import NotificationsPage from "../features/shared/NotificationsPage.jsx";

export default function ManagerRoutes() {
  return (
    <Route
      path="/manager"
      element={
        <ProtectedRoute allowedRoles={["manager"]}>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<ManagerDashboard />} />
      <Route path="inventory" element={<InventoryPage />} />
      <Route path="stock-requests" element={<StockRequestsPage />} />
      <Route path="transfers" element={<TransfersPage />} />
      <Route path="damaged-goods" element={<DamagedGoodsPage />} />
      <Route path="tasks" element={<TasksPage />} />
      <Route path="reports" element={<ReportsPage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="notifications" element={<NotificationsPage />} />
    </Route>
  );
}