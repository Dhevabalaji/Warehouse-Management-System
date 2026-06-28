import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";

import AdminDashboard from "../features/admin/AdminDashboard.jsx";
import WarehousesPage from "../features/admin/WarehousesPage.jsx";
import InventoryPage from "../features/shared/InventoryPage.jsx";
import UsersPage from "../features/admin/UsersPage.jsx";
import SuppliersPage from "../features/admin/SuppliersPage.jsx";
import PurchaseOrdersPage from "../features/admin/PurchaseOrdersPage.jsx";
import ReportsPage from "../features/shared/ReportsPage.jsx";
import SettingsPage from "../features/admin/SettingsPage.jsx";
import ProfilePage from "../features/shared/ProfilePage.jsx";
import NotificationsPage from "../features/shared/NotificationsPage.jsx";
import ActivityLogsPage from "../features/admin/ActivityLogsPage.jsx";

export default function AdminRoutes() {
  return (
    <Route
      path="/admin"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="warehouses" element={<WarehousesPage />} />
      <Route path="inventory" element={<InventoryPage />} />
      <Route path="users" element={<UsersPage />} />
      <Route path="suppliers" element={<SuppliersPage />} />
      <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
      <Route path="reports" element={<ReportsPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="notifications" element={<NotificationsPage />} />
      <Route path="activity-logs" element={<ActivityLogsPage />} />
    </Route>
  );
}