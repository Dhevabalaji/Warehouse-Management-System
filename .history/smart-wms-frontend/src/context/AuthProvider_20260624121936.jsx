import { useState } from "react";
import AuthContext from "./AuthContext";
import { demoUsers } from "../data/mockData";

function getSavedUser() {
  try {
    const savedUser = localStorage.getItem("wms_user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);

  const login = ({ email, password, role, companyCode }) => {
    const customUsers =
      JSON.parse(localStorage.getItem("wms_custom_users")) || [];

    const allUsers = [...demoUsers, ...customUsers];

    const foundUser = allUsers.find(
      (u) =>
        u.email === email &&
        u.password === password &&
        u.role === role &&
        u.companyCode === companyCode
    );

    if (!foundUser) {
      return { success: false };
    }

    localStorage.setItem("wms_user", JSON.stringify(foundUser));
    setUser(foundUser);

    return { success: true, user: foundUser };
  };

  const logout = () => {
    localStorage.removeItem("wms_user");
    setUser(null);
  };

  const registerTenant = (formData) => {
    const tenant = {
      tenantId: `TNT${Date.now()}`,
      companyName: formData.companyName,
      companyCode: formData.companyCode,
    };

    const adminUser = {
      id: Date.now(),
      name: formData.adminName,
      email: formData.adminEmail,
      password: formData.password,
      role: "admin",
      tenantId: tenant.tenantId,
      companyCode: formData.companyCode,
    };

    const tenants = JSON.parse(localStorage.getItem("wms_tenants")) || [];
    const users = JSON.parse(localStorage.getItem("wms_custom_users")) || [];

    localStorage.setItem("wms_tenants", JSON.stringify([...tenants, tenant]));
    localStorage.setItem(
      "wms_custom_users",
      JSON.stringify([...users, adminUser])
    );

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        registerTenant,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}