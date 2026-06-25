import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import ManagerDashboard from "../features/manager/ManagerDashboard";
import ProductsPage from "../features/manager/ProductsPage";
import CreateProductPage from "../features/manager/CreateProductPage";
import InventoryPage from "../features/manager/InventoryPage";
import SuppliersPage from "../features/manager/SuppliersPage";
import CreateSupplierPage from "../features/manager/CreateSupplierPage";
import PurchaseOrdersPage from "../features/manager/PurchaseOrdersPage";
import CreatePurchaseOrderPage from "../features/manager/CreatePurchaseOrderPage";
import StockRequestsPage from "../features/manager/StockRequestsPage";
import StockMovementsPage from "../features/manager/StockMovementsPage";
import InventoryTransferPage from "../features/manager/InventoryTransferPage";
import InventoryTransfersListPage from "../features/manager/InventoryTransfersListPage";
import AssignTaskPage from "../features/manager/AssignTaskPage";
import AnalyticsPage from "../features/manager/AnalyticsPage";

const manager = ["manager"];

export default function ManagerRoutes() {
  return (
    <>
      <Route path="/manager/dashboard" element={<ProtectedRoute allowedRoles={manager}><ManagerDashboard /></ProtectedRoute>} />
      <Route path="/manager/products" element={<ProtectedRoute allowedRoles={manager}><ProductsPage /></ProtectedRoute>} />
      <Route path="/manager/create-product" element={<ProtectedRoute allowedRoles={manager}><CreateProductPage /></ProtectedRoute>} />
      <Route path="/manager/inventory" element={<ProtectedRoute allowedRoles={manager}><InventoryPage /></ProtectedRoute>} />
      <Route path="/manager/suppliers" element={<ProtectedRoute allowedRoles={manager}><SuppliersPage /></ProtectedRoute>} />
      <Route path="/manager/create-supplier" element={<ProtectedRoute allowedRoles={manager}><CreateSupplierPage /></ProtectedRoute>} />
      <Route path="/manager/purchase-orders" element={<ProtectedRoute allowedRoles={manager}><PurchaseOrdersPage /></ProtectedRoute>} />
      <Route path="/manager/create-purchase-order" element={<ProtectedRoute allowedRoles={manager}><CreatePurchaseOrderPage /></ProtectedRoute>} />
      <Route path="/manager/stock-requests" element={<ProtectedRoute allowedRoles={manager}><StockRequestsPage /></ProtectedRoute>} />
      <Route path="/manager/stock-movements" element={<ProtectedRoute allowedRoles={manager}><StockMovementsPage /></ProtectedRoute>} />
      <Route path="/manager/create-transfer" element={<ProtectedRoute allowedRoles={manager}><InventoryTransferPage /></ProtectedRoute>} />
      <Route path="/manager/transfers" element={<ProtectedRoute allowedRoles={manager}><InventoryTransfersListPage /></ProtectedRoute>} />
      <Route path="/manager/assign-task" element={<ProtectedRoute allowedRoles={manager}><AssignTaskPage /></ProtectedRoute>} />
      <Route path="/manager/analytics" element={<ProtectedRoute allowedRoles={manager}><AnalyticsPage /></ProtectedRoute>} />
    </>
  );
}