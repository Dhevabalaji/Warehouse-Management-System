import { Route } from "react-router-dom";
import LandingPage from "../features/auth/LandingPage.jsx";
import LoginPage from "../features/auth/LoginPage.jsx";
import RegisterPage from "../features/auth/RegisterPage.jsx";

export default function PublicRoutes() {
  return (
    <>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </>
  );
}