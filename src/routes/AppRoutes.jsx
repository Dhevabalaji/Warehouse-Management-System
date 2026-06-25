import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import CommonRoutes from "./CommonRoutes";
import AdminRoutes from "./AdminRoutes";
import ManagerRoutes from "./ManagerRoutes";
import StaffRoutes from "./StaffRoutes";

import NotFoundPage from "../features/auth/NotFoundPage";

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