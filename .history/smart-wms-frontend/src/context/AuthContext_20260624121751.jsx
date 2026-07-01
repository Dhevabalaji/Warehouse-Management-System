import { createContext, useContext, useState } from "react";
import { demoUsers } from "../data/mockData";

const AuthContext = createContext(null);

function getSavedUser() {
  try {
    const savedUser = localStorage.getItem("wms_user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
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
      return { success: false, message: "Invalid login details" };
    }

    localStorage.setItem("wms_user", JSON.stringify(foundUser));
    setUser(foundUser);

    return { success: true, user: foundUser };
  };

  const registerTenant = (formData) => {
    const tenant = {
      tenantId: `TNT${Date.now()}`,
      companyName: formData.companyName,
      companyCode: formData.companyCode,
      companyEmail: formData.companyEmail,
      address: formData.address,
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

  const logout = () => {
    localStorage.removeItem("wms_user");
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    registerTenant,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}