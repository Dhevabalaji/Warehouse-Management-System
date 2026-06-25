import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import StaffDashboard from "../features/staff/StaffDashboard";
import StockInPage from "../features/staff/StockInPage";
import StockOutPage from "../features/staff/StockOutPage";
import ScannerPage from "../features/staff/ScannerPage";
import ProductSearchPage from "../features/staff/ProductSearchPage";
import AssignedTasksPage from "../features/staff/AssignedTasksPage";
import DamagedGoodsPage from "../features/staff/DamagedGoodsPage";

const staff = ["staff"];

export default function StaffRoutes() {
  return (
    <>
      <Route path="/staff/dashboard" element={<ProtectedRoute allowedRoles={staff}><StaffDashboard /></ProtectedRoute>} />
      <Route path="/staff/stock-in" element={<ProtectedRoute allowedRoles={staff}><StockInPage /></ProtectedRoute>} />
      <Route path="/staff/stock-out" element={<ProtectedRoute allowedRoles={staff}><StockOutPage /></ProtectedRoute>} />
      <Route path="/staff/scanner" element={<ProtectedRoute allowedRoles={staff}><ScannerPage /></ProtectedRoute>} />
      <Route path="/staff/search" element={<ProtectedRoute allowedRoles={staff}><ProductSearchPage /></ProtectedRoute>} />
      <Route path="/staff/tasks" element={<ProtectedRoute allowedRoles={staff}><AssignedTasksPage /></ProtectedRoute>} />
      <Route path="/staff/damaged-goods" element={<ProtectedRoute allowedRoles={staff}><DamagedGoodsPage /></ProtectedRoute>} />
    </>
  );
}