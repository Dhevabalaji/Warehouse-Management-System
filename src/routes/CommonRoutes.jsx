import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import NotificationsPage from "../features/common/NotificationsPage";
import ProfilePage from "../features/common/ProfilePage";

export default function CommonRoutes() {
  return (
    <>
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
    </>
  );
}