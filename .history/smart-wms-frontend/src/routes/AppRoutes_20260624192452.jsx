import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Landing & Auth
import LandingPage from "../features/landing/LandingPage";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import ForbiddenPage from "../features/auth/ForbiddenPage";
import NotFoundPage from "../features/auth/NotFoundPage";

// Common
import NotificationsPage from "../features/common/NotificationsPage";
import ProfilePage from "../features/common/ProfilePage";

// Admin
import AdminDashboard from "../features/admin/AdminDashboard";
import UserManagementPage from "../features/admin/UserManagementPage";
import WarehouseManagementPage from "../features/admin/WarehouseManagementPage";
import ReportsPage from "../features/admin/ReportsPage";
import SettingsPage from "../features/admin/SettingsPage";
import AuditLogsPage from "../features/admin/AuditLogsPage";
import CompanyProfilePage from "../features/admin/CompanyProfilePage";
import CreateWarehousePage from "../features/admin/CreateWarehousePage";
import CreateManagerPage from "../features/admin/CreateManagerPage";
import CreateStaffPage from "../features/admin/CreateStaffPage";

// Manager
import ManagerDashboard from "../features/manager/ManagerDashboard";
import ProductsPage from "../features/manager/ProductsPage";
import InventoryPage from "../features/manager/InventoryPage";
import SuppliersPage from "../features/manager/SuppliersPage";
import PurchaseOrdersPage from "../features/manager/PurchaseOrdersPage";
import AnalyticsPage from "../features/manager/AnalyticsPage";
import StockRequestsPage from "../features/manager/StockRequestsPage";

// Staff
import StaffDashboard from "../features/staff/StaffDashboard";
import StockInPage from "../features/staff/StockInPage";
import StockOutPage from "../features/staff/StockOutPage";
import ScannerPage from "../features/staff/ScannerPage";
import ProductSearchPage from "../features/staff/ProductSearchPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Shared Protected Routes */}
      <Route
        path="/notifications"
        element={
          <ProtectedRoute allowedRoles={["admin", "manager", "staff"]}>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["admin", "manager", "staff"]}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* ================= ADMIN ================= */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/company-profile"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <CompanyProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <UserManagementPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/warehouses"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <WarehouseManagementPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/create-warehouse"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <CreateWarehousePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/create-manager"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <CreateManagerPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/create-staff"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <CreateStaffPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ReportsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/audit-logs"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AuditLogsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* ================= MANAGER ================= */}

      <Route
        path="/manager/dashboard"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/products"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <ProductsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/inventory"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <InventoryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/suppliers"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <SuppliersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/purchase-orders"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <PurchaseOrdersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/stock-requests"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <StockRequestsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/analytics"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />

      {/* ================= STAFF ================= */}

      <Route
        path="/staff/dashboard"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/stock-in"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <StockInPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/stock-out"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <StockOutPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/scanner"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <ScannerPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/search"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <ProductSearchPage />
          </ProtectedRoute>
        }
      />

      {/* Error Pages */}

      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="/404" element={<NotFoundPage />} />

      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}