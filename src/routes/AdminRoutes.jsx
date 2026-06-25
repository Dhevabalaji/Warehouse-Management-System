import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import AdminDashboard from "../features/admin/AdminDashboard";
import CompanyProfilePage from "../features/admin/CompanyProfilePage";
import UserManagementPage from "../features/admin/UserManagementPage";
import WarehouseManagementPage from "../features/admin/WarehouseManagementPage";
import CreateWarehousePage from "../features/admin/CreateWarehousePage";
import CreateManagerPage from "../features/admin/CreateManagerPage";
import CreateStaffPage from "../features/admin/CreateStaffPage";
import ReportsPage from "../features/admin/ReportsPage";
import AuditLogsPage from "../features/admin/AuditLogsPage";
import SettingsPage from "../features/admin/SettingsPage";

const admin = ["admin"];

export default function AdminRoutes() {
  return (
    <>
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={admin}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/company-profile" element={<ProtectedRoute allowedRoles={admin}><CompanyProfilePage /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={admin}><UserManagementPage /></ProtectedRoute>} />
      <Route path="/admin/warehouses" element={<ProtectedRoute allowedRoles={admin}><WarehouseManagementPage /></ProtectedRoute>} />
      <Route path="/admin/create-warehouse" element={<ProtectedRoute allowedRoles={admin}><CreateWarehousePage /></ProtectedRoute>} />
      <Route path="/admin/create-manager" element={<ProtectedRoute allowedRoles={admin}><CreateManagerPage /></ProtectedRoute>} />
      <Route path="/admin/create-staff" element={<ProtectedRoute allowedRoles={admin}><CreateStaffPage /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={admin}><ReportsPage /></ProtectedRoute>} />
      <Route path="/admin/audit-logs" element={<ProtectedRoute allowedRoles={admin}><AuditLogsPage /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={admin}><SettingsPage /></ProtectedRoute>} />
    </>
  );
}