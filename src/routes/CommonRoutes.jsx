import { Route } from "react-router-dom";
import ForbiddenPage from "../features/auth/ForbiddenPage.jsx";

export default function CommonRoutes() {
  return (
    <>
      <Route path="/403" element={<ForbiddenPage />} />
    </>
  );
}