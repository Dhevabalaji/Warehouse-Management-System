import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Landing & Auth
import LandingPage from "../features/landing/LandingPage";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import ForbiddenPage from "../features/auth/ForbiddenPage";
import NotFoundPage from "../features/auth/NotFoundPage";

// Admin
import AdminDashboard from "../features/admin/AdminDashboard";

// Manager
import ManagerDashboard from "../features/manager/ManagerDashboard";
import ProductsPage from "../features/manager/ProductsPage";
import InventoryPage from "../features/manager/InventoryPage";
import SuppliersPage from "../features/manager/SuppliersPage";
import PurchaseOrdersPage from "../features/manager/PurchaseOrdersPage";

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

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
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

      {/* Catch All */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}