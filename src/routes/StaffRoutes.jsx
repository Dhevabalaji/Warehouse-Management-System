import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";

import StaffDashboard from "../features/staff/StaffDashboard.jsx";
import InventoryPage from "../features/shared/InventoryPage.jsx";
import StockMovementPage from "../features/staff/StockMovementPage.jsx";
import TasksPage from "../features/shared/TasksPage.jsx";
import DamagedGoodsPage from "../features/shared/DamagedGoodsPage.jsx";
import ProfilePage from "../features/shared/ProfilePage.jsx";
import NotificationsPage from "../features/shared/NotificationsPage.jsx";

export default function StaffRoutes() {
  return (
    <Route
      path="/staff"
      element={
        <ProtectedRoute allowedRoles={["staff"]}>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<StaffDashboard />} />
      <Route path="inventory" element={<InventoryPage />} />
      <Route path="stock-movement" element={<StockMovementPage />} />
      <Route path="tasks" element={<TasksPage />} />
      <Route path="damaged-goods" element={<DamagedGoodsPage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="notifications" element={<NotificationsPage />} />
    </Route>
  );
}