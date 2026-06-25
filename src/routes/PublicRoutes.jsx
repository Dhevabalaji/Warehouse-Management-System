import { Route } from "react-router-dom";

import LandingPage from "../features/landing/LandingPage";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import ForbiddenPage from "../features/auth/ForbiddenPage";

export default function PublicRoutes() {
  return (
    <>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/403" element={<ForbiddenPage />} />
    </>
  );
}