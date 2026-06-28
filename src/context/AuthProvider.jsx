import { useMemo, useState } from "react";
import AuthContext from "./AuthContext";
import { demoUsers } from "../data/mockData";
import { loginUser, registerCompany, logoutUser } from "../services/authService";

const USER_KEY = "wms_user";
const TOKEN_KEY = "wms_token";
const CUSTOM_USERS_KEY = "wms_custom_users";
const TENANTS_KEY = "wms_tenants";

const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === "true";

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalize(value) {
  return String(value || "").trim();
}

function normalizeCode(value) {
  return normalize(value).toUpperCase();
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJSON(USER_KEY, null));
  const [loading, setLoading] = useState(false);

  const login = async ({ email, password, role, companyCode }) => {
    setLoading(true);

    try {
      if (USE_BACKEND) {
        const response = await loginUser({
          email,
          password,
          role,
          companyCode,
        });

        localStorage.setItem(TOKEN_KEY, response.token);
        saveJSON(USER_KEY, response.user);
        setUser(response.user);

        return {
          success: true,
          user: response.user,
        };
      }

      const customUsers = readJSON(CUSTOM_USERS_KEY, []);
      const allUsers = [...demoUsers, ...customUsers];

      const foundUser = allUsers.find(
        (item) =>
          item.email.toLowerCase() === normalize(email).toLowerCase() &&
          item.password === password &&
          item.role === role &&
          item.companyCode === normalizeCode(companyCode)
      );

      if (!foundUser) {
        return {
          success: false,
          message: "Invalid company code, email, password or role",
        };
      }

      saveJSON(USER_KEY, foundUser);
      setUser(foundUser);

      return {
        success: true,
        user: foundUser,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutUser();
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const registerTenant = async (formData) => {
    setLoading(true);

    try {
      if (USE_BACKEND) {
        await registerCompany({
          companyName: formData.companyName,
          companyCode: formData.companyCode,
          companyEmail: formData.companyEmail,
          phone: formData.phone,
          address: formData.address,
          adminName: formData.adminName,
          adminEmail: formData.adminEmail,
          password: formData.password,
        });

        return {
          success: true,
        };
      }

      const tenants = readJSON(TENANTS_KEY, []);
      const users = readJSON(CUSTOM_USERS_KEY, []);

      const companyCode = normalizeCode(formData.companyCode);
      const adminEmail = normalize(formData.adminEmail).toLowerCase();

      const companyExists = tenants.some(
        (tenant) => tenant.companyCode === companyCode
      );

      if (companyExists) {
        return {
          success: false,
          message: "Company code already exists",
        };
      }

      const emailExists = [...demoUsers, ...users].some(
        (existingUser) => existingUser.email.toLowerCase() === adminEmail
      );

      if (emailExists) {
        return {
          success: false,
          message: "Admin email already exists",
        };
      }

      const tenant = {
        tenantId: `TNT-${Date.now()}`,
        companyName: normalize(formData.companyName),
        companyCode,
        companyEmail: normalize(formData.companyEmail).toLowerCase(),
        phone: normalize(formData.phone),
        address: normalize(formData.address),
        createdAt: new Date().toISOString(),
      };

      const adminUser = {
        id: Date.now(),
        name: normalize(formData.adminName),
        email: adminEmail,
        password: formData.password,
        role: "admin",
        tenantId: tenant.tenantId,
        companyCode,
        warehouse: "Head Office",
        createdAt: new Date().toISOString(),
      };

      saveJSON(TENANTS_KEY, [...tenants, tenant]);
      saveJSON(CUSTOM_USERS_KEY, [...users, adminUser]);

      return {
        success: true,
        tenant,
        user: adminUser,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      registerTenant,
      useBackend: USE_BACKEND,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}