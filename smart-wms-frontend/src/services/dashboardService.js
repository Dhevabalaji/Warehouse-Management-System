import api from "./api";

export const dashboardService = {
  getSummary: async () => {
    const res = await api.get("/dashboard/summary");
    return res.data;
  },

  getAdminDashboard: async () => {
    const res = await api.get("/dashboard/admin");
    return res.data;
  },

  getReports: async () => {
    const res = await api.get("/dashboard/reports");
    return res.data;
  },
};