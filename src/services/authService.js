import api from "./api";

export async function registerCompany(payload) {
  const response = await api.post("/auth/register", payload);
  return response.data;
}

export async function loginUser(payload) {
  const response = await api.post("/auth/login", payload);
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get("/auth/me");
  return response.data;
}

export function logoutUser() {
  localStorage.removeItem("wms_token");
  localStorage.removeItem("wms_user");
}