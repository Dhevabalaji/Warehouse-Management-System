import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoutes from "./PublicRoutes.jsx";
import CommonRoutes from "./CommonRoutes.jsx";
import AdminRoutes from "./AdminRoutes.jsx";
import ManagerRoutes from "./ManagerRoutes.jsx";
import StaffRoutes from "./StaffRoutes.jsx";
import NotFoundPage from "../features/auth/NotFoundPage.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      {PublicRoutes()}
      {CommonRoutes()}
      {AdminRoutes()}
      {ManagerRoutes()}
      {StaffRoutes()}

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}